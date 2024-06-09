import axios from 'axios';
import React, { useState } from 'react';

import { styled } from '@mui/system';
import { Box, Stack, Button, TextField, Typography } from '@mui/material';

import CustomModal from 'src/helpers/modal';
import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';

const FormContainer = styled(Box)({
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

const NewProductForm = () => {
  const token = getToken();
  const [product, setProduct] = useState({
    name: '',
    numberInStock: '',
    photo: '',
    buyingPrice: '',
    buyingDate: '',
  });
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [modalState, setModalState] = useState({
    visible: false,
    message: '',
    color: 'textPrimary',
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file);
  };

  const [tempsrc, setTempsrc] = useState('');
  const previewFiles = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setTempsrc(reader.result);
      setProduct({ ...product, photo: reader.result });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BaseUrl}/products`,
        { product },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      console.log(response.data);
      setModalState({
        visible: true,
        message: 'product added successfully',
        color: 'green',
      });
      // Reset the form
      setProduct({
        name: '',
        numberInStock: '',
        photo: '',
        buyingPrice: '',
        buyingDate: '',
      });
      setTempsrc(''); // Reset the image preview
    } catch (error) {
      setModalState({
        visible: true,
        message: error.response.data.error,
        color: 'red',
      });
      console.log(error.response);
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, visible: false });
  };

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="name"
            label="Product Name"
            value={product.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="numberInStock"
            label="Number in Stock"
            value={product.numberInStock}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            name="buyingPrice"
            label="buying Price"
            value={product.buyingPrice}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            name="buyingDate"
            label="Buying Date"
            value={product.buyingDate}
            onChange={handleChange}
            inputProps={{
              max: getTodayDate(),
            }}
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Button variant="contained" component="label">
            Upload Photo
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {tempsrc && (
            <Box
              component="img"
              alt="Product Preview"
              src={tempsrc}
              sx={{
                width: '50%',
                height: '40%',
                objectFit: 'cover',
                borderRadius: 8,
                marginTop: 2,
              }}
            />
          )}
          <Button type="submit" variant="contained" color="primary">
            Add Product
          </Button>
        </Stack>
      </form>
      <CustomModal
        visible={modalState.visible}
        message={modalState.message}
        color={modalState.color}
        onClose={handleCloseModal}
      />
    </FormContainer>
  );
};

export default NewProductForm;
