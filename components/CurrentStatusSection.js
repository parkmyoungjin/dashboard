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
        backgroundColor: isActive ? 'rgba(33, 150, 243, 0.1)' : 'rgba(226, 232, 240, 0.3)',
      }}>
        <Icon sx={{ 
          fontSize: '2.4rem', 
          color: isActive ? '#2196f3' : '#94a3b8'
        }} />
      </Box>
      <Box sx={{ 
        height: '22px',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {label && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: isActive ? '#2196f3' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default function CurrentStatusSection() {
  return (
    <Box sx={{ 
      height: '160px',
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      px: 2
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'text.primary',
          mb: 4,
          textAlign: 'left'
        }}
      >
        지역완결형 글로벌허브 메디컬센터 사업 진행률
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 2,
        mt: 1,
        width: '100%'
      }}>
        <StatusIcon icon={DescriptionIcon} label="진행중" isActive={true} />
        <ArrowIcon />
        <StatusIcon icon={ArchitectureIcon} isActive={false} />
        <ArrowIcon />
        <StatusIcon icon={ApartmentIcon} isActive={false} />
        <ArrowIcon />
        <StatusIcon icon={DomainVerificationIcon} isActive={false} />
      </Box>
    </Box>
  );
} 