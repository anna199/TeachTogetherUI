import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from './utils/dateAdapter';

// Components
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<EventList />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/events/new" element={<EventForm />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/events/:id/edit" element={<EventForm />} />
            </Routes>
          </div>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
