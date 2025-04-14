import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';

export default function FuturePlanSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const plans = [
    {
      quarter: '2024년 1분기',
      title: '시스템 고도화',
      tasks: [
        '성능 최적화',
        '신규 기능 개발',
        '보안 강화'
      ]
    },
    {
      quarter: '2024년 2분기',
      title: '확장 계획',
      tasks: [
        '신규 모듈 개발',
        '기존 시스템 통합',
        '테스트 자동화'
      ]
    },
    {
      quarter: '2024년 3분기',
      title: '안정화',
      tasks: [
        '시스템 모니터링 강화',
        '장애 대응 체계 구축',
        '백업 시스템 점검'
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        향후 추진 계획
      </Typography>
      <List sx={{ '& .MuiListItem-root': { py: 2 } }}>
        {plans.map((plan, index) => (
          <ListItem 
            key={index}
            sx={{ 
              flexDirection: 'column',
              alignItems: 'flex-start',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              mb: 1
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Chip
                icon={<CalendarTodayIcon />}
                label={plan.quarter}
                color="primary"
                size="small"
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {plan.title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {plan.tasks.map((task, i) => (
                <Chip
                  key={i}
                  icon={<FlagIcon />}
                  label={task}
                  color="info"
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 