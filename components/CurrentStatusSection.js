import { Box, Typography } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ArrowIcon = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
    <ArrowForwardIosIcon sx={{ 
      fontSize: '1.2rem',
      color: '#94a3b8'
    }} />
  </Box>
);

const StatusIcon = ({ icon: Icon, label, isActive }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      height: '80px',
      position: 'relative'
    }}>
      <Box sx={{
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: isActive ? 'rgba(45, 212, 191, 0.1)' : 'rgba(226, 232, 240, 0.3)',
      }}>
        <Icon sx={{ 
          fontSize: '3.12rem',
          color: isActive ? '#2DD4BF' : '#94a3b8'
        }} />
      </Box>
      <Typography 
        sx={{ 
          color: isActive ? '#2DD4BF' : '#94a3b8',
          fontSize: '1.04rem',
          mt: 1,
          fontWeight: 500
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default function CurrentStatusSection() {
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
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontSize: '1.5rem',
          color: '#fff',
          mb: 1.0
        }}
      >
        Global Hub 진행 단계
      </Typography>
      <Box sx={{
        height: 'calc(100% - 10px)',
        width: '100%',
        bgcolor: '#0B1929',
        borderRadius: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '100%'
        }}>
          <StatusIcon icon={DescriptionIcon} label="예비타당성" isActive={true} />
          <ArrowIcon />
          <StatusIcon icon={ArchitectureIcon} label="설계" isActive={false} />
          <ArrowIcon />
          <StatusIcon icon={ApartmentIcon} label="건축" isActive={false} />
          <ArrowIcon />
          <StatusIcon icon={DomainVerificationIcon} label="완공" isActive={false} />
        </Box>
      </Box>
    </Box>
  );
} 