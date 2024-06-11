import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function SalesHistory({ sales }) {
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6">Sales History</Typography>
        {sales.length > 0 ? (
          sales.map((sale, index) => (
            <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <Typography variant="body2">Seller: {sale.seller.fullName}</Typography>
              <Typography variant="body2">
                Selling Date: {format(new Date(sale.sellingDate), 'yyyy-MM-dd')}
              </Typography>
              <Typography variant="body2">Selling Price: {sale.sellingPrice}</Typography>
              <Typography variant="body2">Quantity Sold: {sale.quantitySold}</Typography>
              <Typography variant="body2">Comment: {sale.comment}</Typography>

            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No sales history available.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

SalesHistory.propTypes = {
  sales: PropTypes.arrayOf(
    PropTypes.shape({
      seller: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
      }).isRequired,
      sellingDate: PropTypes.string.isRequired,
      sellingPrice: PropTypes.number.isRequired,
      quantitySold: PropTypes.number.isRequired,
    })
  ).isRequired,
};
