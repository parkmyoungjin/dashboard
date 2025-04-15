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
  color: theme.palette.text.primary,
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
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.6rem' },
          color: '#fff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }}
      >
        신사업추진팀 Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 2,
              height: '100%',
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: '1px solid rgba(96, 165, 250, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
                borderColor: 'rgba(96, 165, 250, 0.3)',
              }
            }}>
              <ProgressSection />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 2,
              height: '100%',
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: '1px solid rgba(96, 165, 250, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
                borderColor: 'rgba(96, 165, 250, 0.3)',
              }
            }}>
              <CurrentStatusSection />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 2,
              height: '100%',
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: '1px solid rgba(96, 165, 250, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
                borderColor: 'rgba(96, 165, 250, 0.3)',
              }
            }}>
              <NewsSection news={[
                { title: '첫 번째 이슈 제목입니다.', date: '2024-04-08' },
                { title: '두 번째 이슈 제목입니다.', date: '2024-04-08' },
                { title: '세 번째 이슈 제목입니다.', date: '2024-04-08' }
              ]} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              height: '300px',
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