"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Appointment = {
  id: string;
  primaryPhysician: string;
  schedule: string;
  reason: string;
  status: string;
  note?: string;
  cancellationReason?: string;
};

export default function AppointmentHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchAppointmentHistory = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`/api/patients/${userId}/appointments`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch appointments');
          }

          const data = await response.json();

          if (data && Array.isArray(data)) {
            setAppointmentHistory(data);
          } else {
            setError('No appointments found');
          }
        } catch (err) {
            const errorMessage = (err as Error).message || 'Error fetching appointment history';
            setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointmentHistory();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Appointment History</h1>
      {appointmentHistory.length > 0 ? (
        <ul>
          {appointmentHistory.map((appointment) => (
            <li key={appointment.id} className="mb-4 p-4 border rounded shadow">
              <p><strong>Doctor:</strong> {appointment.primaryPhysician}</p>
              <p><strong>Schedule:</strong> {new Date(appointment.schedule).toLocaleString()}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              {appointment.note && <p><strong>Note:</strong> {appointment.note}</p>}
              {appointment.cancellationReason && (
                <p><strong>Cancellation Reason:</strong> {appointment.cancellationReason}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No past appointments found.</p>
      )}
      <button onClick={() => router.back()} className="mt-4 p-2 bg-gray-300 rounded">
        Go Back
      </button>
    </div>
  );
}
