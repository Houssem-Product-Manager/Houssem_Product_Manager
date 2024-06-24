import axios from 'axios';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';
import Loading from 'src/helpers/Loading/Loading';
import Searchbar from 'src/layouts/dashboard/common/searchbar';

import ProductCard from '../product-card';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [Isloading, setIsloading] = useState(false);
  const authToken = getToken();

  const fetchProducts = async (token) => {
    try {
      setIsloading(true);
      const response = await axios.get(`${BaseUrl}/products`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      // Filter products with numberInStock > 0
      const availableProducts = response.data.filter((product) => product.numberInStock > 0);
      setProducts(availableProducts);
      console.log(availableProducts);
      setFilteredProducts(availableProducts); // Initialize filtered products
      setIsloading(false);
      return availableProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsloading(false);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts(authToken);
  }, [authToken]);

  const handleSearch = (query) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  if (Isloading) {
    return <Loading />;
  }
  return (
    <Container>
      <Searchbar onSearch={handleSearch} />
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      {filteredProducts.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid key={product._id} xs={12} sm={6} md={4}>
              <ProductCard product={Object(product)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>
          No products found
        </Typography>
      )}
    </Container>
  );
}
