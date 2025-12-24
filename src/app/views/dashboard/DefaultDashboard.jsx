import { useEffect, useState } from 'react';
import { 
  Box, Card, Table, TableBody, TableCell, TableHead, TableRow, 
  Button, Typography, Chip, styled, useTheme 
} from '@mui/material';
import AdminService from '../../services/AdminService';
import useAuth from '../../hooks/useAuth';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const DefaultDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const theme = useTheme();

  // 1. Fetch Data on Load
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await AdminService.getAllPendingApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  // 2. Handle Actions
  const handleApprove = async (id) => {
    try {
      await AdminService.approveApplication(id);
      // Refresh list after update
      fetchApplications();
      alert("Application Verified!");
    } catch (error) {
      alert("Error verifying application");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      await AdminService.rejectApplication(id);
      fetchApplications();
    }
  };

  // 3. Render Logic based on Role
  if (user?.role !== 'admin') {
    return (
      <ContentBox>
        <Typography variant="h4">Welcome, {user?.name}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your application status: <Chip label="Pending Verification" color="warning" />
        </Typography>
      </ContentBox>
    );
  }

  return (
    <ContentBox>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>
      
      <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={4} mb={2}>
          <Title>Pending Verifications</Title>
        </Box>

        <Box overflow="auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name/ID</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No pending applications</TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box ml={2}>
                          <Typography variant="h6">User ID: {app.userId}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {app.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.userRole === 'faculty' ? "Faculty" : "Student"} 
                        color={app.userRole === 'faculty' ? "secondary" : "primary"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={app.status} color="warning" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        color="success" 
                        variant="contained" 
                        size="small" 
                        sx={{ mr: 1 }}
                        onClick={() => handleApprove(app.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        color="error" 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleReject(app.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </ContentBox>
  );
};

export default DefaultDashboard;