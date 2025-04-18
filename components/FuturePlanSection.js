import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import { useSheetData } from '../hooks/useSheetData';

export default function FuturePlanSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const { data, loading, error } = useSheetData('FuturePlanSection');
  const [ideas, setIdeas] = useState([]);

  // 데이터 변환 처리
  useEffect(() => {
    if (!data || data.length <= 1) return;

    // 헤더를 제외한 데이터 행을 처리
    const formattedIdeas = data.slice(1).map(row => ({
      idea: row[0] || '',
      description: row[1] || '',
      proposer: row[2] || '익명'
    }));
    
    setIdeas(formattedIdeas);
  }, [data]);

  useEffect(() => {
    if (!ideas || ideas.length <= 1) return;
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ideas.length);
        setShow(true);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, [ideas]);

  if (loading) {
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
          아이디어 보드
        </Typography>
        <Box sx={{
          flex: 1,
          width: '100%',
          bgcolor: '#0f172a',
          borderRadius: 1,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography sx={{ color: '#94a3b8' }}>데이터를 불러오는 중입니다...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
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
          아이디어 보드
        </Typography>
        <Box sx={{
          flex: 1,
          width: '100%',
          bgcolor: '#0f172a',
          borderRadius: 1,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography sx={{ color: '#ef4444' }}>데이터를 불러오는데 실패했습니다: {error}</Typography>
        </Box>
      </Box>
    );
  }

  const currentIdeas = ideas.slice(currentIndex, currentIndex + 1);
  const totalPages = Math.ceil(ideas.length);

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
            fontSize: '1rem',
            color: '#fff',
            mb: 0.5
          }}
        >
          미래 계획
        </Typography>
        {ideas.length > 1 && (
          <Box sx={{ 
            display: 'flex',
            gap: 0.5,
            pr: 1
          }}>
            {Array.from({ length: ideas.length }).map((_, idx) => (
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
                  zIndex: currentIndex === idx ? 10 : ideas.length - idx,
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
                    spacing={0.5}
                    alignItems="center"
                    sx={{
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <LightbulbIcon sx={{ fontSize: '0.9rem' }} />
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        letterSpacing: ideas[idx]?.idea?.length > 12 ? '-0.05em' : 'normal',
                        flex: 1,
                        maxWidth: '85%'
                      }}
                    >
                      {ideas[idx]?.idea || ''}
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
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Fade in={show} timeout={500}>
            <Box sx={{ height: '100%' }}>
              {currentIdeas.map((idea, index) => (
                <Box 
                  key={currentIndex + index}
                  sx={{
                    backgroundColor: 'background.default',
                    borderRadius: 1,
                    mb: 0.5,
                    px: 2,
                    py: 1.75,
                    '&:last-child': {
                      mb: 0
                    }
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                    <Chip
                      icon={<LightbulbIcon sx={{ fontSize: '1.3rem' }} />}
                      label={idea.idea}
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
                    <Typography 
                      sx={{ 
                        color: '#94a3b8',
                        fontSize: '1.1rem',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {idea.description}
                    </Typography>
                    <Chip
                      icon={<PersonIcon sx={{ fontSize: '0.9rem' }} />}
                      label={idea.proposer}
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
              ))}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
} 