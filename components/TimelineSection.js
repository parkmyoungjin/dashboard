import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useSheetData } from '../contexts/SheetDataContext';

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
  shouldForwardProp: prop => prop !== 'isCurrentMonth'
})(({ theme, isCurrentMonth }) => ({
  fontSize: '0.9rem',
  color: isCurrentMonth ? theme.palette.primary.main : theme.palette.text.secondary,
  textAlign: 'center',
  position: 'relative',
  paddingBottom: theme.spacing(1.5),
  fontWeight: isCurrentMonth ? 600 : 400,
  zIndex: 3,
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
  width: 3,
  height: '100%',
  bottom: 0,
  background: 'linear-gradient(180deg, #4ade80 0%, rgba(74, 222, 128, 0.2) 100%)',
  zIndex: 1,
  '&::before': {
    content: '"Today"',
    position: 'absolute',
    bottom: -26,
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#4ade80',
    fontSize: '0.875rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    zIndex: 3
  }
}));

export default function TimelineSection() {
  const [highlightedProject, setHighlightedProject] = useState(null);
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
        return new Date(Date.UTC(year, month, 0));
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

  // 프로젝트 데이터에서 날짜 범위 가져오기
  const getProjectDateRange = (projectsData) => {
    if (!projectsData || projectsData.length === 0) {
      return {
        minDate: new Date(new Date().getFullYear(), 0, 1),
        maxDate: new Date(new Date().getFullYear(), 11, 31)
      };
    }
    
    let minDate = new Date(3000, 0, 1); // 미래 날짜로 초기화
    let maxDate = new Date(1970, 0, 1); // 과거 날짜로 초기화
    
    // 모든 프로젝트를 돌면서 최소/최대 날짜 찾기
    projectsData.forEach(row => {
      if (!row[2] || !row[3]) return;
      
      const startDate = parseDate(row[2], false);
      const endDate = parseDate(row[3], true);
      
      if (startDate && startDate < minDate) minDate = startDate;
      if (endDate && endDate > maxDate) maxDate = endDate;
    });
    
    // 기본값: 현재 연도
    if (minDate > maxDate) {
      minDate = new Date(new Date().getFullYear(), 0, 1);
      maxDate = new Date(new Date().getFullYear(), 11, 31);
    }
    
    return { minDate, maxDate };
  };

  // 날짜를 타임라인 위치값으로 변환하는 함수 - 올해 기준으로 변경
  const getDatePosition = (date) => {
    if (!date) return 0;
    
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    
    // 날짜가 올해 이전이면 0% 반환
    if (date.getFullYear() < currentYear) {
      return 0;
    }
    
    // 날짜가 올해 이후면 100% 반환
    if (date.getFullYear() > currentYear) {
      return 100;
    }
    
    // 올해 날짜의 경우 해당 연도 내 위치 계산
    const daysInYear = 365; // 윤년은 고려하지 않음
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    return (dayOfYear / daysInYear) * 100;
  };

  // 파스텔 색상 생성 함수
  const getProjectColor = (index) => {
    const colors = [
      'hsla(169, 80%, 50%, 0.8)',  // 민트/터콰이즈 (#2DD4BF)
      'hsla(173, 80%, 45%, 0.8)',  // 약간 어두운 터콰이즈
      'hsla(166, 84%, 40%, 0.8)',  // 더 어두운 터콰이즈 (#14B8A6)
      'hsla(180, 85%, 50%, 0.8)',  // 밝은 청록색
      'hsla(155, 75%, 45%, 0.8)',  // 초록빛 민트
      'hsla(187, 85%, 55%, 0.8)',  // 밝은 하늘색
      'hsla(176, 90%, 35%, 0.8)',  // 진한 터콰이즈
      'hsla(162, 80%, 45%, 0.8)',  // 초록빛 터콰이즈
      'hsla(182, 85%, 55%, 0.8)',  // 하늘빛 터콰이즈
      'hsla(169, 80%, 50%, 0.8)',  // 민트/터콰이즈 (#2DD4BF)
    ];
    return colors[index % colors.length];
  };

  // 데이터 변환 처리
  useEffect(() => {
    if (!data || data.length <= 1) return;
    
    // 헤더를 제외한 데이터 행을 처리
    const formattedProjects = data.slice(1).map((row, index) => {
      const startDate = parseDate(row[2], false);
      const endDate = parseDate(row[3], true);
      
      return {
        id: index,
        name: row[0] || '',
        description: row[1] || '',
        duration: { 
          start: startDate ? getDatePosition(startDate) : 0,
          end: endDate ? getDatePosition(endDate) : 100
        },
        color: getProjectColor(index),
      };
    });
    
    setProjects(formattedProjects);
  }, [data]);

  // ProgressSection의 현재 선택된 프로젝트 변경 감지
  useEffect(() => {
    const handleProgressChange = (event) => {
      if (event.detail) {
        setHighlightedProject(event.detail.currentIndex);
      }
    };

    window.addEventListener('progressProjectChange', handleProgressChange);
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
    return {
      left: `calc(${projectGroup[0].duration.start}% + 2px)`,
      width: `calc(${projectGroup[0].duration.end - projectGroup[0].duration.start}% - 4px)`,
      background: (theme) => 
        `linear-gradient(90deg, 
          rgba(255,255,255,0.1) 0%, 
          ${projectGroup[0].color} 100%)`,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      zIndex: 1,
      transform: 'none',
    };
  };

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#0F2942',
      borderRadius: 2,
      p: 0
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
            fontSize: '1.5rem',
            color: '#fff',
          }}
        >
          타임라인
        </Typography>
      </Box>
      <Box sx={{
        flex: 1,
        width: '100%',
        bgcolor: '#0B1929',
        borderRadius: 1,
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
                            width: projectGroup.length > 1 ? '45%' : '100%',
                            justifyContent: pIndex === 1 ? 'flex-end' : 'flex-start',
                            textAlign: pIndex === 1 ? 'right' : 'left'
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              transition: 'all 0.5s ease-in-out',
                              color: project.id === highlightedProject ? '#2DD4BF' : 
                                    (currentMonth > project.duration.end ? '#2DD4BF' : '#ffffff'),
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: project.id === highlightedProject ? 600 : 400,
                              fontSize: 'inherit',
                              letterSpacing: '0.2px',
                              width: '100%',
                              textAlign: 'inherit'
                            }}
                          >
                            {project.name}
                          </Typography>
                          {pIndex === 0 && projectGroup.length > 1 && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#2DD4BF',
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