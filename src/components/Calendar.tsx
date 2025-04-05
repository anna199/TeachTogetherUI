import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { dayjs } from '../utils/dateAdapter';
import { Event } from '../types';
import { eventApi } from '../services/api';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const startDate = currentDate.startOf('month');
      const endDate = currentDate.endOf('month');
      const response = await eventApi.searchEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setEvents(response);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleDateClick = (date: dayjs.Dayjs, event: React.MouseEvent<HTMLElement>) => {
    setSelectedDate(date);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedDate(null);
  };

  const getEventsForDate = (date: dayjs.Dayjs) => {
    return events.filter((event) => dayjs(event.dateTime).isSame(date, 'day'));
  };

  const renderCalendarDays = () => {
    const startDate = currentDate.startOf('month');
    const endDate = currentDate.endOf('month');
    const days: dayjs.Dayjs[] = [];
    
    let currentDay = startDate;
    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    return days.map((day) => {
      const dayEvents = getEventsForDate(day);
      const isCurrentMonth = day.isSame(currentDate, 'month');

      return (
        <Box
          key={day.toString()}
          onClick={(e) => handleDateClick(day, e)}
          sx={{
            p: 1,
            height: '100px',
            border: '1px solid #e0e0e0',
            backgroundColor: isCurrentMonth ? 'white' : '#f5f5f5',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f0f7ff',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isCurrentMonth ? 'text.primary' : 'text.secondary',
            }}
          >
            {day.format('D')}
          </Typography>
          {dayEvents.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {dayEvents.slice(0, 2).map((event) => (
                <Typography
                  key={event._id}
                  variant="caption"
                  sx={{
                    display: 'block',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    p: 0.5,
                    borderRadius: 1,
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {event.title}
                </Typography>
              ))}
              {dayEvents.length > 2 && (
                <Typography variant="caption" color="text.secondary">
                  +{dayEvents.length - 2} more
                </Typography>
              )}
            </Box>
          )}
        </Box>
      );
    });
  };

  const open = Boolean(anchorEl);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5">
              {currentDate.format('MMMM YYYY')}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/new')}
          >
            Create Event
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0,
            mb: 2,
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Box
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                backgroundColor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="subtitle2">{day}</Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0,
          }}
        >
          {renderCalendarDays()}
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {selectedDate && (
            <Box sx={{ p: 2, maxWidth: 300 }}>
              <Typography variant="h6" gutterBottom>
                {selectedDate.format('MMMM D, YYYY')}
              </Typography>
              <List>
                {getEventsForDate(selectedDate).map((event) => (
                  <ListItem key={event._id} disablePadding>
                    <ListItemButton onClick={() => navigate(`/events/${event._id}`)}>
                      <ListItemText
                        primary={event.title}
                        secondary={`${selectedDate.format('h:mm A')} - ${event.hostName}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
                {getEventsForDate(selectedDate).length === 0 && (
                  <ListItem>
                    <ListItemText primary="No events scheduled" />
                  </ListItem>
                )}
              </List>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/events/new')}
                >
                  Add Event
                </Button>
              </Box>
            </Box>
          )}
        </Popover>
      </Paper>
    </Container>
  );
};

export default Calendar; 