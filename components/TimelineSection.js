import { Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const TimelineBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 32,
  borderRadius: theme.spacing(0.5),
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
  zIndex: 1,
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
  
  // 현재 날짜의 정확한 위치 계산 (월간 진행률)
  const monthProgress = (currentDay - 1) / daysInMonth;
  const currentPosition = ((currentMonth - 1) * 8.33) + (monthProgress * 8.33);

  const projects = [
    {
      name: 'KDI현장조사',
      duration: { start: 1, end: 1 },
      color: 'rgba(147, 197, 253, 0.9)'  // 파스텔 블루
    },
    {
      name: '1차 질의 및 답변',
      duration: { start: 2, end: 4 },
      color: 'rgba(134, 239, 172, 0.9)'  // 파스텔 그린
    },
    {
      name: '로고 제작',
      duration: { start: 3, end: 5 },
      color: 'rgba(253, 224, 71, 0.9)'   // 파스텔 옐로우
    },
    {
      name: '설문조사',
      duration: { start: 3, end: 6 },
      color: 'rgba(251, 207, 232, 0.9)'  // 파스텔 핑크
    }
  ];

  // 프로젝트 겹침 처리를 위한 로직
  const arrangeProjects = () => {
    const rows = [];
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.duration.start === b.duration.start) {
        return (b.duration.end - b.duration.start) - (a.duration.end - a.duration.start);
      }
      return a.duration.start - b.duration.start;
    });
    
    sortedProjects.forEach(project => {
      let rowIndex = 0;
      while (true) {
        if (!rows[rowIndex]) {
          rows[rowIndex] = [project];
          break;
        }
        
        const canAddToRow = rows[rowIndex].every(existingProject => {
          return project.duration.start > existingProject.duration.end || 
                 project.duration.end < existingProject.duration.start;
        });
        
        if (canAddToRow) {
          rows[rowIndex].push(project);
          break;
        }
        rowIndex++;
      }
    });
    
    return rows;
  };

  const projectRows = arrangeProjects();

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          fontSize: '1rem',
          color: 'text.primary',
        }}
      >
        지역완결형 글로벌허브 메디컬센터 사업 추진 현황
      </Typography>

      <Box sx={{ position: 'relative', mt: 2 }}>
        {/* 월 표시 */}
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {months.map((month, index) => (
            <Grid item xs={1} key={index}>
              <MonthLabel>
                {month}
              </MonthLabel>
            </Grid>
          ))}
        </Grid>

        {/* 타임라인 컨테이너 */}
        <Box sx={{ position: 'relative' }}>
          <TimelineContainer>
            {/* 프로젝트 바 */}
            <Box sx={{ position: 'relative' }}>
              {projectRows.map((row, rowIndex) => (
                <Box key={rowIndex}>
                  {row.map((project, index) => (
                    <TimelineBar key={`${rowIndex}-${index}`}>
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
                          }}
                        >
                          {project.name}
                        </Typography>
                      </ProjectBar>
                    </TimelineBar>
                  ))}
                </Box>
              ))}
            </Box>
          </TimelineContainer>
          
          {/* 현재 날짜 표시선 */}
          <CurrentDateLine left={currentPosition} />
        </Box>
      </Box>
    </Box>
  );
} 