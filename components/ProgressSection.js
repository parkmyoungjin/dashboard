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
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>데이터를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
        <Typography>데이터를 불러오는데 실패했습니다: {error}</Typography>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>구글 시트에서 진행중인 사업 데이터를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const currentProject = projects[currentIndex];

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'text.primary',
        }}
      >
        현재 진행중인 사업 현황
      </Typography>

      <Fade in={show} timeout={500}>
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
                fontSize: '1.1rem',
                color: 'primary.main'
              }}
            >
              {currentProject.name}
            </Typography>
            <Chip 
              label="진행중" 
              size="small" 
              sx={{ 
                bgcolor: 'success.main',
                color: '#ffffff',
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  color: '#ffffff'
                }
              }} 
            />
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              color: 'text.secondary',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
          >
            {currentProject.overview}
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            사업기간: {currentProject.period}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            gap: 1 
          }}>
            {projects.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? 'primary.main' : 'grey.300',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </Box>
        </Box>
      </Fade>
    </Box>
  );
} 