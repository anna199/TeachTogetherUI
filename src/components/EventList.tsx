import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { Event } from '../types';
import { eventApi } from '../services/api';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');
  const [minAge, setMinAge] = useState<number | ''>('');
  const [maxAge, setMaxAge] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventApi.getAllEvents();
      setEvents(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (subject) params.subject = subject;
      if (city) params.city = city;
      if (minAge) params.minAge = minAge;
      if (maxAge) params.maxAge = maxAge;
      if (startDate) params.startDate = startDate.toISOString();

      const data = await eventApi.searchEvents(params);
      setEvents(data);
      setError('');
    } catch (err) {
      setError('Failed to search events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSubject('');
    setCity('');
    setMinAge('');
    setMaxAge('');
    setStartDate(null);
    fetchEvents();
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Search Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Min Age"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : '')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Max Age"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value ? Number(e.target.value) : '')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                fullWidth
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Event Cards */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                
                <Typography color="textSecondary" gutterBottom>
                  {format(new Date(event.dateTime), 'MMM dd, yyyy - h:mm a')}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  {event.location.city}, {event.location.state}
                </Typography>
                
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Chip
                    label={`Ages ${event.suggestedAgeRange.min}-${event.suggestedAgeRange.max}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={event.skillLevel}
                    size="small"
                    color="primary"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  {event.currentEnrollment} / {event.maxCapacity} enrolled
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {events.length === 0 && !loading && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No events found
        </Typography>
      )}
    </Container>
  );
};

export default EventList; 