import { useState } from 'react';
import { 
  Box, Button, Card, Grid, Step, StepLabel, Stepper, TextField, Typography, styled 
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StudentService from '../../services/StudentService';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ContentBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: '20px'
}));

// Validation Schemas for each step
const step1Schema = Yup.object().shape({
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  dob: Yup.date().required('Date of Birth is required')
});

const step2Schema = Yup.object().shape({
  institution: Yup.string().required('Institution name is required'),
  grade: Yup.string().required('Grade/Percentage is required'),
  year: Yup.number().required('Year of passing is required')
});

// Combine schemas based on active step
const getValidationSchema = (activeStep) => {
  if (activeStep === 0) return step1Schema;
  if (activeStep === 1) return step2Schema;
  return Yup.object().shape({}); // No validation for document upload demo
};

const StudentOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Details', 'Academic History', 'Documents'];
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalSubmit = async (values) => {
    try {
      const payload = {
        userId: user.id, // Link profile to the logged-in user
        ...values,
        status: "Pending Verification",
        submittedAt: new Date()
      };
      
      await StudentService.createProfile(payload);
      alert('Application Submitted Successfully!');
      navigate('/dashboard/default'); // Redirect to dashboard
    } catch (error) {
      console.error("Submission Failed", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <ContentBox>
      <Card sx={{ maxWidth: 800, width: '100%', padding: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Student Onboarding
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Formik
          initialValues={{
            phone: '', address: '', dob: '',
            institution: '', grade: '', year: '',
            documents: '' 
          }}
          validationSchema={getValidationSchema(activeStep)}
          onSubmit={(values) => {
            if (activeStep === steps.length - 1) {
              handleFinalSubmit(values);
            } else {
              handleNext();
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: PERSONAL DETAILS */}
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Phone Number" name="phone"
                      value={values.phone} onChange={handleChange} onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Address" name="address" multiline rows={3}
                      value={values.address} onChange={handleChange} onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth type="date" label="Date of Birth" name="dob"
                      InputLabelProps={{ shrink: true }}
                      value={values.dob} onChange={handleChange} onBlur={handleBlur}
                      error={touched.dob && Boolean(errors.dob)}
                      helperText={touched.dob && errors.dob}
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 2: ACADEMIC HISTORY */}
              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Previous Institution" name="institution"
                      value={values.institution} onChange={handleChange} onBlur={handleBlur}
                      error={touched.institution && Boolean(errors.institution)}
                      helperText={touched.institution && errors.institution}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Grade / Percentage" name="grade"
                      value={values.grade} onChange={handleChange} onBlur={handleBlur}
                      error={touched.grade && Boolean(errors.grade)}
                      helperText={touched.grade && errors.grade}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Year of Passing" name="year" type="number"
                      value={values.year} onChange={handleChange} onBlur={handleBlur}
                      error={touched.year && Boolean(errors.year)}
                      helperText={touched.year && errors.year}
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 3: DOCUMENTS (MOCK) */}
              {activeStep === 2 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6">Upload ID Proof & Transcripts</Typography>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    (For this demo, just click Submit. In production, this would be a file uploader.)
                  </Typography>
                  <Button variant="outlined" component="label">
                    Upload Files
                    <input hidden accept="image/*" multiple type="file" />
                  </Button>
                </Box>
              )}

              {/* NAVIGATION BUTTONS */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" type="submit">
                  {activeStep === steps.length - 1 ? 'Submit Application' : 'Next'}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </ContentBox>
  );
};

export default StudentOnboarding;