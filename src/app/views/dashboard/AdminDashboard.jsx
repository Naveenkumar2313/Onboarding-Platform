import { useEffect, useState } from 'react';
import { 
  Box, Card, Table, TableBody, TableCell, TableHead, TableRow, 
  Button, Typography, Chip, styled, useTheme 
} from '@mui/material';
import AdminService from '../../services/AdminService';
import ApplicationDetailDialog from './ApplicationDetailDialog'; // Ensure this exists from previous steps

// STYLED COMPONENTS
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

const AdminDashboard = () => {
  const theme = useTheme();
  
  // State
  const [applications, setApplications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Fetch Data
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await AdminService.getAllPendingApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  // Modal Actions
  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedApp(null);
  };

  const handleApprove = async (id) => {
    try {
      await AdminService.approveApplication(id);
      alert("Application Verified Successfully!");
      handleCloseModal();
      fetchApplications();
    } catch (error) {
      alert("Error verifying application");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      try {
        await AdminService.rejectApplication(id);
        handleCloseModal();
        fetchApplications();
      } catch (error) {
        alert("Error rejecting application");
      }
    }
  };

  return (
    <ContentBox>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Admin Dashboard
      </Typography>
      
      <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={4} mb={2}>
          <Title>Pending Verifications</Title>
        </Box>

        <Box overflow="auto">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableCell>User Details</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No pending applications found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {app.userRole === 'faculty' ? app.department : app.institution}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {app.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.userRole === 'faculty' ? "Faculty" : "Student"} 
                        color={app.userRole === 'faculty' ? "secondary" : "primary"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip label={app.status} color="warning" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        onClick={() => handleViewDetails(app)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <ApplicationDetailDialog 
        open={openModal}
        handleClose={handleCloseModal}
        application={selectedApp}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </ContentBox>
  );
};

export default AdminDashboard;