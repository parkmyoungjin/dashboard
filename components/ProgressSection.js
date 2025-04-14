import { Box, Typography, Paper, Fade } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ProgressSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

  // 현재 진행중인 사업 목록
  const currentProjects = [
    {
      name: 'KDI 예비타당성 조사',
      overview: '지역완결형 글로벌허브 메디컬센터 건립을 위한 예비타당성 조사 진행 중',
      period: '2024.01 ~ 2024.06',
      status: '진행중'
    },
    {
      name: '기본계획 수립',
      overview: '메디컬센터 건립을 위한 기본계획 수립 및 검토',
      period: '2024.03 ~ 2024.08',
      status: '진행중'
    },
    {
      name: '부지 환경성 검토',
      overview: '건립 부지에 대한 환경영향평가 및 환경성 검토 실시',
      period: '2024.02 ~ 2024.05',
      status: '진행중'
    }
  ];

  useEffect(() => {
    // 5초마다 다음 프로젝트로 전환
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % currentProjects.length);
        setShow(true);
      }, 500); // 페이드 아웃 후 다음 항목으로 전환
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentProject = currentProjects[currentIndex];

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
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'success.main',
                bgcolor: 'success.light',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              {currentProject.status}
            </Typography>
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
            {currentProjects.map((_, index) => (
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