import { google } from 'googleapis';

export async function getGoogleSheets() {
  try {
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('Missing required Google Sheets credentials');
    }

    const private_key = process.env.GOOGLE_SHEETS_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/"/g, '');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: 'dashboard-459602',
        private_key: private_key,
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        client_id: '',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SHEETS_CLIENT_EMAIL)}`
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw error;
  }
}

export async function getSheetData(sheetName) {
  try {
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      throw new Error('Missing spreadsheet ID');
    }

    const sheets = await getGoogleSheets();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID.replace(/"/g, ''),
      range: `${sheetName}!A:E`,
    });

    if (!response.data.values) {
      console.log('No values found in sheet');
      return [];
    }

    return response.data.values;
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    throw error;
  }
}

export async function getNewsData() {
  try {
    const sheets = await getGoogleSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'News!A2:C' // News 시트의 A2부터 C열까지
    });

    const rows = response.data.values || [];
    return rows.map(row => ({
      title: row[0] || '',
      date: row[1] || '',
      link: row[2] || ''
    }));
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
} 
