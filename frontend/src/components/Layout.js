import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children, logout }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar logout={logout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          overflowY: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;