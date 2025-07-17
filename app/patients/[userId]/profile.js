import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'; // Assuming you are using axios for API calls

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data and appointments from the backend
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/api/user/profile'); // Replace with your actual API endpoint
        const appointmentsResponse = await axios.get('/api/user/appointments'); // Replace with your actual API endpoint

        setUserData(userResponse.data);
        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login'); // Redirect to login if there's an error (e.g., not authenticated)
      }
    const isAuthenticated = true; // Replace with actual authentication check

    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }

    };
    fetchUserData();
  }, [router]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Personal Info</h1>
      <p><strong>Full name:</strong> {userData.fullName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      <p><strong>DOB:</strong> {userData.dob}</p>
      <p><strong>Gender:</strong> {userData.gender}</p>
      <p><strong>Address:</strong> {userData.address}</p>
      <p><strong>Occupation:</strong> {userData.occupation}</p>

      <h2>Appointments History:</h2>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
            <th>Doctor</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{userData.fullName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.status}</td>
              <td>{appointment.doctor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
