import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 1800 }); // 30분 캐시

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메소드입니다.' });
  }

  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: '키워드가 필요합니다.' });
    }

    const cacheKey = `news_${keyword}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const response = await axios.get(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(keyword)}&display=1&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        },
      }
    );

    const newsData = response.data.items[0] ? {
      title: response.data.items[0].title.replace(/<[^>]*>/g, ''),
      link: response.data.items[0].link,
    } : null;

    cache.set(cacheKey, newsData);
    res.status(200).json(newsData);
  } catch (error) {
    console.error('뉴스 데이터 요청 중 오류:', error);
    res.status(500).json({ error: '뉴스 데이터를 가져오는데 실패했습니다.' });
  }
} 