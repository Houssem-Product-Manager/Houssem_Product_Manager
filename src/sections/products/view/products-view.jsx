import axios from 'axios';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const authToken = getToken();
  const fetchProducts = async (token) => {
    try {
      const response = await axios.get(`${BaseUrl}/products`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      console.log(response.data);
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };
  useEffect(() => {
    fetchProducts(authToken);
  }, [authToken]);
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products?.map((product) => (
          <Grid key={product._id} xs={12} sm={6} md={3}>
            <ProductCard product={Object(product)} />
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
