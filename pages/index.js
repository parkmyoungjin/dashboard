import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProgressSection from '../components/ProgressSection';
import TimelineSection from '../components/TimelineSection';
import CurrentStatusSection from '../components/CurrentStatusSection';
import FuturePlanSection from '../components/FuturePlanSection';
import EventSection from '../components/EventSection';

const DashboardContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      py: { xs: 2, md: 4 },
      background: theme => `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    }}>
      <DashboardContainer maxWidth="lg">
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            fontSize: { xs: '1.2rem', sm: '1.4rem' }
          }}
        >
          글로벌허브 메디컬센터 사업 진행 현황
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 2,
                  height: '100%',
                  minHeight: { xs: 'auto', sm: '180px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CurrentStatusSection />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper 
                sx={{ 
                  p: 2,
                  height: '100%',
                  minHeight: { xs: 'auto', sm: '180px' }
                }}
              >
                <ProgressSection />
              </Paper>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <TimelineSection />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <FuturePlanSection />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <EventSection />
            </Paper>
          </Grid>
        </Grid>
      </DashboardContainer>
    </Box>
  );
} 