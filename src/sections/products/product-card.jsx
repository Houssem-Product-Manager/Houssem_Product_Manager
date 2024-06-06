import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={product.numberInStock > 0 ? 'info' : 'error'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.numberInStock > 0 ? 'In Stock' : 'Out of Stock'} ({' '}
      <h3 style={{ color: 'black' }}>{product.numberInStock} items</h3>)
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.photo}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.buyingPrice && fCurrency(product.buyingPrice)}
      </Typography>
      &nbsp;
      {fCurrency(product.sellingPrice)}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.name}
        </Link>

        <Typography variant="body2" color="text.secondary" noWrap>
          Seller: {product.seller.name}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    numberInStock: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    buyingPrice: PropTypes.number,
    sellingPrice: PropTypes.number.isRequired,
    seller: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
