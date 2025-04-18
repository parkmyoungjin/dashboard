import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProgressSection from '../components/ProgressSection';
import TimelineSection from '../components/TimelineSection';
import CurrentStatusSection from '../components/CurrentStatusSection';
import FuturePlanSection from '../components/FuturePlanSection';
import EventSection from '../components/EventSection';
import NewsSection from '../components/NewsSection';
import { useState, useEffect } from 'react';

const DashboardContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  maxWidth: '1920px !important',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  background: '#0c0e1d',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.spacing(2),
  background: 'rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(96, 165, 250, 0.1)',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    transform: 'translateY(-2px)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  position: 'relative',
  color: '#2DD4BF',
  textShadow: '0 0 10px rgba(45, 212, 191, 0.3)',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    borderRadius: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  },
}));

export default function Dashboard() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheets?sheet=progress');
        const data = await response.json();
        setProgress(data.progress || []);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardContainer>
      <Paper sx={{ 
        p: 0.5,
        mb: 1.5,
        background: '#0c0e1d',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        border: 'none',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          pl: 3
        }}>
          <Box 
            component="img"
            src="/images/logo.png"
            alt="PNUH Logo"
            sx={{ 
              height: '96px',
              width: 'auto',
              opacity: 1
            }}
          />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.2rem', sm: '1.6rem' },
              color: '#2DD4BF',
              textShadow: '0 0 10px rgba(45, 212, 191, 0.3)'
            }}
          >
            신사업추진 보드
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: '12px',
              height: '100%',
              background: 'rgba(15, 41, 66, 1)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: 'none',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
              }
            }}>
              <ProgressSection />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: '12px',
              height: '100%',
              background: 'rgba(15, 41, 66, 1)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: 'none',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
              }
            }}>
              <CurrentStatusSection />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: '12px',
              height: '100%',
              background: 'rgba(15, 41, 66, 1)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: 'none',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
              }
            }}>
              <NewsSection />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              height: '360px',
              border: 'none',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <TimelineSection />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 0,
              height: '160px',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              '& > div': {
                padding: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }
            }}>
              <FuturePlanSection />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 0,
              height: '160px',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              '& > div': {
                padding: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }
            }}>
              <EventSection />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
} 