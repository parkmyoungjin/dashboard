import { Box, Typography, List, ListItem, ListItemText, Chip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export default function CurrentStatusSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const statusItems = [
    {
      title: '기반 시설 구축',
      completedTasks: [
        '네트워크 인프라 구축',
        '보안 시스템 설치'
      ],
      inProgressTasks: [
        '백업 시스템 구축'
      ]
    },
    {
      title: '시스템 개발',
      completedTasks: [
        '코어 모듈 개발',
        'API 구현'
      ],
      inProgressTasks: [
        '통합 테스트'
      ]
    },
    {
      title: '사용자 지원',
      completedTasks: [
        '1차 사용자 교육',
        '매뉴얼 작성'
      ],
      inProgressTasks: [
        '2차 교육 준비'
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        주요 사업 추진 현황
      </Typography>
      <List sx={{ '& .MuiListItem-root': { py: 2 } }}>
        {statusItems.map((item, index) => (
          <ListItem 
            key={index} 
            sx={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              mb: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              {item.title}
            </Typography>
            <Stack spacing={1} width="100%">
              <Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {item.completedTasks.map((task, i) => (
                    <Chip
                      key={i}
                      icon={<CheckCircleIcon />}
                      label={task}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {item.inProgressTasks.map((task, i) => (
                    <Chip
                      key={i}
                      icon={<PlayCircleIcon />}
                      label={task}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 