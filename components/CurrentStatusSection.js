import { Box, Typography, Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: '0.7rem',
  '& .MuiChip-label': {
    padding: '0 8px',
  }
}));

export default function CurrentStatusSection() {
  const completedTasks = [
    { label: '사업계획 수립', color: 'success' },
    { label: '부지선정', color: 'success' },
    { label: '예비타당성 조사', color: 'success' },
    { label: '기본계획 수립', color: 'primary' },
  ];

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1,
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'text.primary',
        }}
      >
        전체 사업 진행률
      </Typography>
      
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          flexWrap: 'wrap', 
          gap: 0.5,
          '& > *': {
            marginBottom: '4px !important',
          }
        }}
      >
        {completedTasks.map((task, index) => (
          <StatusChip
            key={index}
            label={task.label}
            color={task.color}
            variant="outlined"
            size="small"
          />
        ))}
      </Stack>
    </Box>
  );
} 