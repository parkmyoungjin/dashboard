import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';

export default function FuturePlanSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

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

  useEffect(() => {
    if (!plans || plans.length <= 2) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) >= plans.length ? 0 : prevIndex + 2);
    }, 5000);
    return () => clearInterval(interval);
  }, [plans]);

  if (loading) {
    return (
      <Box sx={{ 
        height: '250px', // 3개 항목에 맞는 높이
        p: 2, 
        textAlign: 'center',
        bgcolor: '#1B2028',
        borderRadius: 2,
      }}>
        <Typography>데이터를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        height: '250px',
        p: 2, 
        textAlign: 'center', 
        color: 'error.main',
        bgcolor: '#1B2028',
        borderRadius: 2,
      }}>
        <Typography>데이터를 불러오는데 실패했습니다: {error}</Typography>
      </Box>
    );
  }

  const currentPlans = plans.slice(currentIndex, currentIndex + 2);
  const totalPages = Math.ceil(plans.length / 2);

  return (
    <Box sx={{ 
      height: '192px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      px: 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        flex: 1,
        bgcolor: '#1B2028',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Typography variant="h6" sx={{ mb: 1.5, textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}>
          향후 계획
        </Typography>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Fade in={show} timeout={500}>
            <List sx={{ 
              p: 0,
              height: '100%',
              '& .MuiListItem-root': { 
                py: 1,
                px: 2,
                backgroundColor: 'background.default',
                borderRadius: 1,
                mb: 0.5,
                '&:last-child': {
                  mb: 0
                }
              }
            }}>
              {currentPlans.map((plan, index) => (
                <ListItem key={currentIndex + index}>
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
          </Fade>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 0.5,
          gap: 0.5
        }}>
          {plans.length > 2 && Array.from({ length: totalPages }).map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index * 2)}
              sx={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                bgcolor: Math.floor(currentIndex / 2) === index ? '#60a5fa' : 'rgba(96, 165, 250, 0.3)',
                transition: 'background-color 0.3s',
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
} 