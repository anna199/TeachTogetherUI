export interface Event {
  _id: string;
  title: string;
  hostName: string;
  hostEmail: string;
  hostWechatId: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dateTime: string;
  duration: number;
  maxCapacity: number;
  currentEnrollment: number;
  suggestedAgeRange: {
    min: number;
    max: number;
  };
  subject: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  materialsProvided: boolean;
  requiredMaterials: string[];
  additionalNotes: string;
  participants: Participant[];
  status: 'upcoming' | 'cancelled';
  lastUpdated: string;
  createdAt: string;
}

export interface Participant {
  parentName: string;
  parentEmail: string;
  wechatId: string;
  childName: string;
  childAge: number;
  notes: string;
  registeredAt: string;
}

export interface EventFormData extends Omit<Event, '_id' | 'participants' | 'currentEnrollment' | 'lastUpdated' | 'createdAt'> {
  dateTime: string;
}

export interface RegistrationFormData {
  parentName: string;
  parentEmail: string;
  wechatId: string;
  childName: string;
  childAge: number;
  notes: string;
} 