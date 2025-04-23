import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ProgressSection from '../components/ProgressSection';
import TimelineSection from '../components/TimelineSection';
import CurrentStatusSection from '../components/CurrentStatusSection';
import EventSection from '../components/EventSection';
import NewsSection from '../components/NewsSection';
import CalendarSection from '../components/CalendarSection';
import TrendSection from '../components/TrendSection';
import ToggleSwitch from '../components/ToggleSwitch';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 깜빡임 애니메이션 정의
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

// 애니메이션이 적용된 배터리 내부 컴포넌트
const BatteryBar = styled(Box)(({ theme, batteryLevel }) => ({
  height: '100%',
  width: `${batteryLevel}%`,
  backgroundColor: batteryLevel > 30 ? '#2DD4BF' : batteryLevel > 20 ? '#FFA500' : '#FF0000',
  borderRadius: '2px',
  transition: 'width 0.3s ease, background-color 0.3s ease',
  ...(batteryLevel <= 10 && {
    animation: `${pulse} 2s ease-in-out infinite`,
  }),
}));

const BatteryContainer = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '20px',
  border: '2px solid #ffffff',
  borderRadius: '3px',
  padding: '2px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    right: '-4px',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '0 2px 2px 0',
  },
}));

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

const TimeDisplay = dynamic(() => Promise.resolve(() => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isToggled, setIsToggled] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // 배터리 레벨 계산
      const startTime = new Date(now);
      startTime.setHours(8, 30, 0);
      const endTime = new Date(now);
      endTime.setHours(17, 30, 0);
      
      if (now < startTime) {
        setBatteryLevel(100);
      } else if (now > endTime) {
        setBatteryLevel(0);
      } else {
        const totalMinutes = (endTime - startTime) / (1000 * 60);
        const elapsedMinutes = (now - startTime) / (1000 * 60);
        const remainingPercentage = ((totalMinutes - elapsedMinutes) / totalMinutes) * 100;
        setBatteryLevel(Math.max(0, Math.min(100, remainingPercentage)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      color: '#ffffff'
    }}>
      <ToggleSwitch
        checked={isToggled}
        onChange={(e) => setIsToggled(e.target.checked)}
      />
      <Typography sx={{
        fontSize: '1.8rem',
        fontWeight: 700,
        letterSpacing: '0.5px',
        fontFamily: 'Roboto',
        color: '#ffffff',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        {formatDate(currentTime)}
      </Typography>
      <Box sx={{ 
        width: '64px',
        height: '32px',
        position: 'relative',
        bgcolor: 'rgba(45, 212, 191, 0.1)',
        borderRadius: '4px',
        border: '1px solid #ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '2px'
      }}>
        <BatteryBar batteryLevel={batteryLevel} />
        <Typography sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#ffffff'
        }}>
          {Math.round(batteryLevel)}%
        </Typography>
      </Box>
    </Box>
  );
}), { ssr: false });

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
      <Grid container spacing={3}>
        {/* Left Side Content (Header + Sections) */}
        <Grid item xs={12} md={8}>
          {/* Header */}
          <Paper sx={{ 
            p: 0.5,
            mb: 3,
            background: '#0c0e1d',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: 'none',
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              pl: 3,
              pr: 3
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
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
              <TimeDisplay />
            </Box>
          </Paper>

          {/* Top Row - Left Side */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DashboardCard>
                <ProgressSection data={progress} />
              </DashboardCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <DashboardCard>
                <CalendarSection />
              </DashboardCard>
            </Grid>
          </Grid>
          
          {/* Middle Row */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <DashboardCard>
              <TimelineSection />
            </DashboardCard>
          </Grid>
          
          {/* Bottom Row */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <DashboardCard>
                <EventSection />
              </DashboardCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <DashboardCard>
                <CurrentStatusSection />
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Right Column - Full Height from top to bottom */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <DashboardCard sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%' 
          }}>
            <TrendSection />
          </DashboardCard>
        </Grid>
        
        {/* Hidden but kept in code */}
        <Grid item xs={12} sx={{ display: 'none' }}>
          <DashboardCard>
            <NewsSection />
          </DashboardCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
} 