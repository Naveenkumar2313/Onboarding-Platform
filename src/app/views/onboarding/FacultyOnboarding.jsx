import { useState } from 'react';
import { 
  Box, Button, Card, Grid, Step, StepLabel, Stepper, TextField, MenuItem, Typography, styled 
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FacultyService from '../../services/FacultyService';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ContentBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: '20px'
}));

// --- VALIDATION SCHEMAS ---
const step1Schema = Yup.object().shape({
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  joiningDate: Yup.date().required('Expected Joining Date is required')
});

const step2Schema = Yup.object().shape({
  department: Yup.string().required('Department is required'),
  designation: Yup.string().required('Designation is required'),
  qualification: Yup.string().required('Highest Qualification is required')
});

const getValidationSchema = (activeStep) => {
  if (activeStep === 0) return step1Schema;
  if (activeStep === 1) return step2Schema;
  return Yup.object().shape({});
};

const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'MBA', 'Science & Humanities'];
const designations = ['Assistant Professor', 'Associate Professor', 'Professor', 'Lab Assistant'];

const FacultyOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Info', 'Professional Details', 'Documents'];
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalSubmit = async (values) => {
    try {
      const payload = {
        userId: user.id,
        userRole: 'faculty', // Explicitly tag as faculty data
        ...values,
        status: "Pending Verification",
        submittedAt: new Date()
      };
      
      await FacultyService.createProfile(payload);
      alert('Faculty Profile Submitted Successfully!');
      navigate('/dashboard/default');
    } catch (error) {
      console.error("Submission Failed", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <ContentBox>
      <Card sx={{ maxWidth: 800, width: '100%', padding: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, textAlign: 'center', color: '#1976d2' }}>
          Faculty Onboarding
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
          Please complete your employment profile
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
            phone: '', address: '', joiningDate: '',
            department: '', designation: '', qualification: '', experience: '',
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
              
              {/* STEP 1: PERSONAL INFO */}
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
                      fullWidth label="Residential Address" name="address" multiline rows={3}
                      value={values.address} onChange={handleChange} onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth type="date" label="Expected Joining Date" name="joiningDate"
                      InputLabelProps={{ shrink: true }}
                      value={values.joiningDate} onChange={handleChange} onBlur={handleBlur}
                      error={touched.joiningDate && Boolean(errors.joiningDate)}
                      helperText={touched.joiningDate && errors.joiningDate}
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 2: PROFESSIONAL DETAILS */}
              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      select fullWidth label="Department" name="department"
                      value={values.department} onChange={handleChange} onBlur={handleBlur}
                      error={touched.department && Boolean(errors.department)}
                      helperText={touched.department && errors.department}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select fullWidth label="Designation" name="designation"
                      value={values.designation} onChange={handleChange} onBlur={handleBlur}
                      error={touched.designation && Boolean(errors.designation)}
                      helperText={touched.designation && errors.designation}
                    >
                      {designations.map((des) => (
                        <MenuItem key={des} value={des}>{des}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Highest Qualification (PhD/M.Tech/MBA)" name="qualification"
                      value={values.qualification} onChange={handleChange} onBlur={handleBlur}
                      error={touched.qualification && Boolean(errors.qualification)}
                      helperText={touched.qualification && errors.qualification}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Years of Experience" name="experience" type="number"
                      value={values.experience} onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 3: DOCUMENTS */}
              {activeStep === 2 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6">Upload Resume & Certificates</Typography>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    Please upload your CV and highest degree certificate.
                  </Typography>
                  <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                    Choose Files
                    <input hidden accept=".pdf,.doc,.docx" multiple type="file" />
                  </Button>
                </Box>
              )}

              {/* BUTTONS */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" type="submit">
                  {activeStep === steps.length - 1 ? 'Submit Profile' : 'Next'}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </ContentBox>
  );
};

export default FacultyOnboarding;