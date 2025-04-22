import { google } from 'googleapis';

const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  }),
});

export default async function handler(req, res) {
  try {
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
      error: 'Failed to fetch calendar events',
      details: error.message,
      code: error.code
    });
  }
} 