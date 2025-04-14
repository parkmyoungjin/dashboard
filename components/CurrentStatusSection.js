import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import ApartmentIcon from '@mui/icons-material/Apartment';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  borderRadius: 8,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 8,
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function CurrentStatusSection() {
  // 2023년 1월 1일부터 2036년 12월 31일까지의 총 기간
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2036-12-31');
  const currentDate = new Date();
  
  // 전체 기간 대비 현재까지의 진행률 계산
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  const progressPercentage = Math.round((elapsedDuration / totalDuration) * 100);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '0.9rem',
            color: 'text.primary',
          }}
        >
          전체 사업 진행률
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          bgcolor: 'primary.light',
          px: 2,
          py: 0.5,
          borderRadius: 2
        }}>
          <ApartmentIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {progressPercentage}%
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ width: '100%', position: 'relative' }}>
        <BorderLinearProgress 
          variant="determinate" 
          value={progressPercentage} 
        />
      </Box>
    </Box>
  );
} 