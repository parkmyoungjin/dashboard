import { Box, Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';

export default function CurrentStatusSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const statusItems = [
    {
      title: '기반 시설 구축',
      progress: 75,
      description: '주요 인프라 설치 완료, 보안 시스템 구축 중'
    },
    {
      title: '시스템 개발',
      progress: 60,
      description: '핵심 모듈 개발 완료, 통합 테스트 진행 중'
    },
    {
      title: '사용자 교육',
      progress: 40,
      description: '1차 교육 완료, 2차 교육 준비 중'
    },
    {
      title: '품질 관리',
      progress: 80,
      description: '정기 점검 및 모니터링 진행 중'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        주요 사업 추진 현황
      </Typography>
      <List>
        {statusItems.map((item, index) => (
          <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 