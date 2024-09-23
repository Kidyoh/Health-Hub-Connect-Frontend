// types/appointment.ts
export interface Facility {
  id: number;
  name: string;
  location: string;
  services: string;
  hours: string;
  contact: string;
  type: string;
}

export interface Appointment {
  id: number;
  date: string;
  userId: number;
  facilityId: number;
  teleconsultationId: number;
  status: string;
  facility: Facility;
}