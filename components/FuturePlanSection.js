import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from 'react';

export default function FuturePlanSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/sheets?sheet=FuturePlanSection');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length <= 1) {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }

        // 헤더를 제외한 데이터 행을 처리
        const formattedPlans = data.slice(1).map(row => ({
          quarter: row[0] || '',
          title: row[1] || '',
          tasks: (row[2] || '').split(',').map(task => task.trim()),
          status: row[3] || '진행예정'
        }));
        
        setPlans(formattedPlans);
        setError(null);
      } catch (error) {
        console.error('Error fetching plans data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

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