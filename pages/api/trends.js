// pages/api/trends-search.js

import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 1800 }); // 30분 캐시

const baseQueries = {
  hospitalAI: {
    mainQuery: '대학병원 AI|인공지능|디지털병원',
    categories: [
      { id: 'diagnosis', query: '진단|검진|판독', name: '진단/검진' },
      { id: 'treatment', query: '수술|치료|처방', name: '치료/처방' },
      { id: 'monitoring', query: '원격|모니터링|관리', name: '모니터링' },
      { id: 'operation', query: '행정|운영|시스템', name: '병원운영' },
      { id: 'research', query: '연구|개발|도입', name: '연구개발' }
    ]
  },
  policy: {
    mainQuery: '의료정책|보건의료|의료제도',
    categories: [
      { id: 'insurance', query: '수가|보험|급여', name: '의료보험' },
      { id: 'telemedicine', query: '원격진료|비대면진료', name: '원격진료' },
      { id: 'quality', query: '의료질향상|환자안전', name: '의료질' },
      { id: 'data', query: '의료데이터|의료정보', name: '의료정보' },
      { id: 'resource', query: '의료인력|의료자원', name: '의료자원' }
    ]
  }
};

// NAVER API 설정
const NAVER_API_CONFIG = {
  headers: {
    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
  }
};

// 날짜 관련 유틸리티
const dateUtils = {
  koreanNow() {
    return new Date(Date.now() + (9 * 60 * 60 * 1000));
  },

  parseDate(dateStr) {
    try {
      return new Date(dateStr.replace(/<[^>]*>/g, '').trim());
    } catch (e) {
      return null;
    }
  },

  parseBlogDate(postdate) {
    try {
      return new Date(`${postdate.slice(0,4)}-${postdate.slice(4,6)}-${postdate.slice(6,8)}T00:00:00+09:00`);
    } catch (e) {
      return null;
    }
  },

  getTimeRange(timeRange) {
    const now = this.koreanNow();
    const ranges = {
      '24h': now.getTime() - (24 * 60 * 60 * 1000),
      '7d': now.getTime() - (7 * 24 * 60 * 60 * 1000),
      '30d': now.getTime() - (30 * 24 * 60 * 60 * 1000)
    };
    return {
      start: new Date(ranges[timeRange] || ranges['24h']),
      end: now
    };
  }
};

// 텍스트 처리 유틸리티
const textUtils = {
  stripHtml(str) {
    return str.replace(/<[^>]*>/g, '').trim();
  },

  // 주요 키워드 추출 (명사 위주)
  extractKeywords(text) {
    const words = text.match(/[가-힣a-zA-Z]+/g) || [];
    return words
      .filter(word => word.length >= 2)
      .filter(word => !this.isStopWord(word));
  },

  isStopWord(word) {
    const stopWords = new Set([
      '있다', '없다', '되다', '이다', '하다', '이런', '그런', '저런',
      '이번', '관련', '진행', '예정', '위해', '통해', '따라', '대해',
      '및', '등', '중', '수', '것', '내', '곳', '건', '명', '년', '월', '일',
      '때문', '이후', '이전', '현재', '지난', '계획', '방침', '방안'
    ]);
    return stopWords.has(word);
  }
};

// 검색 및 분석 기능
async function searchNaverAPI(query, timeRange, display = 100) {
  const [newsRes, blogRes] = await Promise.all([
    axios.get('https://openapi.naver.com/v1/search/news.json', {
      ...NAVER_API_CONFIG,
      params: { query, display, sort: 'date' }
    }),
    axios.get('https://openapi.naver.com/v1/search/blog.json', {
      ...NAVER_API_CONFIG,
      params: { query, display, sort: 'date' }
    })
  ]);

  const { start, end } = dateUtils.getTimeRange(timeRange);

  const processItems = (items, type) => {
    return items.map(item => ({
      type,
      title: textUtils.stripHtml(item.title),
      description: textUtils.stripHtml(item.description),
      link: item.link,
      date: type === 'news' 
        ? dateUtils.parseDate(item.pubDate)
        : dateUtils.parseBlogDate(item.postdate)
    }))
    .filter(item => item.date && item.date >= start && item.date <= end);
  };

  return [
    ...processItems(newsRes.data.items, 'news'),
    ...processItems(blogRes.data.items, 'blog')
  ].sort((a, b) => b.date - a.date);
}

function calculateRelevance(item, category) {
  let score = 0;
  
  // 1. 출처 가중치
  score += item.type === 'news' ? 60 : 40;

  // 2. 최신성 가중치 (최근 24시간 내 게시물 추가 점수)
  const hoursAgo = (dateUtils.koreanNow() - item.date) / (60 * 60 * 1000);
  if (hoursAgo <= 24) {
    score += Math.max(0, 20 * (1 - hoursAgo/24));
  }

  // 3. 키워드 매칭 점수
  const content = `${item.title} ${item.description}`.toLowerCase();
  const categoryKeywords = category.query.split('|');
  const matchCount = categoryKeywords.filter(keyword => 
    content.includes(keyword.toLowerCase())
  ).length;
  score += (matchCount / categoryKeywords.length) * 20;

  return Math.min(100, score);
}

export default async function handler(req, res) {
  try {
    // 1. 요청 검증
    if (req.method !== 'GET') {
      return res.status(405).json({ error: '허용되지 않는 메소드입니다.' });
    }

    const { theme = 'hospitalAI', timeRange = '24h' } = req.query;
    if (!baseQueries[theme]) {
      return res.status(400).json({ error: '잘못된 테마입니다.' });
    }

    // 2. 캐시 확인
    const cacheKey = `trends_v2_${theme}_${timeRange}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // 3. 카테고리별 검색 실행
    const { mainQuery, categories } = baseQueries[theme];
    const categoryResults = await Promise.all(
      categories.map(async category => {
        const query = `(${mainQuery}) AND (${category.query})`;
        const items = await searchNaverAPI(query, timeRange);
        
        // 각 항목의 관련도 계산 및 정렬
        const processedItems = items
          .map(item => ({
            ...item,
            relevance: calculateRelevance(item, category)
          }))
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 3);  // 각 카테고리별 상위 3개 항목

        return {
          categoryId: category.id,
          categoryName: category.name,
          items: processedItems.map(item => ({
            title: item.title,
            link: item.link,
            date: item.date,
            relevance: item.relevance,
            source: item.type === 'news' ? '뉴스' : '블로그'
          }))
        };
      })
    );

    // 4. 결과 필터링 및 정리
    const results = categoryResults
      .filter(cat => cat.items.length > 0)
      .map(cat => ({
        ...cat,
        topRelevance: Math.max(...cat.items.map(item => item.relevance))
      }))
      .sort((a, b) => b.topRelevance - a.topRelevance);

    if (results.length === 0) {
      return res.status(404).json({
        error: '검색 결과가 없습니다.',
        timeRange
      });
    }

    // 5. 캐시 저장 및 응답
    cache.set(cacheKey, results);
    res.status(200).json(results);

  } catch (error) {
    console.error('API 처리 중 오류:', error);
    res.status(500).json({ 
      error: '서버 처리 중 오류가 발생했습니다.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
