import axios from 'axios';

export default async function handler(req, res) {
  try {
    // 어제 날짜 계산
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');

    const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
      params: {
        query: '병원 의료 진료',
        display: 5,
        sort: 'date',  // 최신순 정렬
        start: 1,
        pd: 1  // 1일 이내의 뉴스만 검색
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    });

    // HTML 태그 제거 및 날짜 포맷팅
    const cleanedItems = response.data.items.map(item => ({
      ...item,
      title: item.title.replace(/<[^>]+>/g, ''),
      description: item.description.replace(/<[^>]+>/g, ''),
      pubDate: new Date(item.pubDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    res.status(200).json(cleanedItems);
  } catch (error) {
    console.error('News API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
