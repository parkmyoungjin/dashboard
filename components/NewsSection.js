import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const NewsSection = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (news?.length || 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [news]);

  if (!news || news.length === 0) return null;

  return (
    <Box sx={{ bgcolor: '#1B2028', p: 3, borderRadius: 2, boxShadow: 1, height: '100%' }}>
      <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#fff' }}>
        Today's Issue
      </Typography>
      <Card sx={{ bgcolor: '#232B38', height: 'calc(100% - 60px)' }}>
        <CardContent>
          <Typography variant="h6" sx={{
            color: '#fff',
            mb: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {news[currentIndex]?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#a0aec0' }}>
            {news[currentIndex]?.date}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewsSection;
