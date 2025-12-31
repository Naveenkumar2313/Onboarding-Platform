import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from './components/Loadable';
import ParcLayout from './components/ParcLayout/ParcLayout';
import AuthGuard from './components/auth/AuthGuard';

// SESSION PAGES
const JwtLogin = Loadable(lazy(() => import('./views/sessions/JwtLogin')));
// Uncomment these if you have these files in your views/sessions folder
// const ForgotPassword = Loadable(lazy(() => import('./views/sessions/ForgotPassword')));

// DASHBOARD & ONBOARDING PAGES
const DefaultDashboard = Loadable(lazy(() => import('./views/dashboard/DefaultDashboard')));
const StudentOnboarding = Loadable(lazy(() => import('./views/onboarding/StudentOnboarding')));
const FacultyOnboarding = Loadable(lazy(() => import('./views/onboarding/FacultyOnboarding')));
const PersonalInfo = Loadable(lazy(() => import('./views/onboarding/personal_info')));

const routes = [
  // 1. STRICT ROOT REDIRECT
  // Forces the user to the Sign-In page immediately when opening the site
  { path: '/', element: <Navigate to="/session/signin" /> },

  // 2. SESSION ROUTES
  { path: '/session/signin', element: <JwtLogin /> },
  // { path: '/session/forgot-password', element: <ForgotPassword /> },

  // 3. PROTECTED ROUTES (Wrapped in AuthGuard)
  // These are only accessible if the user is logged in
  {
    element: (
      <AuthGuard>
        <ParcLayout />
      </AuthGuard>
    ),
    children: [
      { path: '/dashboard/default', element: <DefaultDashboard /> },
      { path: '/onboarding/student', element: <StudentOnboarding /> },
      { path: '/onboarding/faculty', element: <FacultyOnboarding /> },
      { path: '/onboarding/personal_info', element: <PersonalInfo />}
    ]
  },

  // 4. CATCH-ALL (404)
  // Redirects any unknown path back to sign-in
  { path: '*', element: <Navigate to="/session/signin" /> }
];

export default routes;