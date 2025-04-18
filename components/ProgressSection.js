import { Box, Typography, Paper, Fade, Chip, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSheetData } from '../contexts/SheetDataContext';

export default function ProgressSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const { data, loading, error } = useSheetData();
  const [projects, setProjects] = useState([]);

  // 날짜 형식 처리 함수
  const parseDate = (dateStr, isEndDate = false) => {
    if (!dateStr) return null;
    
    // YYYY-MM 형식 체크
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-').map(Number);
      if (isEndDate) {
        // month는 0-based이므로 현재 달의 마지막 날을 구하기 위해 다음 달의 0일을 구함
        return new Date(Date.UTC(year, month - 1, 0));
      }
      return new Date(Date.UTC(year, month - 1, 1));
    }
    // YYYY-MM-DD 형식 체크
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    }
    return null;
  };

  // 진행률 계산 함수
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = parseDate(startDate, false);
    const end = parseDate(endDate, true);
    
    if (!start || !end) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거하고 날짜만 비교
    const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // 시작일과 종료일이 미래인 경우 체크
    if (start.getTime() > todayUtc.getTime()) return null;  // 시작일이 미래면 null 반환
    if (todayUtc.getTime() > end.getTime()) return 100;     // 종료일이 지났으면 100% 반환
    
    const total = end.getTime() - start.getTime();
    const current = todayUtc.getTime() - start.getTime();
    
    return Math.round((current / total) * 100);
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
    }, 5000);

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