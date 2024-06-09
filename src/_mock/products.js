// import { sample } from 'lodash';
import axios from 'axios';
// import { faker } from '@faker-js/faker';

import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';

export const products = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${BaseUrl}/products`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });
    console.log(response.data);
    console.log('some');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

// const PRODUCT_NAME = [
//   'Nike Air Force 1 NDESTRUKT',
//   'Nike Space Hippie 04',
//   'Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear',
//   'Nike Blazer Low 77 Vintage',
//   'Nike ZoomX SuperRep Surge',
//   'Zoom Freak 2',
//   'Nike Air Max Zephyr',
//   'Jordan Delta',
//   'Air Jordan XXXV PF',
//   'Nike Waffle Racer Crater',
//   'Kyrie 7 EP Sisterhood',
//   'Nike Air Zoom BB NXT',
//   'Nike Air Force 1 07 LX',
//   'Nike Air Force 1 Shadow SE',
//   'Nike Air Zoom Tempo NEXT%',
//   'Nike DBreak-Type',
//   'Nike Air Max Up',
//   'Nike Air Max 270 React ENG',
//   'NikeCourt Royale',
//   'Nike Air Zoom Pegasus 37 Premium',
//   'Nike Air Zoom SuperRep',
//   'NikeCourt Royale',
//   'Nike React Art3mis',
//   'Nike React Infinity Run Flyknit A.I.R. Chaz Bear',
// ];
// const PRODUCT_COLOR = [
//   '#00AB55',
//   '#000000',
//   '#FFFFFF',
//   '#FFC0CB',
//   '#FF4842',
//   '#1890FF',
//   '#94D82D',
//   '#FFC107',
// ];

// ----------------------------------------------------------------------

// Dummy data for sellers
// const sellers = [...Array(5)].map((_, index) => ({
//   id: faker.string.uuid(),
//   name: faker.name.fullName(),
// }));

// Dummy data for products
// export const products = [...Array(24)].map((_, index) => {
//   const setIndex = index + 1;

//   return {
//     id: faker.string.uuid(),
//     photo: `/assets/images/products/product_${setIndex}.jpg`,
//     name: faker.commerce.productName(),
//     numberInStock: faker.number.int({ min: 0, max: 3 }),
//     buyingPrice: faker.number.int({ min: 5, max: 50, precision: 0.01 }),
//     sellingPrice: faker.number.int({ min: 10, max: 100, precision: 0.01 }),
//     seller: sample(sellers), // Assign a random seller
//     buyingDate: faker.date.past().toISOString(),
//   };
// });
