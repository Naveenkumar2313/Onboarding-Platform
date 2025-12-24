import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    Typography, Grid, Divider, Chip, Box 
  } from '@mui/material';
  
  const ApplicationDetailDialog = ({ open, handleClose, application, onApprove, onReject }) => {
    if (!application) return null;
  
    const isFaculty = application.userRole === 'faculty';
  
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {isFaculty ? 'Faculty Application' : 'Student Application'}
          </Typography>
          <Chip 
            label={application.status} 
            color={application.status === 'Verified' ? 'success' : 'warning'} 
            variant="outlined" 
          />
        </DialogTitle>
        
        <Divider />
        
        <DialogContent>
          <Grid container spacing={2}>
            {/* Common Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary">Personal Information</Typography>
            </Grid>
            <Grid item xs={6}><Typography><strong>Phone:</strong> {application.phone}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Address:</strong> {application.address}</Typography></Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
            </Grid>
  
            {/* Role Specific Details */}
            <Grid item xs={12}>
               <Typography variant="subtitle1" color="primary">
                 {isFaculty ? 'Professional Details' : 'Academic History'}
               </Typography>
            </Grid>
  
            {isFaculty ? (
              <>
                <Grid item xs={6}><Typography><strong>Department:</strong> {application.department}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Designation:</strong> {application.designation}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Qualification:</strong> {application.qualification}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Experience:</strong> {application.experience} years</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Joining Date:</strong> {application.joiningDate}</Typography></Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}><Typography><strong>Institution:</strong> {application.institution}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Grade/CGPA:</strong> {application.grade}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Passing Year:</strong> {application.year}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>DOB:</strong> {application.dob}</Typography></Grid>
              </>
            )}
  
            {/* Documents Section (Mock) */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box bgcolor="#f5f5f5" p={2} borderRadius={2}>
                <Typography variant="subtitle2">Uploaded Documents</Typography>
                <Typography variant="body2" color="textSecondary">
                  {application.documents ? "📄 Resume.pdf, 📄 Certificates.pdf" : "No documents uploaded"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
  
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Close</Button>
          {application.status === 'Pending Verification' && (
            <>
              <Button 
                onClick={() => onReject(application.id)} 
                color="error" 
                variant="outlined"
              >
                Reject
              </Button>
              <Button 
                onClick={() => onApprove(application.id)} 
                color="success" 
                variant="contained"
              >
                Approve Application
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ApplicationDetailDialog;