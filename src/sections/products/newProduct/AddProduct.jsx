import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/system';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Stack, Button, TextField, Typography, IconButton } from '@mui/material';

import CustomModal from 'src/helpers/modal';
import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';
import Loading from 'src/helpers/Loading/Loading';

const FormContainer = styled(Box)({
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

export default function NewProductForm({ productData = {}, isEdit = false, onClose }) {
  const token = getToken();
  const [IsLoaing, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    photo: '',
    buyingPrice: '',
    buyingDate: '',
    priceToSell: '',
    sizes: [{ size: '', stock: '' }],
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

  useEffect(() => {
    if (isEdit) {
      setProduct(productData);
      setTempsrc(productData.photo);
    }
  }, [isEdit, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...product.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setProduct({ ...product, sizes: newSizes });
  };

  const handleAddSize = () => {
    setProduct({ ...product, sizes: [...product.sizes, { size: '', stock: '' }] });
  };

  const handleDeleteSize = (index) => {
    const newSizes = [...product.sizes];
    newSizes.splice(index, 1);
    setProduct({ ...product, sizes: newSizes });
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
    const numberInStock = product.sizes.reduce((acc, size) => acc + Number(size.stock), 0);
    try {
      setIsLoading(true);
      const url = isEdit ? `${BaseUrl}/products/${product._id}` : `${BaseUrl}/products`;
      const method = isEdit ? 'put' : 'post';
      const response = await axios({
        method,
        url,
        data: { ...product, numberInStock },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setModalState({
        visible: true,
        message: isEdit ? 'Product updated successfully' : 'Product added successfully',
        color: 'green',
      });
      setIsLoading(false);
      // Reset the form if not editing
      if (!isEdit) {
        setProduct({
          name: '',
          photo: '',
          buyingPrice: '',
          buyingDate: '',
          priceToSell: '',
          sizes: [{ size: '', stock: '' }],
        });
        setTempsrc(''); // Reset the image preview
      }
      onClose();
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      setModalState({
        visible: true,
        message: error.response.data.error,
        color: 'red',
      });
      setIsLoading(false);
      console.log(error.response);
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, visible: false });
  };
  if (IsLoaing) {
    return <Loading />;
  }

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Product' : 'Add New Product'}
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
          {product.sizes.map((sizeObj, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label={`Size ${index + 1}`}
                value={sizeObj.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label={`Stock ${index + 1}`}
                value={sizeObj.stock}
                onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                type="number"
                fullWidth
                required
              />
              <IconButton onClick={() => handleDeleteSize(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton onClick={handleAddSize} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
          <TextField
            name="buyingPrice"
            label="Buying Price"
            value={product.buyingPrice}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            name="priceToSell"
            label="Price to sell with"
            value={product.priceToSell}
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
            {isEdit ? 'Update Product' : 'Add Product'}
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
}

NewProductForm.propTypes = {
  productData: PropTypes.any,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func,
};
