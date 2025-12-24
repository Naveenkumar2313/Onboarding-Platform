import { styled } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// Import the specific dashboard views
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';
import AdminDashboard from './AdminDashboard'; // We will create this file next

// Styled container for the fallback view
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const DefaultDashboard = () => {
  const { user } = useAuth();

  // 1. Return Admin View
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // 2. Return Student View
  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  // 3. Return Faculty View
  if (user?.role === 'faculty') {
    return <FacultyDashboard />;
  }

  // 4. Fallback (if role is missing or invalid)
  return (
    <Container>
      <h2>Access Denied</h2>
      <p>Your user role ({user?.role}) is not recognized. Please contact support.</p>
    </Container>
  );
};

export default DefaultDashboard;