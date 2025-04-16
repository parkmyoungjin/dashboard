import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 뉴스 우선순위 점수를 계산하는 함수
  const getPriorityScore = (newsItem) => {
    const title = newsItem.title.toLowerCase();
    if (title.includes('부산대학교병원') || title.includes('부산대병원')) return 2;
    if (title.includes('의료') || title.includes('병원') || title.includes('의사')) return 1;
    return 0;
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      
      // API 응답 데이터 구조 확인
      console.log('API Response:', data[0]);
      
      // HTML 엔티티를 실제 문자로 변환하는 함수
      const decodeHTMLEntities = (text) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
      };

      // 우선순위에 따라 뉴스 정렬
      const sortedNews = data.sort((a, b) => {
        const priorityA = getPriorityScore(a);
        const priorityB = getPriorityScore(b);
        return priorityB - priorityA; // 높은 우선순위가 앞으로
      }).map(news => {
        // URL에서 도메인 추출
        let source = '의료뉴스';
        try {
          const url = new URL(news.link);
          const domain = url.hostname.replace('www.', '');
          // 도메인별 언론사 이름 매핑
          const sourceMap = {
            'whosaeng.com': '후생신보',
            'businessplus.kr': '비즈니스플러스',
            // 필요한 경우 여기에 더 많은 매핑을 추가할 수 있습니다
          };
          source = sourceMap[domain] || domain;
        } catch (e) {
          console.error('Error parsing URL:', e);
        }

        // 날짜 형식 변환
        let formattedDate = '날짜 정보 없음';
        try {
          if (news.pubDate) {
            formattedDate = news.pubDate;  // API에서 이미 형식화된 날짜를 직접 사용
          }
        } catch (e) {
          console.error('Error formatting date:', e);
        }

        return {
          ...news,
          title: decodeHTMLEntities(news.title), // 제목의 HTML 엔티티 디코딩
          source,
          date: formattedDate
        };
      });
      
      setNews(sortedNews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('뉴스를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // 1분마다 새로운 뉴스 가져오기
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  // 10초마다 다음 뉴스로 전환
  useEffect(() => {
    if (news.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [news.length]);

  if (loading) {
    return (
      <Box sx={{ 
        height: '100%',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        bgcolor: '#1e293b',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            mb: 1.5
          }}
        >
          오늘의 메디컬 이슈
        </Typography>
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          bgcolor: '#0f172a',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress size={20} />
          <Typography sx={{ ml: 2, fontSize: '0.9rem' }}>뉴스를 불러오는 중...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        height: '100%',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        bgcolor: '#1e293b',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            mb: 1.5
          }}
        >
          오늘의 메디컬 이슈
        </Typography>
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          bgcolor: '#0f172a',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography color="error" fontSize="0.9rem">{error}</Typography>
        </Box>
      </Box>
    );
  }

  if (!news.length) {
    return (
      <Box sx={{ 
        height: '100%',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        bgcolor: '#1e293b',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            mb: 1.5
          }}
        >
          오늘의 메디컬 이슈
        </Typography>
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          bgcolor: '#0f172a',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography fontSize="0.9rem">표시할 뉴스가 없습니다.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      p: 2,
      bgcolor: '#1e293b',
      borderRadius: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontSize: '1rem',
          color: '#fff',
          mb: 1.5
        }}
      >
        오늘의 메디컬 이슈
      </Typography>
      <Box sx={{ 
        height: 'calc(100% - 10px)',
        width: '100%',
        bgcolor: '#0f172a',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {news[currentIndex]?.source}
          </Typography>
          <Link 
            href={news[currentIndex]?.link} 
            target="_blank" 
            rel="noopener"
            sx={{ 
              color: '#fff',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <Typography sx={{ 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '1.5rem',
              lineHeight: 1.3,
              mb: 0.5
            }}>
              {news[currentIndex]?.title}
            </Typography>
          </Link>
          <Typography sx={{ 
            color: '#94a3b8',
            fontSize: '0.8rem'
          }}>
            {news[currentIndex]?.date}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 0.5,
          mt: 1
        }}>
          {news.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                bgcolor: index === currentIndex ? '#60a5fa' : 'rgba(96, 165, 250, 0.3)',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
