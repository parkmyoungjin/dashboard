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
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: '1920px !important',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.spacing(2),
  background: theme.palette.background.paper,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    transform: 'translateY(-2px)',
    borderColor: theme.palette.primary.dark,
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
        const response = await fetch('/api/sheets');
        const data = await response.json();
        setProgress(data.progress || []);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      py: { xs: 2, md: 4 },
      background: theme => `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    }}>
      <DashboardContainer>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            fontSize: { xs: '1.2rem', sm: '1.6rem' }
          }}
        >
          신사업추진팀 Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} container spacing={3}>
            <Grid item xs={12} md={3}>
              <CurrentStatusSection />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProgressSection />
            </Grid>
            <Grid item xs={12} md={3}>
              <NewsSection news={[
                { title: "첫 번째 이슈 제목입니다.", date: "2024-04-08" },
                { title: "두 번째 이슈 제목입니다.", date: "2024-04-08" },
                { title: "세 번째 이슈 제목입니다.", date: "2024-04-08" }
              ]} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <TimelineSection />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <FuturePlanSection />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <EventSection />
            </Paper>
          </Grid>
        </Grid>
      </DashboardContainer>
    </Box>
  );
} 