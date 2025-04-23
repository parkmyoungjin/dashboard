import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // 환경 변수 검증
    if (!process.env.CALENDAR_ID) {
      throw new Error('캘린더 ID가 설정되지 않았습니다. 환경 변수 CALENDAR_ID를 확인해주세요.');
    }
    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error('Google 서비스 계정 이메일이 설정되지 않았습니다. 환경 변수 GOOGLE_CLIENT_EMAIL을 확인해주세요.');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Google 서비스 계정 키가 설정되지 않았습니다. 환경 변수 GOOGLE_PRIVATE_KEY를 확인해주세요.');
    }

    // 환경 변수 디버깅을 위한 로깅
    console.log('Environment variables check:');
    console.log('CALENDAR_ID:', process.env.CALENDAR_ID ? 'exists' : 'missing');
    console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? 'exists' : 'missing');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'exists' : 'missing');

    // credentials 객체 생성
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    // credentials 객체 검증
    console.log('Credentials check:');
    console.log('client_email exists:', !!credentials.client_email);
    console.log('private_key exists:', !!credentials.private_key);
    console.log('client_email type:', typeof credentials.client_email);
    console.log('private_key type:', typeof credentials.private_key);

    if (!credentials.client_email || typeof credentials.client_email !== 'string') {
      throw new Error('유효하지 않은 client_email 형식입니다.');
    }
    if (!credentials.private_key || typeof credentials.private_key !== 'string') {
      throw new Error('유효하지 않은 private_key 형식입니다.');
    }

    // calendar 인스턴스 생성
    const calendar = google.calendar({
      version: 'v3',
      auth: new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      }),
    });

    console.log('Calendar API - Starting request');
    console.log('Using calendar ID:', process.env.CALENDAR_ID);
    
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description,
    }));

    console.log('Calendar API - Successfully fetched events:', events.length);
    res.status(200).json(events);
  } catch (error) {
    console.error('Calendar API Error - Full error:', error);
    console.error('Calendar API Error - Message:', error.message);
    if (error.response) {
      console.error('Calendar API Error - Response data:', error.response.data);
    }
    res.status(500).json({ 
      error: '캘린더 이벤트를 가져오는데 실패했습니다',
      details: error.message,
      code: error.code
    });
  }
} 