import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';

export default function FuturePlanSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const plans = [
    {
      quarter: '1분기',
      title: '시스템 고도화',
      tasks: [
        '성능 개선',
        '보안 강화'
      ]
    },
    {
      quarter: '2분기',
      title: '확장',
      tasks: [
        '신규 개발',
        '통합 구축'
      ]
    },
    {
      quarter: '3분기',
      title: '안정화',
      tasks: [
        '모니터링',
        '장애 대응'
      ]
    }
  ];

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
        향후 추진 계획
      </Typography>
      
      <List sx={{ 
        p: 0,
        '& .MuiListItem-root': { 
          py: 1,
          px: 2,
          backgroundColor: 'background.default',
          borderRadius: 1,
          mb: 1,
          '&:last-child': {
            mb: 0
          }
        }
      }}>
        {plans.map((plan, index) => (
          <ListItem key={index}>
            <Stack direction="row" alignItems="center" spacing={2} width="100%">
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: '140px' }}>
                <Chip
                  icon={<CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />}
                  label={plan.quarter}
                  color="primary"
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {plan.title}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                {plan.tasks.map((task, i) => (
                  <Chip
                    key={i}
                    icon={<FlagIcon sx={{ fontSize: '0.9rem' }} />}
                    label={task}
                    color="info"
                    size="small"
                    variant="outlined"
                    sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                  />
                ))}
              </Stack>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 