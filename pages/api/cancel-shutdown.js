import { exec } from 'child_process';

export default function handler(req, res) {
  // Windows shutdown 취소 명령어 실행
  exec('shutdown /a', (error, stdout, stderr) => {
    if (error) {
      console.error('Cancel shutdown error:', error);
      return res.status(500).json({ message: 'Failed to cancel shutdown command' });
    }
    res.status(200).json({ message: 'Shutdown cancelled' });
  });
} 