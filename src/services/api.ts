import axios from 'axios';
import { Event, EventFormData, RegistrationFormData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventApi = {
  // Get all events
  getAllEvents: async () => {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  // Get single event
  getEvent: async (id: string) => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData: EventFormData) => {
    const response = await api.post<Event>('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, eventData: Partial<EventFormData>) => {
    const response = await api.put<Event>(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string) => {
    await api.delete(`/events/${id}`);
  },

  // Register for event
  registerForEvent: async (eventId: string, registrationData: RegistrationFormData) => {
    const response = await api.post<Event>(`/events/${eventId}/register`, registrationData);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (eventId: string, participantEmail: string) => {
    const response = await api.delete<Event>(`/events/${eventId}/register/${participantEmail}`);
    return response.data;
  },

  // Search events
  searchEvents: async (params: {
    subject?: string;
    city?: string;
    state?: string;
    minAge?: number;
    maxAge?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<Event[]>('/events/search/filter', { params });
    return response.data;
  },
}; 