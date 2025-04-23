import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { seconds } = req.body;

  if (!seconds || isNaN(seconds) || seconds <= 0) {
    return res.status(400).json({ message: 'Invalid time value' });
  }

  // Windows shutdown 명령어 실행
  exec(`shutdown /s /t ${seconds}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Shutdown error:', error);
      return res.status(500).json({ message: 'Failed to execute shutdown command' });
    }
    res.status(200).json({ message: 'Shutdown scheduled' });
  });
} 