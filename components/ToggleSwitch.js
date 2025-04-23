import { Box, Switch, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 0,
  position: 'relative',
  '&::before': {
    content: '"OFF"',
    position: 'absolute',
    top: '50%',
    left: '8px',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '10px',
    fontWeight: 'bold',
    zIndex: 1,
    transition: 'opacity 0.2s',
    opacity: 1,
  },
  '&::after': {
    content: '"ON"',
    position: 'absolute',
    top: '50%',
    right: '8px',
    transform: 'translateY(-50%)',
    color: '#2DD4BF',
    fontSize: '10px',
    fontWeight: 'bold',
    zIndex: 1,
    transition: 'opacity 0.2s',
    opacity: 0,
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(28px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#2DD4BF',
        opacity: 1,
        border: 0,
      },
      '& ~ .MuiSwitch-thumb': {
        backgroundColor: '#fff',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#2DD4BF',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 30,
    height: 30,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
  '&:has(.Mui-checked)::before': {
    opacity: 0,
  },
  '&:has(.Mui-checked)::after': {
    opacity: 1,
  },
}));

const SwitchContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: '16px',
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1E293B',
    color: '#ffffff',
    minWidth: '300px',
    borderRadius: '12px',
    border: '1px solid rgba(45, 212, 191, 0.1)',
  },
  '& .MuiDialogTitle-root': {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    color: '#2DD4BF',
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
  },
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      color: '#ffffff',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: '#2DD4BF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2DD4BF',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#2DD4BF',
      },
    },
  },
  '& .MuiButton-root': {
    color: '#ffffff',
    '&.confirm-btn': {
      backgroundColor: '#2DD4BF',
      '&:hover': {
        backgroundColor: '#26B5A5',
      },
    },
  },
}));

export default function ToggleSwitch({ checked, onChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  
  const handleToggle = (event) => {
    if (event.target.checked) {
      setOpenDialog(true);
    } else {
      // 시스템 종료 취소 명령어 실행
      fetch('/api/cancel-shutdown');
    }
    onChange(event);
  };

  const handleConfirm = async () => {
    if (!selectedTime) {
      return;
    }
    
    try {
      const now = new Date();
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const targetTime = new Date(now);
      targetTime.setHours(hours, minutes, 0);
      
      // 만약 선택한 시간이 현재 시간보다 이전이라면 다음 날로 설정
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      // 현재 시간과의 차이를 초 단위로 계산
      const seconds = Math.floor((targetTime - now) / 1000);

      const response = await fetch('/api/shutdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seconds }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate shutdown');
      }

      setOpenDialog(false);
    } catch (error) {
      console.error('Shutdown error:', error);
      // 에러 발생 시 토글 원복
      onChange({ target: { checked: false } });
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    // 토글 원복
    onChange({ target: { checked: false } });
  };

  return (
    <SwitchContainer>
      <IOSSwitch
        checked={checked}
        onChange={handleToggle}
        inputProps={{ 'aria-label': 'shutdown toggle switch' }}
      />
      <StyledDialog
        open={openDialog}
        onClose={handleCancel}
      >
        <DialogTitle>시스템 종료 예약</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
            시스템을 종료할 시간을 선택해주세요.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="종료 시간"
            type="time"
            fullWidth
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5분 단위
            }}
            sx={{
              '& input': {
                color: '#ffffff',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleCancel}>
            취소
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="confirm-btn"
            disabled={!selectedTime}
          >
            확인
          </Button>
        </DialogActions>
      </StyledDialog>
    </SwitchContainer>
  );
} 