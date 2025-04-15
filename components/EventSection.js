import { Box, Typography, Card, CardContent, Grid, Stack, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function EventSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/sheets?sheet=EventSection');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length <= 1) {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }

        // 헤더를 제외한 데이터 행을 처리
        const formattedEvents = data.slice(1).map(row => ({
          date: row[0] || '',
          title: row[1] || '',
          description: row[2] || '',
          status: row[3] || '예정'
        }));
        
        setEvents(formattedEvents);
        setError(null);
      } catch (error) {
        console.error('Error fetching events data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!events || events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) >= events.length ? 0 : prevIndex + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [events]);

  const currentEvent = events[currentIndex];

  if (loading) {
    return (
      <Box sx={{ 
        height: '192px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        bgcolor: '#1e293b',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '0.9rem',
            color: '#fff',
            mb: 0.75
          }}
        >
          주요 이벤트
        </Typography>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography>데이터를 불러오는 중입니다...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        height: '192px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 2,
        bgcolor: '#1e293b',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '0.9rem',
            color: '#fff',
            mb: 0.75
          }}
        >
          주요 이벤트
        </Typography>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography color="error.main">데이터를 불러오는데 실패했습니다: {error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontSize: '1rem',
          color: '#fff',
          mb: 1.5
        }}
      >
        주요 일정
      </Typography>
      <Box sx={{
        flex: 1,
        width: '100%',
        bgcolor: '#0f172a',
        borderRadius: 1,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{ flex: 1 }}>
          {currentEvent && (
            <>
              <Box sx={{ 
                display: 'flex', 
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 0.5
              }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                  <Chip
                    icon={<CalendarTodayIcon sx={{ fontSize: '1.3rem' }} />}
                    label={currentEvent.title}
                    color="primary"
                    size="small"
                    sx={{ 
                      height: '32px',
                      '& .MuiChip-label': { 
                        fontSize: '1.1rem',
                        fontWeight: 600
                      } 
                    }}
                  />
                  <Typography sx={{
                    color: '#94a3b8',
                    fontSize: '1.1rem',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentEvent.description}
                  </Typography>
                  <Chip
                    label={currentEvent.date}
                    color="info"
                    size="small"
                    variant="outlined"
                    sx={{ 
                      height: '24px',
                      minWidth: 'fit-content',
                      '& .MuiChip-label': { 
                        fontSize: '0.75rem' 
                      } 
                    }}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Box>
        {events.length > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 0.5,
            mt: 1
          }}>
            {Array.from({ length: events.length }).map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  bgcolor: currentIndex === idx ? '#60a5fa' : 'rgba(96, 165, 250, 0.3)',
                  transition: 'background-color 0.3s',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
} 