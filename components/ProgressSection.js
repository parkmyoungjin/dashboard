import { Box, Typography, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ProgressSection() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // 2023년부터 2036년까지의 전체 기간 계산
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2036-12-31');
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    
    // 현재까지 진행된 날짜 계산
    const today = new Date();
    const elapsedDays = (today - startDate) / (1000 * 60 * 60 * 24);
    
    // 진행률 계산 (소수점 1자리까지)
    const calculatedProgress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    setProgress(Number(calculatedProgress.toFixed(1)));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">
          전체 사업 진행률
        </Typography>
        <Typography variant="h6" color="primary">
          {progress}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
          height: 20,
          borderRadius: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 2,
            backgroundColor: '#2196f3',
          }
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          2023년
        </Typography>
        <Typography variant="body2" color="text.secondary">
          2036년
        </Typography>
      </Box>
    </Box>
  );
} 