import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const TimelineBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 24,
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(0.25),
}));

const ProjectBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  borderRadius: theme.spacing(0.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(1.1)',
  },
}));

const MonthLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  position: 'relative',
  paddingBottom: theme.spacing(0.5),
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: `repeating-linear-gradient(
      90deg,
      transparent,
      transparent calc(8.33% - 1px),
      rgba(255, 255, 255, 0.1) calc(8.33% - 1px),
      rgba(255, 255, 255, 0.1) 8.33%
    )`,
    zIndex: 0,
  }
}));

const CurrentDateLine = styled(Box)(({ theme, left }) => ({
  position: 'absolute',
  left: `calc(${left}% - 1px)`,
  width: 2,
  height: '100%',
  top: 0,
  background: 'linear-gradient(180deg, #f87171 0%, rgba(248, 113, 113, 0.2) 100%)',
  zIndex: 2
}));

export default function TimelineSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await fetch('/api/sheets?sheet=TimelineSection');
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
          description: row[1] || '',
          duration: { 
            start: parseInt(row[2]) || 1, 
            end: parseInt(row[3]) || 12 
          },
          color: getRandomPastelColor(),
        }));
        
        setProjects(formattedProjects);
        setError(null);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  // 파스텔 색상 생성 함수
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 80%, 0.9)`;
  };

  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
  const currentDay = currentDate.getDate();
  
  const monthProgress = (currentDay - 1) / daysInMonth;
  const currentPosition = ((currentMonth - 1) * 8.33) + (monthProgress * 8.33);

  // 프로젝트를 3줄로 강제 배치
  const arrangeProjects = () => {
    const rows = [[], [], []];
    let currentRow = 0;

    // 시작 시점으로 정렬
    const sortedProjects = [...projects].sort((a, b) => a.duration.start - b.duration.start);
    
    sortedProjects.forEach(project => {
      rows[currentRow].push(project);
      currentRow = (currentRow + 1) % 3;
    });
    
    return rows;
  };

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

  const projectRows = arrangeProjects();

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1,
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'text.primary',
        }}
      >
        지역완결형 글로벌허브 메디컬센터 사업 추진 현황
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={0}>
          {months.map((month, index) => (
            <Grid item xs={1} key={index}>
              <MonthLabel>{month}</MonthLabel>
            </Grid>
          ))}
        </Grid>

        <TimelineContainer>
          {projectRows.map((row, rowIndex) => (
            <Box key={rowIndex}>
              {row.map((project, index) => (
                <Tooltip 
                  key={`${rowIndex}-${index}`}
                  title={`${project.name}: ${project.description}`}
                  arrow
                >
                  <TimelineBar>
                    <ProjectBar
                      sx={{
                        left: `${(project.duration.start - 1) * 8.33}%`,
                        width: `${(project.duration.end - project.duration.start + 1) * 8.33}%`,
                        background: project.color,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(0, 0, 0, 0.7)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 600,
                          fontSize: '0.65rem',
                        }}
                      >
                        {project.name}
                      </Typography>
                    </ProjectBar>
                  </TimelineBar>
                </Tooltip>
              ))}
            </Box>
          ))}
        </TimelineContainer>
        
        <CurrentDateLine left={currentPosition} />
      </Box>
    </Box>
  );
} 