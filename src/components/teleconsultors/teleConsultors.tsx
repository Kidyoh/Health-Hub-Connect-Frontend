"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Teleconsultor {
  id: number;
  firstName: string;
  lastName: string;
  rate: number;
}

const TeleconsultorsList = () => {
  const [teleconsultors, setTeleconsultors] = useState<Teleconsultor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeleconsultors = async () => {
      try {
        const res = await fetch('/api/teleconsultors');
        const data = await res.json();
        if (data.success) {
          setTeleconsultors(data.teleconsultors);
        } else {
          setError(data.error);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch teleconsultors.');
        setLoading(false);
      }
    };

    fetchTeleconsultors();
  }, []);

  const handleBookNow = (id: number) => {
    router.push(`/teleconsultors/${id}/book`); // Passing the teleconsultorId to the booking page
  };

  if (loading) return <p>Loading teleconsultors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Available Teleconsultors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teleconsultors.map((teleconsultor) => (
          <div key={teleconsultor.id} className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold">
             Dr. {teleconsultor.firstName} {teleconsultor.lastName}
            </h2>
            <p>Rate: ${teleconsultor.rate}</p>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => handleBookNow(teleconsultor.id)} // Pass teleconsultorId
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeleconsultorsList;
