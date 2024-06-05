import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function VerificationModal({
  open,
  handleClose,
  verificationCode,
  setVerificationCode,
  resendCode,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="verification-code-modal"
      aria-describedby="enter-verification-code"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 320,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Verification Code sent to houssem saadli
        </Typography>
        <TextField
          fullWidth
          label="Verification Code"
          variant="outlined"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button onClick={handleClose}>Submit</Button>
        <Button onClick={resendCode}>resend code</Button>
      </Box>
    </Modal>
  );
}
VerificationModal.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.any,
  verificationCode: PropTypes.any,
  setVerificationCode: PropTypes.any,
  resendCode: PropTypes.any,
};
