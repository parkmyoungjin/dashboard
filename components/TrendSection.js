// components/TrendSection.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Link,
  Grid,
  Divider,
  styled
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Article as ArticleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

// 스타일 컴포넌트
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 120,
  marginRight: theme.spacing(2),
}));

const TrendItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiTypography-h6': {
    marginLeft: theme.spacing(1),
  }
}));

const RelevanceIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  '& .MuiTypography-body2': {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  }
}));

export default function TrendSection() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [theme, setTheme] = useState('hospitalAI');
  const [noData, setNoData] = useState(false);

  const timeRangeLabels = {
    '24h': '최근 24시간',
    '7d': '최근 7일',
    '30d': '최근 30일'
  };

  const themeLabels = {
    'hospitalAI': '대학병원 AI',
    'policy': '의료정책'
  };

  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);
      setError(null);
      setNoData(false);

      try {
        const response = await fetch(`/api/trends?timeRange=${timeRange}&theme=${theme}`);
        
        if (response.status === 404) {
          setNoData(true);
          setTrends([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        
        // Limit to 2 items per category and filter out unwanted categories
        const limitedData = data
          .filter(category => 
            category.categoryId !== 'treatment' && // 수술/치료/처방 제외
            category.categoryId !== 'telemedicine' && // 원격진료 제외
            category.categoryId !== 'monitoring' && // 모니터링 제외
            category.categoryId !== 'insurance' // 의료보험 제외
          )
          .map(category => ({
            ...category,
            items: category.items.slice(0, 2) // Only keep the first 2 items
          }));
        
        setTrends(limitedData);
      } catch (err) {
        setError(err.message);
        setTrends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [timeRange, theme]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return '방금 전';
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <StyledCard>
      <CardContent sx={{ maxHeight: '100%', overflow: 'auto',}}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
          <Typography variant="h6" component="h2" display="flex" alignItems="center">
            <TrendingUpIcon sx={{ mr: 1 }} />
            트렌드 분석
          </Typography>
          
          <Box display="flex" alignItems="center">
            <FormControl size="small" sx={{ mr: 2 }}>
              <InputLabel>기간</InputLabel>
              <StyledSelect
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="기간"
              >
                {Object.entries(timeRangeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <FormControl size="small">
              <InputLabel>주제</InputLabel>
              <StyledSelect
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                label="주제"
              >
                {Object.entries(themeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : noData ? (
          <Alert severity="info">
            {`${timeRangeLabels[timeRange]} 동안의 ${themeLabels[theme]} 관련 트렌드 데이터가 없습니다.`}
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {trends.map((category, index) => (
              <Grid item xs={12} key={category.categoryId}>
                <CategoryHeader>
                  <CategoryIcon color="primary" />
                  <Typography variant="h6">{category.categoryName}</Typography>
                  <Chip 
                    size="small"
                    label={`관련도 ${Math.round(category.topRelevance)}%`}
                    color="primary"
                    sx={{ ml: 2 }}
                  />
                </CategoryHeader>

                {category.items.map((item, itemIndex) => (
                  <TrendItem key={itemIndex} sx={{ marginBottom: 1 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box flex={1}>
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="inherit"
                          underline="hover"
                        >
                          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            {item.title}
                          </Typography>
                        </Link>

                        <Box display="flex" alignItems="center">
                          <Chip
                            size="small"
                            icon={<ArticleIcon />}
                            label={item.source}
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Box display="flex" alignItems="center">
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(item.date)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Chip
                        label={`${Math.round(item.relevance)}%`}
                        size="small"
                        color={item.relevance > 80 ? "primary" : "default"}
                      />
                    </Box>
                  </TrendItem>
                ))}

                {index < trends.length - 1 && <Divider sx={{ my: 1 }} />}
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </StyledCard>
  );
}
