import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Divider,
  Box,
  Button
} from '@mui/material';
import { 
  Leaderboard as RankingsIcon,
  EmojiEvents as TournamentIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Groups as ClubsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ logout }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <RankingsIcon />, text: 'Rankings', path: '/rankings' },
    { icon: <TournamentIcon />, text: 'Tournaments', path: '/tournaments' },
    { icon: <PeopleIcon />, text: 'Players', path: '/players' },
    { icon: <ClubsIcon />, text: 'Clubs', path: '/clubs' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#219ebc',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Chess Club
        </Typography>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            button
            selected={location.pathname === item.path}
            sx={{
              my: 0.5,
              borderRadius: 1,
              mx: 1,
              color: 'white',
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          onClick={logout}
          startIcon={<LogoutIcon />}
          sx={{
            color: 'white',
            justifyContent: 'flex-start',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Created by
        </Typography>
        <Typography variant="subtitle2" color="white">
          Ioannis Michos
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
