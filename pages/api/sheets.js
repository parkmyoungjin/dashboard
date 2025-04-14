import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sheet } = req.query;
    console.log('Requested sheet:', sheet); // 디버깅 로그

    if (!sheet) {
      return res.status(400).json({ message: 'Sheet name is required' });
    }

    const data = await getSheetData(sheet);
    console.log('Sheet data received:', !!data); // 디버깅 로그

    if (!data) {
      return res.status(404).json({ message: 'No data found in the sheet' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Detailed API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export async function getNews() {
  try {
    const news = await getNewsData();
    return news;
  } catch (error) {
    console.error('Error in getNews:', error);
    throw error;
  }
} 