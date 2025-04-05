import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Event, RegistrationFormData } from '../types';
import { eventApi } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationFormData>({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: 0,
    notes: '',
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventApi.getEvent(id!);
      setEvent(data);
    } catch (err) {
      setError('Failed to fetch event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await eventApi.registerForEvent(id!, registrationForm);
      setShowRegisterDialog(false);
      fetchEvent(); // Refresh event data
    } catch (err) {
      setError('Failed to register for event');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await eventApi.deleteEvent(id!);
      navigate('/');
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
    }
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : event ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4">{event.title}</Typography>
              <Box>
                <IconButton onClick={() => navigate(`/events/${id}/edit`)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setShowDeleteDialog(true)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Event Status */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Event Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={event.status}
                    color={event.status === 'upcoming' ? 'success' : 'error'}
                  />
                  <Chip
                    label={`${event.currentEnrollment}/${event.maxCapacity} participants`}
                    color={event.currentEnrollment >= event.maxCapacity ? 'error' : 'primary'}
                  />
                </Box>
              </Box>

              {/* Host Information */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Host Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>{event.hostName}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography>{event.hostEmail}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography>{event.hostPhone}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Two-column layout for Event Details and Description */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Event Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Event Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon />
                      <Typography>
                        {event.location.city}, {event.location.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon />
                      <Typography>
                        {format(new Date(event.dateTime), 'PPP p')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon />
                      <Typography>
                        Age range: {event.suggestedAgeRange.min} - {event.suggestedAgeRange.max} years
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Description */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography paragraph>{event.description}</Typography>
                  {event.additionalNotes && (
                    <Typography color="text.secondary">
                      Additional notes: {event.additionalNotes}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Participants */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Participants ({event.currentEnrollment}/{event.maxCapacity})
                </Typography>
                <List>
                  {event.participants.map((participant, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${participant.childName} (${participant.childAge} years old)`}
                        secondary={`Parent: ${participant.parentName}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Register Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowRegisterDialog(true)}
                  disabled={event.currentEnrollment >= event.maxCapacity}
                >
                  Register for Event
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Alert severity="error">Event not found</Alert>
        )}
      </Paper>

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onClose={() => setShowRegisterDialog(false)}>
        <DialogTitle>Register for Event</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Parent Name"
              fullWidth
              name="parentName"
              value={registrationForm.parentName}
              onChange={handleRegistrationChange}
            />
            <TextField
              label="Parent Email"
              type="email"
              fullWidth
              name="parentEmail"
              value={registrationForm.parentEmail}
              onChange={handleRegistrationChange}
            />
            <TextField
              label="Parent Phone"
              fullWidth
              name="parentPhone"
              value={registrationForm.parentPhone}
              onChange={handleRegistrationChange}
            />
            <TextField
              label="Child Name"
              fullWidth
              name="childName"
              value={registrationForm.childName}
              onChange={handleRegistrationChange}
            />
            <TextField
              label="Child Age"
              type="number"
              fullWidth
              name="childAge"
              value={registrationForm.childAge}
              onChange={handleRegistrationChange}
            />
            <TextField
              label="Notes"
              fullWidth
              name="notes"
              multiline
              rows={2}
              value={registrationForm.notes}
              onChange={handleRegistrationChange}
              helperText="Optional: Any special requirements or notes"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRegisterDialog(false)}>Cancel</Button>
          <Button onClick={handleRegister} variant="contained" color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails; 