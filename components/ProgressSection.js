import { Box, Typography, Paper, Fade, Chip, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSheetData } from '../contexts/SheetDataContext';

export default function ProgressSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const { data, loading, error } = useSheetData();
  const [projects, setProjects] = useState([]);

  // 날짜 형식 처리 함수 - 완전히 새로운 구현
  const parseDate = (dateStr, isEndDate = false) => {
    if (!dateStr) return null;
    
    try {
      // YYYY-MM 형식 체크
      if (/^\d{4}-\d{2}$/.test(dateStr)) {
        const [year, month] = dateStr.split('-').map(Number);
        
        if (isEndDate) {
          // 월의 마지막 날 계산 (다음 달의 첫 날에서 하루 빼기)
          const nextMonth = new Date(year, month, 1);
          return new Date(nextMonth.getTime() - 86400000); // 하루를 밀리초로 빼기
        } else {
          // 월의 첫 날
          return new Date(year, month - 1, 1);
        }
      } 
      // YYYY-MM-DD 형식 체크
      else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      return null;
    } catch (error) {
      console.error("날짜 파싱 오류:", error);
      return null;
    }
  };

  // 두 날짜 사이의 일수 계산 함수
  const getDaysBetween = (startDate, endDate) => {
    // 시간 제거하고 날짜만 비교하기 위해 날짜를 00:00:00으로 설정
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    // 밀리초 -> 일
    return Math.round((end - start) / (24 * 60 * 60 * 1000));
  };

  // 진행률 계산 함수 - 완전히 새로운 구현
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    // 날짜 파싱
    const start = parseDate(startDate, false);
    const end = parseDate(endDate, true);
    
    if (!start || !end) return null;
    
    // 현재 날짜 (시간 정보 제거)
    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // 시작일이 미래인 경우
    if (currentDate < start) {
      return 0;
    }
    
    // 종료일이 지난 경우
    if (currentDate > end) {
      return 100;
    }
    
    // 총 기간(일)
    const totalDays = getDaysBetween(start, end);
    
    // 시작일부터 현재까지 기간(일)
    const passedDays = getDaysBetween(start, currentDate);
    
    // 진행률 계산 (소수점 반올림)
    return Math.round((passedDays / totalDays) * 100);
  };

  // 데이터 변환 처리
  useEffect(() => {
    if (!data || data.length <= 1) return;

    // 헤더를 제외한 데이터 행을 처리
    const formattedProjects = data.slice(1).map(row => ({
      name: row[0] || '',
      overview: row[1] || '',
      startDate: row[2] || '',
      endDate: row[3] || '',
      period: row[2] && row[3] ? `${row[2]} ~ ${row[3]}` : '',
      status: row[4] || '진행중'
    }));
    
    setProjects(formattedProjects);
  }, [data]);

  // 프로젝트 순환 표시 (5초 간격으로 변경)
  useEffect(() => {
    if (!projects || projects.length <= 1) return;

    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        setShow(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [projects]);

  // 프로젝트 변경 이벤트 발생
  useEffect(() => {
    const event = new CustomEvent('progressProjectChange', {
      detail: { currentIndex }
    });
    window.dispatchEvent(event);
  }, [currentIndex]);

  if (loading) {
    return (
      <Box sx={{ 
        height: '192px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0F2942',
        borderRadius: 1
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            mb: 0.75,
            flexShrink: 0,
          }}
        >
          현재 진행중인 사업 현황
        </Typography>

        <Box sx={{ 
          height: 'calc(100% - 10px)',
          bgcolor: '#0B1929',
          borderRadius: 2,
          p: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#94a3b8' }}>데이터를 불러오는 중입니다...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        height: '192px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0F2942',
        borderRadius: 1
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            mb: 0.75,
            flexShrink: 0,
          }}
        >
          현재 진행중인 사업 현황
        </Typography>

        <Box sx={{ 
          height: 'calc(100% - 10px)',
          bgcolor: '#0B1929',
          borderRadius: 2,
          p: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#ef4444' }}>데이터를 불러오는데 실패했습니다: {error}</Typography>
        </Box>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ 
        height: '192px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0F2942',
        borderRadius: 1
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            mb: 0.75,
            flexShrink: 0,
          }}
        >
          현재 진행중인 사업 현황
        </Typography>

        <Box sx={{ 
          height: 'calc(100% - 10px)',
          bgcolor: '#0B1929',
          borderRadius: 2,
          p: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#94a3b8' }}>구글 시트에서 진행중인 사업 데이터를 찾을 수 없습니다.</Typography>
        </Box>
      </Box>
    );
  }

  const currentProject = projects[currentIndex];
  const progress = calculateProgress(currentProject?.startDate, currentProject?.endDate);

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      p: 2,
      bgcolor: '#0F2942',
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
        진행 중 과제
      </Typography>
      <Box sx={{ 
        height: 'calc(100% - 10px)',
        width: '100%',
        bgcolor: '#0B1929',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Fade in={show}>
          <Box sx={{ 
            flex: 1, 
            display: 'flex',
            gap: 2,
            minWidth: 0
          }}>
            <Box sx={{ 
              flex: 1,
              minWidth: 0
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.3rem',
                  color: '#fff',
                  mb: 1,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-1.5px',
                  paddingRight: '8px'
                }}
              >
                {currentProject.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  mb: 1
                }}
              >
                사업기간: {currentProject.period}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#94a3b8',
                  fontSize: '1.1rem',
                  lineHeight: 1.5
                }}
              >
                {currentProject.overview}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              pt: 1
            }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <defs>
                    <linearGradient id="progressGradient">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <CircularProgress
                  variant="determinate"
                  value={progress === null ? 0 : progress}
                  size={80}
                  thickness={4}
                  sx={{
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                      stroke: progress === null ? '#94a3b8' : '#2DD4BF',
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontSize: '1.2rem',
                      color: '#fff',
                      fontWeight: 'bold',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    {progress === null ? '예정' : progress === 100 ? '완료' : `${progress}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 0.5,
          mt: 1
        }}>
          {projects.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                bgcolor: index === currentIndex ? '#2DD4BF' : 'rgba(45, 212, 191, 0.3)',
                transition: 'background-color 0.3s',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCurrentIndex(index);
                setShow(true);
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
} 