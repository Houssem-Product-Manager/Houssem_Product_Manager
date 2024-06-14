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
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { List, ListItem, ListItemText } from '@mui/material';

import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';
import ErrorModal from 'src/helpers/ErrorModal';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import SalesHistory from './sales/Sales-view';
import NewProductForm from './newProduct/AddProduct';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cmnt, setCmnt] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [open, setOpen] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false); // State to control the error modal
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
  const [openAvailable, setOpenAvailable] = useState(false);
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    handleCloseMenu();
  };
  const onCloseAvailable = () => {
    setOpenAvailable(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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
    setOpen(null);
  };

  const token = getToken();
  const handleSell = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/products/${product._id}/sell`,
        { sellingPrice, qte: quantity, comment: cmnt, size: selectedSize },
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
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response?.data?.error);
      setErrorModalOpen(true);
      console.error('Error selling product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmed = window.confirm('Do you really want to delete this product?');

    if (confirmed) {
      try {
        const response = await axios.delete(`${BaseUrl}/products/delete/${product._id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Assuming you use a token for authentication
          },
        });

        console.log('Product deleted successfully', response.data);
        // You might want to update the UI here based on the response
        handleCloseMenu();
        window.location.reload();
      } catch (error) {
        setErrorMessage('Error deleting product: ', error.response?.data?.error || error.message);
        setErrorModalOpen(true);
        console.error('Error deleting product:', error);
      }
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
      {product.buyingPrice} TND
    </Typography>
  );

  const sellingSug = (
    <Typography variant="subtitle1" sx={{ backgroundColor: 'pink' }}>
      to sell: &nbsp;
      {product.priceToSell} TND
    </Typography>
  );

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {renderStatus}

          {renderImg}
          <Box sx={{ top: 0, right: 0, p: 1 }}>
            <Button size="small" onClick={handleOpenMenu} sx={{ color: 'text.secondary' }}>
              <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
            </Button>
            <Popover
              open={!!open}
              anchorEl={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: { width: 140 },
              }}
            >
              <MenuItem onClick={() => setOpenAvailable(true)}>Available Items</MenuItem>
              <MenuItem onClick={handleClickOpenHistoryDialog}>Sales History</MenuItem>
              <MenuItem onClick={handleOpenEditDialog}>
                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteProduct} sx={{ color: 'error.main' }}>
                <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                Delete
              </MenuItem>
            </Popover>
          </Box>
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
            {sellingSug}
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
          <TextField
            margin="dense"
            id="cmnt"
            label="Comment"
            fullWidth
            variant="outlined"
            value={cmnt}
            onChange={(e) => setCmnt(e.target.value)}
          />
          <Select
            labelId="size-select-label"
            id="size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            fullWidth
            variant="outlined"
          >
            {product.sizes.map((size, index) => (
              <MenuItem key={index} value={size.size} disabled={size.stock === 0}>
                {size.size} {size.stock === 0 && '(Out of Stock)'}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSellDialog}>Cancel</Button>
          <Button onClick={handleSell} color="primary">
            Sell
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <NewProductForm productData={product} isEdit onClose={handleCloseEditDialog} />
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
      {/* Availabe Items */}
      <Dialog open={openAvailable} onClose={onCloseAvailable}>
        <DialogTitle>Product Inventory</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{product.name}</Typography>
          <List>
            {product.sizes.map((size, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Size: ${size.size}`}
                  secondary={`Stock: ${size.stock}`}
                  primaryTypographyProps={{ color: size.stock === 0 ? 'red' : 'inherit' }}
                  secondaryTypographyProps={{ color: size.stock === 0 ? 'red' : 'inherit' }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseAvailable}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
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
