import { Box, Typography, Paper, Fade, Chip } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ProgressSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 구글 시트에서 데이터 가져오기
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/sheets?sheet=ProgressSection');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length <= 1) {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }

        // 헤더를 제외한 데이터 행을 처리
        const formattedProjects = data.slice(1).map(row => ({
          name: row[0] || '',
          overview: row[1] || '',
          period: row[2] && row[3] ? `${row[2]} ~ ${row[3]}` : '',
          status: row[4] || '진행중'
        }));
        
        setProjects(formattedProjects);
        setError(null);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    // 5초마다 다음 프로젝트로 전환
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        setShow(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects]);

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
        bgcolor: '#1e293b',
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
          flex: 1,
          bgcolor: '#0f172a',
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
        bgcolor: '#1e293b',
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
          flex: 1,
          bgcolor: '#0f172a',
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
        bgcolor: '#1e293b',
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
          flex: 1,
          bgcolor: '#0f172a',
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

  return (
    <Box sx={{ 
      height: '192px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#1e293b',
      borderRadius: 1
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontSize: '1rem',
          color: '#fff',
          mb: 1.5,
          flexShrink: 0
        }}
      >
        현재 진행중인 사업 현황
      </Typography>

      <Box sx={{ 
        height: 'calc(100% - 44px)',
        width: '100%',
        bgcolor: '#0f172a',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Fade in={show} timeout={500}>
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}>
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1 
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: '#60a5fa'
                  }}
                >
                  {currentProject.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                    }}
                  >
                    사업기간: {currentProject.period}
                  </Typography>
                  <Chip 
                    label="진행중" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#059669',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      '& .MuiChip-label': {
                        color: '#ffffff'
                      }
                    }} 
                  />
                </Box>
              </Box>

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
                    bgcolor: index === currentIndex ? '#60a5fa' : 'rgba(96, 165, 250, 0.3)',
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
} 