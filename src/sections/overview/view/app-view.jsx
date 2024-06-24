import axios from 'axios';
// import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { BaseUrl } from 'src/helpers/BaseUrl';
import { getToken } from 'src/helpers/getToken';
import Loading from 'src/helpers/Loading/Loading';

// import Iconify from 'src/components/iconify';

// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
// import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState();
  const authToken = getToken();
  const fetchDashboardStats = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setStats(response.data);
      setLoading(false);
      // Use the data to update your dashboard components
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };
  // Map monthly profits to the structure expected by AppOrderTimeline
  const orderTimelineData = stats?.monthlyProfits
    ? Object.entries(stats.monthlyProfits).map(([month, profit]) => ({
        id: month,
        title: `${month}: Profit ${profit.toFixed(2)} TND`,
        type: 'profit',
        time: new Date(month), // This assumes month is in 'YYYY-MM' format
      }))
    : [];

  useEffect(() => {
    fetchDashboardStats(authToken);
  }, [authToken]);
  if (loading) {
    return <Loading />;
  }
  if (!stats) {
    return 'please add some products to display stats';
  }
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Profit"
            total={`${stats?.totalProfit} TND`}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/Money.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Sales Volume"
            total={`${stats?.salesVolume} Product`}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="total Revenue"
            total={`${stats?.totalRevenue} TND`}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/sales.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="total Money Spent"
            total={`${stats?.totalMoneySpent} TND`}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Products Wise Profit"
            chart={{
              labels: stats?.productWiseProfit.map((product) => product.name),
              series: [
                {
                  name: 'Profit',
                  type: 'column',
                  fill: 'solid',
                  data: stats?.productWiseProfit.map((product) => product.profit),
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Inventory Value"
            total={`${stats?.inventoryValue} TND`}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/inventrory.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {stats && (
            <AppConversionRates
              title="Best Selling Products"
              subheader="Top 5 Products"
              chart={{
                series: stats?.bestSellingProducts?.map((product) => ({
                  label: product.name,
                  value: product.sales.length, // Or any other metric for best-selling
                })),
              }}
            />
          )}
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline title="Monthly Profits" list={orderTimelineData} />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>
*/}
        {/*
        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>
*/}

        {/*
        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}
