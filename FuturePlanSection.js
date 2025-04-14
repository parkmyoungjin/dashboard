import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

export default function FuturePlanSection() {
  // 예시 데이터 - 실제 데이터로 교체 필요
  const plans = [
    {
      date: '2024년 1분기',
      title: '시스템 고도화',
      description: '성능 개선 및 신규 기능 추가'
    },
    {
      date: '2024년 2분기',
      title: '확장 계획',
      description: '추가 모듈 개발 및 통합'
    },
    {
      date: '2024년 3분기',
      title: '안정화',
      description: '시스템 안정화 및 성능 최적화'
    },
    {
      date: '2024년 4분기',
      title: '평가 및 개선',
      description: '운영 결과 평가 및 개선사항 도출'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        향후 추진 계획
      </Typography>
      <Grid container spacing={2}>
        {plans.map((plan, index) => (
          <Grid item xs={12} key={index}>
            <Card 
              sx={{ 
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: 'primary.main',
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4
                }
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {plan.date}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 