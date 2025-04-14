import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const TimelineBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 28,
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
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
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  position: 'relative',
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
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
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
  const currentDay = currentDate.getDate();
  
  const monthProgress = (currentDay - 1) / daysInMonth;
  const currentPosition = ((currentMonth - 1) * 8.33) + (monthProgress * 8.33);

  const projects = [
    {
      name: 'KDI현장조사',
      duration: { start: 1, end: 2 },
      color: 'rgba(147, 197, 253, 0.9)',  // 파스텔 블루
      description: '현장 실사 및 기초 데이터 수집'
    },
    {
      name: '1차 질의/답변',
      duration: { start: 2, end: 4 },
      color: 'rgba(134, 239, 172, 0.9)',  // 파스텔 그린
      description: '초기 질의응답 및 피드백 반영'
    },
    {
      name: '로고/브랜딩',
      duration: { start: 3, end: 5 },
      color: 'rgba(253, 224, 71, 0.9)',   // 파스텔 옐로우
      description: '브랜드 아이덴티티 개발'
    },
    {
      name: '설문조사',
      duration: { start: 4, end: 6 },
      color: 'rgba(251, 207, 232, 0.9)',  // 파스텔 핑크
      description: '이해관계자 의견 수렴'
    }
  ];

  // 프로젝트를 3줄로 최적화하여 배치
  const arrangeProjects = () => {
    const rows = [[], [], []];  // 3줄로 고정
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.duration.start === b.duration.start) {
        return (b.duration.end - b.duration.start) - (a.duration.end - a.duration.start);
      }
      return a.duration.start - b.duration.start;
    });
    
    sortedProjects.forEach(project => {
      // 각 프로젝트를 배치할 최적의 행 찾기
      let bestRow = 0;
      let minOverlap = Infinity;
      
      for (let i = 0; i < 3; i++) {
        const overlap = rows[i].filter(existingProject => 
          !(project.duration.start > existingProject.duration.end || 
            project.duration.end < existingProject.duration.start)
        ).length;
        
        if (overlap < minOverlap) {
          minOverlap = overlap;
          bestRow = i;
        }
      }
      
      rows[bestRow].push(project);
    });
    
    return rows;
  };

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
        지역완결형 글로벌허브 메디컬센터 사업 추진 현황
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {months.map((month, index) => (
            <Grid item xs={1} key={index}>
              <MonthLabel>{month}</MonthLabel>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ position: 'relative' }}>
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
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                            fontSize: '0.7rem',
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
    </Box>
  );
} 