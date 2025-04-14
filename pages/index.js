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
      <DashboardContainer maxWidth="xl">
        <PageTitle variant="h4" component="h1">
          프로젝트 현황 대시보드
        </PageTitle>
        
        <Grid container spacing={3}>
          {/* 전체 진행률 */}
          <Grid item xs={12}>
            <DashboardCard elevation={0}>
              <ProgressSection />
            </DashboardCard>
          </Grid>
          
          {/* 월별 타임라인 */}
          <Grid item xs={12}>
            <DashboardCard elevation={0}>
              <TimelineSection />
            </DashboardCard>
          </Grid>
          
          {/* 주요 사업 추진 현황 */}
          <Grid item xs={12} md={6}>
            <DashboardCard elevation={0}>
              <CurrentStatusSection />
            </DashboardCard>
          </Grid>
          
          {/* 향후 추진 계획 */}
          <Grid item xs={12} md={6}>
            <DashboardCard elevation={0}>
              <FuturePlanSection />
            </DashboardCard>
          </Grid>
          
          {/* 주요 이벤트 */}
          <Grid item xs={12}>
            <DashboardCard elevation={0}>
              <EventSection />
            </DashboardCard>
          </Grid>
        </Grid>
      </DashboardContainer>
    </Box>
  );
} 