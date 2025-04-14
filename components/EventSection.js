import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useState, useEffect } from 'react';

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
    if (!events || events.length <= 3) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 3) >= events.length ? 0 : prevIndex + 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [events]);

  const displayEvents = events.slice(currentIndex, currentIndex + 3);

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
    <Box sx={{ bgcolor: '#1B2028', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#fff' }}>
        주요 이벤트
      </Typography>
      <Grid container spacing={2}>
        {displayEvents.map((event, index) => (
          <Grid item xs={4} key={index}>
            <Card sx={{ height: '100%', bgcolor: '#232B38' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#fff'
                }}>
                  {event.title}
                </Typography>
                <Typography variant="body2" sx={{
                  mb: 1,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  color: '#a0aec0'
                }}>
                  {event.description}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#a0aec0'
                }}>
                  {event.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {events.length > 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
          {Array.from({ length: Math.ceil(events.length / 3) }).map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentIndex(idx * 3)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: Math.floor(currentIndex / 3) === idx ? 'primary.main' : 'grey.300',
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
} 