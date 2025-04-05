import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { Add as AddIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
              fontWeight: 'bold',
            }}
          >
            Mom Teach Kids
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/calendar"
              startIcon={<CalendarIcon />}
            >
              Calendar
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/events/new"
              startIcon={<AddIcon />}
            >
              Create Event
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 