import axios from 'axios';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fCurrency } from 'src/utils/format-number';

import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';

import Label from 'src/components/label';

import SalesHistory from './sales/Sales-view';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const handleClickOpenSellDialog = () => {
    setOpenSellDialog(true);
  };

  const handleCloseSellDialog = () => {
    setOpenSellDialog(false);
  };

  const handleClickOpenHistoryDialog = () => {
    setOpenHistoryDialog(true);
  };

  const handleCloseHistoryDialog = () => {
    setOpenHistoryDialog(false);
  };

  const token = getToken();
  const handleSell = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/products/${product._id}/sell`,
        { sellingPrice, qte: quantity },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Assuming you use a token for authentication
          },
        }
      );

      console.log(`Product sold successfully: ${response.data.product}`);
      // You might want to update the UI here based on the response
      handleCloseSellDialog();
    } catch (error) {
      console.error('Error selling product:', error);
    }
  };

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
      Bought with: &nbsp;
      {fCurrency(product.buyingPrice)}
    </Typography>
  );

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {renderStatus}
          <Button
            sx={{
              zIndex: 9,
              top: 16,
              left: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
            variant="contained"
            color="inherit"
            style={{ width: '30%' }}
            onClick={handleClickOpenHistoryDialog} // Handle click to open sales history dialog
          >
            Sales History
          </Button>
          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link color="inherit" underline="hover" variant="subtitle1" noWrap>
            {product.name}
          </Link>

          <Typography variant="body2" color="text.secondary" noWrap>
            Buyer: {product.buyer?.fullName}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {renderPrice}
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            Buying Date: {format(new Date(product.buyingDate), 'yyyy-MM-dd')}
          </Stack>
          <Typography style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              color="inherit"
              style={{ width: '60%' }}
              onClick={handleClickOpenSellDialog}
            >
              Sell Item
            </Button>
          </Typography>
        </Stack>
      </Card>

      {/* Sell Dialog */}
      <Dialog open={openSellDialog} onClose={handleCloseSellDialog}>
        <DialogTitle>Sell Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSellDialog}>Cancel</Button>
          <Button onClick={handleSell} color="primary">
            Sell
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sales History Dialog */}
      <Dialog open={openHistoryDialog} onClose={handleCloseHistoryDialog}>
        <DialogTitle>Sales History</DialogTitle>
        <DialogContent>
          <SalesHistory sales={product.sales} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.any,
  // product: PropTypes.shape({
  //   name: PropTypes.string,
  //   numberInStock: PropTypes.number,
  //   photo: PropTypes.string,
  //   buyingPrice: PropTypes.number,
  //   sellingPrice: PropTypes.number,
  //   seller: PropTypes.shape({
  //     email: PropTypes.string,
  //     fullName: PropTypes.string,
  //     password: PropTypes.string,
  //     verificationCode: PropTypes.string,
  //     verified: PropTypes.bool,
  //   }),
  //   buyer: PropTypes.shape({
  //     email: PropTypes.string,
  //     fullName: PropTypes.string,
  //     password: PropTypes.string,
  //     verificationCode: PropTypes.string,
  //     verified: PropTypes.bool,
  //   }),
  // }).isRequired,
};
