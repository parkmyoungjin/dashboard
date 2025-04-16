import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';

export default function FuturePlanSection() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
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
        const formattedIdeas = data.slice(1).map(row => ({
          idea: row[0] || '',
          description: row[1] || '',
          proposer: row[2] || '익명'
        }));
        
        setIdeas(formattedIdeas);
        setError(null);
      } catch (error) {
        console.error('Error fetching ideas data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  useEffect(() => {
    if (!ideas || ideas.length <= 2) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) >= ideas.length ? 0 : prevIndex + 2);
    }, 5000);
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

  const currentIdeas = ideas.slice(currentIndex, currentIndex + 2);
  const totalPages = Math.ceil(ideas.length / 2);

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
        overflow: 'hidden'
      }}>
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
              {currentIdeas.map((idea, index) => (
                <ListItem key={currentIndex + index}>
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
          {ideas.length > 2 && Array.from({ length: totalPages }).map((_, index) => (
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