import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MessageModal({ open, handleClose, text }) {
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
          p: '5%',
          minWidth: 320,
          borderRadius: '10%',
          alignItems:"center",
          display:"flex",
          flexDirection:"column"
        }}
      >
        <Typography variant="h6" gutterBottom>
          {text}
        </Typography>

        <Button
          sx={{
            mt: 2, // Margin top for spacing
            width: '80%', // Set button width to 80% of its parent
          }}
          onClick={handleClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
MessageModal.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.any,
  text: PropTypes.string,
};
