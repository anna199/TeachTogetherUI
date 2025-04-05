import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { dayjs } from '../utils/dateAdapter';
import { EventFormData } from '../types';
import { eventApi } from '../services/api';

const initialFormData: EventFormData = {
  title: '',
  hostName: '',
  hostEmail: '',
  hostPhone: '',
  description: '',
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },
  dateTime: dayjs().toISOString(),
  duration: 60,
  maxCapacity: 10,
  suggestedAgeRange: {
    min: 5,
    max: 12,
  },
  subject: '',
  skillLevel: 'beginner',
  materialsProvided: false,
  requiredMaterials: [],
  additionalNotes: '',
  status: 'upcoming',
};

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const event = await eventApi.getEvent(id!);
      setFormData({
        ...event,
        dateTime: dayjs(event.dateTime).toISOString(),
      });
      setSelectedDate(dayjs(event.dateTime));
    } catch (err) {
      setError('Failed to fetch event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const submitData = {
        ...formData,
        dateTime: selectedDate?.toISOString() || dayjs().toISOString(),
      };

      if (id) {
        await eventApi.updateEvent(id, submitData);
        setSuccess('Event updated successfully!');
      } else {
        await eventApi.createEvent(submitData);
        setSuccess('Event created successfully!');
      }

      // Navigate after a brief delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('Failed to save event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObject = prev[parent as keyof EventFormData] as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentObject,
            [child]: value,
          },
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        dateTime: date.toISOString(),
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Event' : 'Create New Event'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Event Basic Info */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            {/* Date and Time */}
            <Grid item xs={12}>
              <DateTimePicker
                label="Event Date and Time"
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: '100%' }}
              />
            </Grid>

            {/* Host Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Host Name"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="email"
                label="Host Email"
                name="hostEmail"
                value={formData.hostEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Host Phone"
                name="hostPhone"
                value={formData.hostPhone}
                onChange={handleChange}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="City"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="State"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
              />
            </Grid>

            {/* Event Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Duration (minutes)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </Grid>

            {/* Capacity and Age Range */}
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Max Capacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Minimum Age"
                name="suggestedAgeRange.min"
                value={formData.suggestedAgeRange.min}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Maximum Age"
                name="suggestedAgeRange.max"
                value={formData.suggestedAgeRange.max}
                onChange={handleChange}
              />
            </Grid>

            {/* Subject and Skill Level */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Skill Level</InputLabel>
                <Select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    skillLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                  }))}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Description and Notes */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Additional Notes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                helperText="Optional: Any additional information for participants"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {id ? 'Update Event' : 'Create Event'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EventForm; 