import { Box, Typography, IconButton, Link, Dialog, DialogContent } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';

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
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handleOpenImageDialog = () => {
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

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
      flexDirection: 'column',
      position: 'relative'
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

      {/* 링크 버튼 추가 */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 20, 
        display: 'flex', 
        gap: 1 
      }}>
        <IconButton
          size="small"
          onClick={handleOpenImageDialog}
          sx={{ 
            bgcolor: 'transparent', 
            color: '#2DD4BF',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'rgba(45, 212, 191, 0.2)',
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '0.75rem',
            gap: 0.5
          }}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="caption" sx={{ color: '#2DD4BF' }}>사업대상지</Typography>
          </Box>
        </IconButton>

        <IconButton
          size="small"
          component={Link}
          href="https://www.pnuh.or.kr/pnuh/hospital/pnuh-promise.do"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            bgcolor: 'transparent', 
            color: '#2DD4BF',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'rgba(45, 212, 191, 0.2)',
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '0.75rem',
            gap: 0.5
          }}>
            <LanguageIcon fontSize="small" />
            <Typography variant="caption" sx={{ color: '#2DD4BF' }}>홈페이지</Typography>
          </Box>
        </IconButton>
      </Box>

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

      {/* 이미지 팝업 다이얼로그 */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
      >
        <DialogContent sx={{ p: 1, backgroundColor: '#0F2942' }}>
          <img 
            src="/images/project site.jpg" 
            alt="사업대상지" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
} 
