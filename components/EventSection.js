import { Box, Typography, Card, CardContent, Grid, Stack, Chip, Fade } from '@mui/material';
import { useState, useEffect } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useSheetData } from '../hooks/useSheetData';

export default function EventSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const { data, loading, error } = useSheetData('EventSection');
  const [events, setEvents] = useState([]);

  // 데이터 변환 처리
  useEffect(() => {
    if (!data || data.length <= 1) return;

    // 헤더를 제외한 데이터 행을 처리
    const formattedEvents = data.slice(1).map(row => ({
      date: row[0] || '',
      title: row[1] || '',
      description: row[2] || '',
      status: row[3] || '예정'
    }));
    
    setEvents(formattedEvents);
  }, [data]);

  useEffect(() => {
    if (!events || events.length <= 1) return;
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
        setShow(true);
      }, 500);
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
        bgcolor: '#0F2942',
        borderRadius: 2,
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
        bgcolor: '#0F2942',
        borderRadius: 2,
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
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        mb: 0
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#fff',
            mb: 0.5
          }}
        >
          핵심 성과
        </Typography>
        {events.length > 1 && (
          <Box sx={{ 
            display: 'flex',
            gap: 0.5,
            pr: 2
          }}>
            {Array.from({ length: events.length }).map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  position: 'relative',
                  minWidth: '160px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: currentIndex === idx ? '#0B1929' : '#0F2942',
                  color: currentIndex === idx ? '#2DD4BF' : '#94a3b8',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: currentIndex === idx ? 600 : 500,
                  transition: 'all 0.2s ease-in-out',
                  zIndex: currentIndex === idx ? 10 : events.length - idx,
                  '&:hover': {
                    bgcolor: currentIndex === idx ? '#0B1929' : '#0F2942',
                  },
                  '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    bottom: 0,
                    bgcolor: 'transparent',
                    transition: 'all 0.2s ease-in-out'
                  },
                  '&::before': {
                    left: '-8px',
                    background: `radial-gradient(circle at 0 0,
                      transparent 8px,
                      ${currentIndex === idx ? '#0B1929' : '#0F2942'} 0)`
                  },
                  '&::after': {
                    right: '-8px',
                    background: `radial-gradient(circle at 8px 0,
                      transparent 8px,
                      ${currentIndex === idx ? '#0B1929' : '#0F2942'} 0)`
                  }
                }}
              >
                <Box sx={{ 
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1,
                  overflow: 'hidden'
                }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '1rem',
                        textAlign: 'center',
                        letterSpacing: events[idx]?.title?.length > 12 ? '-0.05em' : 'normal',
                        flex: 1,
                        maxWidth: '85%'
                      }}
                    >
                      {events[idx]?.title || ''}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{
        flex: 1,
        width: '100%',
        bgcolor: '#0B1929',
        borderRadius: 1,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{ flex: 1 }}>
          {currentEvent && (
            <Fade in={show} timeout={500}>
              <Box sx={{ 
                display: 'flex', 
                height: '100%',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                backgroundColor: 'background.default',
                borderRadius: 1,
                p: 3,
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
                        fontSize: '1.3rem',
                        fontWeight: 600
                      } 
                    }}
                  />
                  <Typography sx={{
                    color: '#94a3b8',
                    fontSize: '1.3rem',
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
                        fontSize: '1rem' 
                      } 
                    }}
                  />
                </Stack>
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
    </Box>
  );
} 