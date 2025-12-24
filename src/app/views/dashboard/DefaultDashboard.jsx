import { styled } from '@mui/material';
import useAuth from '../../hooks/useAuth';

// CORRECTED IMPORTS
// These are in the 'onboarding' folder, so we go up one level (../) and into 'onboarding'
import StudentDashboard from '../onboarding/StudentDashboard';
import FacultyDashboard from '../onboarding/FacultyDashboard';

// AdminDashboard is in the same 'dashboard' folder, so this stays the same
import AdminDashboard from './AdminDashboard'; 

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