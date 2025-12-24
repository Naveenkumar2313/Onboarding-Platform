import { useEffect, useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Chip, 
  Stepper, Step, StepLabel, Divider, Avatar, useTheme 
} from '@mui/material';
import { CheckCircle, Pending, Edit } from '@mui/icons-material';
import StudentService from '../../services/StudentService';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch profile to see status
    StudentService.getProfile(user.id).then(res => {
      if(res.data && res.data.length > 0) setProfile(res.data[0]);
    });
  }, [user.id]);

  // Determine Step for the Stepper
  const getActiveStep = (status) => {
    if (!status) return 0; // Not Started
    if (status === 'Pending Verification') return 1;
    if (status === 'Verified') return 3;
    if (status === 'Rejected') return 1; // Stay on pending but show error
    return 0;
  };

  const steps = ['Draft', 'Submitted', 'Under Review', 'Verified'];

  return (
    <Box sx={{ p: 4 }}>
      {/* 1. WELCOME HEADER */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Welcome, {user.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track your admission application status here.
          </Typography>
        </div>
        {profile && (
          <Chip 
            label={profile.status} 
            color={profile.status === 'Verified' ? 'success' : 'warning'} 
            sx={{ fontWeight: 'bold', px: 1 }}
          />
        )}
      </Box>

      <Grid container spacing={4}>
        {/* 2. LEFT COL: STATUS TRACKER */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Application Timeline</Typography>
            
            {!profile ? (
               <Box textAlign="center" py={4}>
                 <Typography color="textSecondary" sx={{ mb: 2 }}>
                   You haven't started your application yet.
                 </Typography>
                 <Button variant="contained" onClick={() => navigate('/onboarding/student')}>
                   Start Application
                 </Button>
               </Box>
            ) : (
              <Stepper activeStep={getActiveStep(profile.status)} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {/* Rejection Notice */}
            {profile?.status === 'Rejected' && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#FFEBEE', borderRadius: 2, border: '1px solid #FFCDD2' }}>
                <Typography color="error" variant="subtitle2">Application Rejected</Typography>
                <Typography variant="body2">
                  Please contact the administration or update your details.
                </Typography>
                <Button size="small" color="error" sx={{ mt: 1 }} onClick={() => navigate('/onboarding/student')}>
                  Edit Application
                </Button>
              </Box>
            )}
          </Card>

          {/* APPLICATION DETAILS PREVIEW */}
          {profile && (
            <Card elevation={3} sx={{ p: 4 }}>
               <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6">Application Summary</Typography>
                 <Button startIcon={<Edit />} onClick={() => navigate('/onboarding/student')}>
                   Edit
                 </Button>
               </Box>
               <Divider sx={{ mb: 2 }} />
               <Grid container spacing={2}>
                 <Grid item xs={6}>
                   <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                   <Typography variant="body1">{profile.phone}</Typography>
                 </Grid>
                 <Grid item xs={6}>
                   <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                   <Typography variant="body1">{profile.dob}</Typography>
                 </Grid>
                 <Grid item xs={12}>
                   <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                   <Typography variant="body1">{profile.address}</Typography>
                 </Grid>
                 <Grid item xs={12} sx={{ mt: 1 }}>
                   <Typography variant="subtitle2" color="textSecondary">Previous Education</Typography>
                   <Typography variant="body1">
                     {profile.institution} (Grade: {profile.grade})
                   </Typography>
                 </Grid>
               </Grid>
            </Card>
          )}
        </Grid>

        {/* 3. RIGHT COL: PROFILE CARD */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ width: 80, height: 80, margin: '0 auto', mb: 2, bgcolor: theme.palette.secondary.main }}
            >
              {user.name[0]}
            </Avatar>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">{user.email}</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">User Role</Typography>
              <Typography variant="body2" fontWeight="bold">Student</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Joined</Typography>
              <Typography variant="body2" fontWeight="bold">Dec 2025</Typography>
            </Box>
          </Card>

          {/* Quick Actions */}
          <Card elevation={3} sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Contact Support</Button>
            <Button fullWidth variant="outlined">View Documents</Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;