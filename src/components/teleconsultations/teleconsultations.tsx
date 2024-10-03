"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Teleconsultation {
  id: number;
  doctor: string;
  date: string;
  status: string;
}

const TeleconsultationsList: React.FC = () => {
  const [teleconsultations, setTeleconsultations] = useState<Teleconsultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startingSession, setStartingSession] = useState<boolean>(false); // To track session starting
  const router = useRouter();

  useEffect(() => {
    const fetchTeleconsultations = async () => {
      try {
        const res = await fetch('/api/telemedicine/getConsultations');
        const data = await res.json();
        if (data.success) {
          setTeleconsultations(data.teleconsultations);
        } else {
          setError(data.error);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch teleconsultations.');
        setLoading(false);
      }
    };

    fetchTeleconsultations();
  }, []);

  const handleTeleconsultationClick = async (id: number) => {
    setStartingSession(true); // Indicate session start in progress

    try {
      // Start session by calling the backend
      const res = await fetch(`/api/telemedicine/${id}/start-session`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        // Redirect to the session URL (Daily.co room)
        window.location.href = data.roomUrl;
      } else {
        console.error(data.error);
        setError('Failed to start session.');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Error starting session.');
    } finally {
      setStartingSession(false); // Reset the loading state
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading teleconsultations...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Teleconsultations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teleconsultations.map((consultation) => (
          <div
            key={consultation.id}
            className={`p-6 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg transition duration-200 ${
              startingSession ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !startingSession && handleTeleconsultationClick(consultation.id)}
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Teleconsultation with {consultation.doctor}
            </h3>
            <p className="text-gray-500 mb-2">
              {new Date(consultation.date).toLocaleString()}
            </p>
            <p className={`font-semibold ${consultation.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
              Status: {consultation.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeleconsultationsList;
