import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Container
} from '@mui/material';
import axios from 'axios';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Login = ({ setToken }) => {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isTeacher: false
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: loginData.email,
        password: loginData.password
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to login');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.isTeacher ? 'Teacher' : 'Player'
      });

      setSuccess('Registration successful! Please login.');
      setTab(0);
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isTeacher: false
      });
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to register');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ 
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Paper elevation={3} sx={{ width: '100%', mt: 3 }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              bgcolor: '#219ebc', 
              color: 'white',
              p: 2,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4
            }}
          >
            Chess Club
          </Typography>
          
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mx: 3, mt: 2 }}>
              {success}
            </Alert>
          )}

          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#219ebc' }}
              >
                Sign In
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoFocus
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={registerData.isTeacher}
                    onChange={(e) => setRegisterData({ ...registerData, isTeacher: e.target.checked })}
                    color="primary"
                  />
                }
                label="Register as a Teacher"
                sx={{ mt: 1 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#219ebc' }}
              >
                Register
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;