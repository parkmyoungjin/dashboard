import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const TimelineBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 32,
  borderRadius: theme.spacing(0.75),
  marginBottom: theme.spacing(0.75),
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

const MonthLabel = styled(Typography, {
  shouldComponentUpdate: props => props.isCurrentMonth,
  // eslint-disable-next-line no-unused-vars
  shouldForwardProp: prop => prop !== 'isCurrentMonth'
})(({ theme, isCurrentMonth }) => ({
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
  const [highlightedProject, setHighlightedProject] = useState(null);

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
        const response = await fetch('/api/sheets?sheet=ProgressSection');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length <= 1) {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }

        // 헤더를 제외한 데이터 행을 처리
        const formattedProjects = data.slice(1).map((row, index) => ({
          id: index,  // 프로젝트 식별을 위한 id 추가
          name: row[0] || '',
          description: row[1] || '',
          duration: { 
            start: parseInt(row[2].split('-')[1]) || 1,
            end: parseInt(row[3].split('-')[1]) || 12
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

    // ProgressSection의 현재 선택된 프로젝트 변경 감지
    const handleProgressChange = (event) => {
      if (event.detail) {
        setHighlightedProject(event.detail.currentIndex);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('progressProjectChange', handleProgressChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('progressProjectChange', handleProgressChange);
    };
  }, []);

  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
  const currentDay = currentDate.getDate();
  
  const monthProgress = (currentDay - 1) / daysInMonth;
  const currentPosition = ((currentMonth - 1) * 8.33) + (monthProgress * 8.33);

  // 프로젝트를 최적 배치하고 동일 기간 프로젝트는 같은 바에 배치
  const arrangeProjects = () => {
    const rows = [];
    
    // 시작 시점과 종료 시점으로 정렬
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.duration.start !== b.duration.start) {
        return a.duration.start - b.duration.start;
      }
      return a.duration.end - b.duration.end;
    });

    // 동일 기간 프로젝트 그룹화
    const groupedProjects = [];
    let currentGroup = [];

    sortedProjects.forEach((project, index) => {
      if (index === 0) {
        currentGroup.push(project);
      } else {
        const prevProject = currentGroup[0];
        if (prevProject.duration.start === project.duration.start && 
            prevProject.duration.end === project.duration.end && 
            currentGroup.length < 2) {
          currentGroup.push(project);
        } else {
          if (currentGroup.length > 0) {
            groupedProjects.push([...currentGroup]);
          }
          currentGroup = [project];
        }
      }
    });
    if (currentGroup.length > 0) {
      groupedProjects.push(currentGroup);
    }

    // 그룹화된 프로젝트 배치
    groupedProjects.forEach(group => {
      let placed = false;
      
      for (let i = 0; i < rows.length && !placed; i++) {
        const row = rows[i];
        const lastGroup = row[row.length - 1];
        
        if (!lastGroup || lastGroup[0].duration.end < group[0].duration.start) {
          row.push(group);
          placed = true;
        }
      }
      
      if (!placed) {
        rows.push([group]);
      }
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

  // ProjectBar 스타일 수정
  const getProjectStyle = (projectGroup, rowIndex, index) => {
    const isHighlighted = projectGroup.some(p => p.id === highlightedProject);
    return {
      left: `calc(${(projectGroup[0].duration.start - 1) * 8.33}% + 2px)`,
      width: `calc(${(projectGroup[0].duration.end - projectGroup[0].duration.start + 1) * 8.33}% - 4px)`,
      background: (theme) => 
        `linear-gradient(90deg, 
          ${isHighlighted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'} 0%, 
          ${projectGroup[0].color} 100%)`,
      boxShadow: isHighlighted 
        ? '0 0 15px rgba(96, 165, 250, 0.5)'
        : '0 1px 2px rgba(0,0,0,0.1)',
      zIndex: isHighlighted ? 2 : 1,
      transform: isHighlighted ? 'scale(1.05)' : 'none',
    };
  };

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1.5
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
          }}
        >
          타임라인
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{
            bgcolor: '#0f172a',
            color: '#60a5fa',
            px: 2,
            py: 0.5,
            borderRadius: '100px',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            완료
          </Box>
          <Box sx={{
            bgcolor: '#0f172a',
            color: '#fff',
            px: 2,
            py: 0.5,
            borderRadius: '100px',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            진행중
          </Box>
        </Box>
      </Box>
      <Box sx={{
        flex: 1,
        width: '100%',
        bgcolor: '#0f172a',
        borderRadius: 2,
        p: 2,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box>
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
            {projectRows.map((row, rowIndex) => (
              <TimelineBar 
                key={rowIndex}
                sx={{ 
                  height: `${Math.max(20, 180 / projectRows.length)}px`,
                  marginBottom: `${Math.max(4, 16 / projectRows.length)}px`
                }}
              >
                {row.map((projectGroup, index) => (
                  <Tooltip 
                    key={`${rowIndex}-${index}`}
                    title={projectGroup.map(p => `${p.name}: ${p.description}`).join('\n')}
                    arrow
                  >
                    <ProjectBar
                      sx={{
                        ...getProjectStyle(projectGroup, rowIndex, index),
                        height: '100%',
                        fontSize: `${Math.max(1, 1.1 - (projectRows.length * 0.1))}rem`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 8px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {projectGroup.map((project, pIndex) => (
                        <Box
                          key={`${project.id}-${pIndex}`}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: projectGroup.length > 1 ? '45%' : '100%'
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              transition: 'all 0.5s ease-in-out',
                              color: project.id === highlightedProject ? '#ffffff' : 
                                    (currentMonth > project.duration.end ? '#60a5fa' : '#ffffff'),
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: project.id === highlightedProject ? 700 : 600,
                              fontSize: 'inherit',
                              textShadow: project.id === highlightedProject 
                                ? '0 0 10px rgba(255, 255, 255, 0.5)'
                                : '0 1px 2px rgba(0,0,0,0.2)',
                              letterSpacing: '0.2px',
                              width: '100%'
                            }}
                          >
                            {project.name}
                          </Typography>
                          {pIndex === 0 && projectGroup.length > 1 && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#60a5fa',
                                mx: 0.5,
                                fontWeight: 400
                              }}
                            >
                              /
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </ProjectBar>
                  </Tooltip>
                ))}
              </TimelineBar>
            ))}
            <CurrentDateLine left={currentPosition} />
          </TimelineContainer>
        </Box>
      </Box>
    </Box>
  );
} 