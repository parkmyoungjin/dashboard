import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const TimelineBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 42,
  borderRadius: theme.spacing(0.75),
  marginBottom: theme.spacing(1),
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
  border: 'none',
  '&:hover': {
    filter: 'brightness(1.1)',
  },
}));

const MonthLabel = styled(Typography)(({ theme, isCurrentMonth }) => ({
  fontSize: '0.9rem',
  color: isCurrentMonth ? theme.palette.primary.main : theme.palette.text.secondary,
  textAlign: 'center',
  position: 'relative',
  paddingBottom: theme.spacing(1.5),
  fontWeight: isCurrentMonth ? 600 : 400,
  '&::after': isCurrentMonth ? {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main
  } : {}
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
  background: 'linear-gradient(180deg, #60a5fa 0%, rgba(96, 165, 250, 0.2) 100%)',
  zIndex: 2
}));

export default function TimelineSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 파스텔 색상 생성 함수
  const getProjectColor = (index) => {
    // 대시보드 테마와 어울리는 색상 배열
    const colors = [
      'hsla(217, 91%, 60%, 0.8)',  // 밝은 파란색 (#60a5fa)
      'hsla(199, 89%, 48%, 0.8)',  // 하늘색 (#0ea5e9)
      'hsla(186, 91%, 36%, 0.8)',  // 청록색 (#0d9488)
      'hsla(231, 91%, 60%, 0.8)',  // 인디고 (#6366f1)
      'hsla(262, 83%, 58%, 0.8)',  // 보라색 (#7c3aed)
      'hsla(291, 91%, 65%, 0.8)',  // 자주색 (#d946ef)
      'hsla(334, 86%, 46%, 0.8)',  // 분홍색 (#db2777)
      'hsla(245, 58%, 51%, 0.8)',  // 남색 (#4f46e5)
      'hsla(199, 89%, 48%, 0.8)',  // 하늘색 (#0ea5e9)
      'hsla(217, 91%, 60%, 0.8)',  // 밝은 파란색 (#60a5fa)
    ];
    
    return colors[index % colors.length];
  };

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
        const formattedProjects = data.slice(1).map((row, index) => ({
          name: row[0] || '',
          description: row[1] || '',
          duration: { 
            start: parseInt(row[2]) || 1, 
            end: parseInt(row[3]) || 12 
          },
          color: getProjectColor(index),
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

  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
  const currentDay = currentDate.getDate();
  
  const monthProgress = (currentDay - 1) / daysInMonth;
  const currentPosition = ((currentMonth - 1) * 8.33) + (monthProgress * 8.33);

  // 프로젝트를 최대 4줄로 최적 배치하고 겹치지 않는 프로젝트는 같은 행에 배치
  const arrangeProjects = () => {
    const rows = [[], [], [], []];  // 최대 4줄
    
    // 시작 시점으로 정렬
    const sortedProjects = [...projects].sort((a, b) => a.duration.start - b.duration.start);
    
    sortedProjects.forEach(project => {
      // 각 행을 순회하면서 프로젝트를 배치할 수 있는 위치 찾기
      let placed = false;
      
      for (let i = 0; i < rows.length && !placed; i++) {
        const row = rows[i];
        // 현재 행의 마지막 프로젝트 확인
        const lastProject = row[row.length - 1];
        
        // 행이 비어있거나 마지막 프로젝트와 겹치지 않으면 배치
        if (!lastProject || lastProject.duration.end < project.duration.start) {
          row.push(project);
          placed = true;
        } else {
          // 현재 행의 모든 프로젝트와 겹치는지 확인
          let canPlaceInRow = true;
          for (const existingProject of row) {
            // 프로젝트 기간이 겹치는지 확인
            if (!(existingProject.duration.end < project.duration.start || 
                 existingProject.duration.start > project.duration.end)) {
              canPlaceInRow = false;
              break;
            }
          }
          if (canPlaceInRow) {
            // 기간이 겹치지 않으면 현재 행에 추가하고 시작 시점 순으로 정렬
            row.push(project);
            row.sort((a, b) => a.duration.start - b.duration.start);
            placed = true;
          }
        }
      }
      
      // 모든 행을 확인했는데도 배치하지 못했다면 마지막 행에 강제 배치
      if (!placed) {
        rows[rows.length - 1].push(project);
      }
    });
    
    // 빈 행 제거
    return rows.filter(row => row.length > 0);
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
          mb: 2,
          fontWeight: 600,
          fontSize: '1rem',
          color: 'text.primary',
        }}
      >
        신사업추진팀 타임라인
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={0}>
          {months.map((month, index) => (
            <Grid item xs={1} key={index}>
              <MonthLabel isCurrentMonth={index + 1 === currentMonth}>
                {month}
              </MonthLabel>
            </Grid>
          ))}
        </Grid>

        <TimelineContainer>
          {projectRows.slice(0, 4).map((row, rowIndex) => (
            <TimelineBar key={rowIndex}>
              {row.map((project, index) => (
                <Tooltip 
                  key={`${rowIndex}-${index}`}
                  title={`${project.name}: ${project.description}`}
                  arrow
                >
                  <ProjectBar
                    sx={{
                      left: `calc(${(project.duration.start - 1) * 8.33}% + 2px)`,
                      width: `calc(${(project.duration.end - project.duration.start + 1) * 8.33}% - 4px)`,
                      background: (theme) => `linear-gradient(90deg, 
                        rgba(255,255,255,0.1) 0%, 
                        ${project.color} 100%)`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      zIndex: 1
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        letterSpacing: '0.2px',
                      }}
                    >
                      {project.name}
                    </Typography>
                  </ProjectBar>
                </Tooltip>
              ))}
            </TimelineBar>
          ))}
          <CurrentDateLine left={currentPosition} />
        </TimelineContainer>
      </Box>
    </Box>
  );
} 