import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField, Box, styled, useTheme, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth'; // We need to create this hook helper next

// STYLED COMPONENTS (For that clean ERP look)
const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)'
}));

// FORM VALIDATION SCHEMA
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Access our AuthContext

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // 1. Attempt Login
      await login(values.email, values.password);
      
      // 2. We will handle the "Smart Redirection" in the useEffect of the AuthContext
      // But we can also force it here for immediate feedback:
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (user.role === 'admin') navigate('/dashboard/default');
      else if (user.role === 'student') navigate('/onboarding/student');
      else if (user.role === 'faculty') navigate('/onboarding/faculty');
      
    } catch (e) {
      alert(e.message); // Simple error handling for now
      setLoading(false);
    }
  };

  return (
    <JustifyBox sx={{ minHeight: '100vh', background: '#1A2038' }}>
      <Card sx={{ maxWidth: 800, margin: '1rem', display: 'flex', borderRadius: 3 }}>
        <Grid container>
          {/* LEFT SIDE: IMAGE */}
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320, background: '#1976d2' }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
              {/* Note: Ensure you have an image here, or remove the img tag */}
            </JustifyBox>
          </Grid>

          {/* RIGHT SIDE: FORM */}
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Welcome Back
              </Typography>
              
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={{ email: 'faculty@test.edu', password: '123' }}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between" mb={2}>
                      <FlexBox gap={1}>
                        <Checkbox size="small" sx={{ p: 0 }} />
                        <Typography variant="body2">Remember me</Typography>
                      </FlexBox>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2, width: "100%" }}
                    >
                      Login
                    </LoadingButton>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JustifyBox>
  );
};

export default JwtLogin;