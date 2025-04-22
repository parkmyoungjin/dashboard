import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const slideAnimation = keyframes`
  0%, 15% {
    transform: translateY(0);
  }
  25%, 90% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
`;

export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Calendar fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (events.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [events.length]);

  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    return {
      month: eventDate.toLocaleString('ko-KR', { month: 'short' }),
      day: `${eventDate.getDate()}일`,
      time: eventDate.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      p: 1,
      bgcolor: '#0F2942',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography sx={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: 600,
        mb: 0.5
      }}>
        캘린더
      </Typography>
      
      {loading ? (
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          width: '100%',
          bgcolor: '#0B1929',
          borderRadius: 1,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <CircularProgress size={24} sx={{ color: '#2DD4BF' }} />
        </Box>
      ) : error ? (
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          width: '100%',
          bgcolor: '#0B1929',
          borderRadius: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '0.9rem', color: '#ff4444' }}>
            일정을 불러오는데 실패했습니다
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', mt: 1, color: '#ff8888' }}>
            {error}
          </Typography>
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          width: '100%',
          bgcolor: '#0B1929',
          borderRadius: 1,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography sx={{ color: '#ffffff', opacity: 0.7 }}>
            예정된 일정이 없습니다.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          height: 'calc(100% - 10px)',
          width: '100%',
          bgcolor: '#0B1929',
          borderRadius: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 1,
            position: 'relative',
            justifyContent: 'flex-end',
            mr: 1,
            zIndex: 2
          }}>
            {events.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: '40px',
                  height: '4px',
                  bgcolor: idx === currentIndex ? '#2DD4BF' : 'rgba(45, 212, 191, 0.2)',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </Box>
          
          <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{ 
              flex: 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {events.map((event, index) => {
              const dateInfo = formatEventDate(event.start);
              const isActive = index === currentIndex;
              
              return (
                <Box
                  key={event.id}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : '100%'})`,
                    transition: 'all 0.5s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#0f172a',
                    borderRadius: 1,
                    overflow: 'hidden',
                    //border: '1px solid rgba(45, 212, 191, 0.1)',
                    minHeight: '100px'
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'relative'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '28px',
                      bgcolor: '#0f172a',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      //borderBottom: '1px solid rgba(45, 212, 191, 0.1)',
                      zIndex: 1
                    }} />
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: '4px 12px',
                      bgcolor: '#2DD4BF',
                      borderRadius: '4px',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <Typography sx={{ 
                        fontSize: '1em',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1
                      }}>
                        {dateInfo.month} {dateInfo.day}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: '#0f172a',
                        opacity: 0.8
                      }}>
                        {dateInfo.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    height: 'calc(100% - 10px)',
                    width: '100%',
                    borderRadius: 1,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography sx={{ 
                      color: '#ffffff',
                      fontSize: '1.4rem',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {event.title}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
} 