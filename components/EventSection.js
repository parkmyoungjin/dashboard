import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

export default function EventSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const events = [
    {
      date: '2024.03.15',
      title: '중간 평가회',
      description: '1분기 사업 진행상황 점검 및 평가'
    },
    {
      date: '2024.06.30',
      title: '시스템 업그레이드',
      description: '주요 시스템 업그레이드 및 기능 개선'
    },
    {
      date: '2024.09.20',
      title: '사용자 교육',
      description: '신규 기능 관련 사용자 교육 실시'
    },
    {
      date: '2024.12.15',
      title: '연간 성과 보고회',
      description: '연간 사업 성과 평가 및 차년도 계획 수립'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        주요 이벤트
      </Typography>
      <Grid container spacing={2}>
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {event.date}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 