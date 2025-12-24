import { useEffect, useState } from 'react';
import { 
  Box, Card, Grid, Typography, Button, Chip, 
  LinearProgress, Divider, Avatar, useTheme 
} from '@mui/material';
import { School, Work } from '@mui/icons-material';
import FacultyService from '../../services/FacultyService';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    FacultyService.getProfile(user.id).then(res => {
      if(res.data && res.data.length > 0) setProfile(res.data[0]);
    });
  }, [user.id]);

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* HEADER CARD */}
        <Grid item xs={12}>
          <Card 
            elevation={0} 
            sx={{ 
              p: 4, 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              color: 'white',
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">Hello, Professor {user.name.split(' ')[0]}</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Faculty Portal & Onboarding Center
              </Typography>
            </Box>
            {profile && (
              <Chip 
                label={profile.status} 
                sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 'bold' }} 
              />
            )}
          </Card>
        </Grid>

        {/* MAIN CONTENT */}
        <Grid item xs={12} md={8}>
          {/* Status Section */}
          <Card elevation={3} sx={{ p: 4, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Onboarding Status</Typography>
            
            {!profile ? (
              <Box>
                <Typography color="textSecondary" paragraph>
                  Please complete your professional profile to initiate the verification process.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/onboarding/faculty')}>
                  Complete Profile
                </Button>
              </Box>
            ) : (
              <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight="bold">
                    {profile.status === 'Verified' ? 'Onboarding Complete' : 'Verification in Progress'}
                  </Typography>
                  <Typography variant="body2">
                    {profile.status === 'Verified' ? '100%' : '75%'}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={profile.status === 'Verified' ? 100 : 75} 
                  color={profile.status === 'Rejected' ? 'error' : 'primary'}
                  sx={{ height: 10, borderRadius: 5 }} 
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                   Last updated: {new Date(profile.submittedAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Card>

          {/* Professional Details Card */}
          {profile && (
            <Card elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Professional Details</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: theme.palette.success.light }}><Work /></Avatar>
                    <Box>
                       <Typography variant="caption">Department</Typography>
                       <Typography variant="subtitle1" fontWeight="bold">{profile.department}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                     <Avatar sx={{ bgcolor: theme.palette.warning.light }}><School /></Avatar>
                     <Box>
                        <Typography variant="caption">Designation</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{profile.designation}</Typography>
                     </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Qualification:</strong> {profile.qualification}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Experience:</strong> {profile.experience} Years
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          )}
        </Grid>

        {/* SIDEBAR WIDGETS */}
        <Grid item xs={12} md={4}>
           <Card elevation={3} sx={{ p: 3, mb: 3 }}>
             <Typography variant="h6" gutterBottom>Upcoming Orientation</Typography>
             <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
               <Typography variant="subtitle2">Faculty Orientation Day</Typography>
               <Typography variant="caption" color="textSecondary">Jan 15, 2026 • 10:00 AM</Typography>
             </Box>
           </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacultyDashboard;