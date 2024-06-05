import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';
import { BaseUrl } from 'src/helpers/BaseUrl';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import VerificationModal from './VerificationModal';
import MessageModal from '../messages/MessageModel';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageModal, setMessageModal] = useState(false);

  const [user, setUser] = useState({
    email: '',
    pwd: '',
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BaseUrl}/auth/login`, user);
      // Save token to local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id);
      setLoading(false);
      setUser({
        email: '',
        pwd: '',
      });
      navigate('/');
    } catch (error) {
      console.error('Error registring user:', error);

      // Display appropriate error messages based on error response
      if (error.response) {
        setLoading(false);
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          // alert('please fill in all fields');
          setMessage('please fill in all fields');
          setMessageModal(true);
        } else if (error.response.status === 401) {
          // alert('Invalid email or password!');
          setMessage('Invalid email or password!');
          setMessageModal(true);
        } else if (error.response.status === 403) {
          // alert('please verify your account first !');
          setMessage('please verify your account first !');
          setMessageModal(true);
          setUserId(error.response.data.userId);
          setOpenModal(true);
        } else {
          alert('Internal server error.');
        }
      } else if (error.request) {
        setLoading(false);
        // The request was made but no response was received
        setMessage('Network error: Please check your internet connection and try again.');
        setMessageModal(true);
      } else {
        setLoading(false);
        // Something else happened while setting up the request

        setMessage('Error: An unexpected error occurred. Please try again later.');
        setMessageModal(true);
      }
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState();
  const handleCloseModal = async () => {
    setOpenModal(false);
    setLoading(true);
    try {
      const response = await axios.post(`${BaseUrl}/auth/verifyUser`, {
        userId,
        code: verificationCode,
      });
      setMessage(response.data.message);
      setMessageModal(true);
      setLoading(false);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BaseUrl}/auth/resendcode`, {
        userId,
      });
      console.log(response.data.message);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(error.response.data.error);
        setMessageModal(true);
        console.log(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response from server');
        setMessage('No response from server');
        setMessageModal(true);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error: ', error.message);
      }
      setLoading(false);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          value={user.email}
          name="email"
          label="Email address"
          onChange={handleInputChange}
        />

        <TextField
          name="pwd"
          onChange={handleInputChange}
          value={user.pwd}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'loading...' : 'Login'}
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to My Money</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link href="/register" variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
      <VerificationModal
        open={openModal}
        handleClose={handleCloseModal}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        resendCode={resendCode}
      />
      <MessageModal open={messageModal} text={message} handleClose={() => setMessageModal(false)} />
    </Box>
  );
}
