import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/system';
import { Box, Modal, Button, Typography } from '@mui/material';

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '16px 32px 24px',
});

export default function CustomModal({ visible, message, color, onClose }) {
  return (
    <Modal open={visible} onClose={onClose}>
      <ModalBox>
        <Typography variant="h6" color={color}>
          {message}
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </ModalBox>
    </Modal>
  );
}
CustomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
