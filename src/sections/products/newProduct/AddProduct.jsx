import axios from 'axios';
import React, { useState } from 'react';

import { styled } from '@mui/system';
import {
  Box,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import { BaseUrl } from 'src/helpers/BaseUrl';

const FormContainer = styled(Box)({
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

const NewProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    numberInStock: '',
    photo: '',
    buyingPrice: '',
    buyingDate: '',
    seller: '',
  });

  const sellers = []; // Assuming you have a list of sellers
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    try {
      const response = await axios.post(`${BaseUrl}/products/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product added successfully:', response.data);
      // Reset the form or provide feedback
      setProduct({
        name: '',
        numberInStock: '',
        photo: '',
        sellingPrice: '',
        buyingDate: '',
        seller: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
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
            label="Buying Price"
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
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="seller-label">Seller</InputLabel>
            <Select
              labelId="seller-label"
              name="seller"
              value={product.seller}
              onChange={handleChange}
            >
              {sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {seller.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" component="label">
            Upload Photo
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add Product
          </Button>
        </Stack>
      </form>
    </FormContainer>
  );
};

export default NewProductForm;
