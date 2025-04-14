import { Box, Typography, List, ListItem, Stack, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export default function CurrentStatusSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const statusItems = [
    {
      title: '기반 시설',
      completedTasks: [
        '인프라 구축',
        '보안 설치'
      ],
      inProgressTasks: [
        '시스템 점검'
      ]
    },
    {
      title: '시스템',
      completedTasks: [
        '코어 개발',
        'API 구현'
      ],
      inProgressTasks: [
        '테스트'
      ]
    },
    {
      title: '사용자',
      completedTasks: [
        '교육 완료',
        '매뉴얼'
      ],
      inProgressTasks: [
        '피드백'
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
        주요 사업 추진 현황
      </Typography>
      <List sx={{ 
        '& .MuiListItem-root': { 
          py: 1,
          px: 2,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          mb: 1 
        }
      }}>
        {statusItems.map((item, index) => (
          <ListItem key={index}>
            <Stack direction="row" alignItems="center" spacing={2} width="100%">
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 'bold',
                minWidth: '80px'
              }}>
                {item.title}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                {item.completedTasks.map((task, i) => (
                  <Chip
                    key={i}
                    icon={<CheckCircleIcon sx={{ fontSize: '0.9rem' }} />}
                    label={task}
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                  />
                ))}
                {item.inProgressTasks.map((task, i) => (
                  <Chip
                    key={i}
                    icon={<PlayCircleIcon sx={{ fontSize: '0.9rem' }} />}
                    label={task}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                  />
                ))}
              </Stack>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 