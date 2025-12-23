import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./components/Loadable"; // Ensure you have this or use React.Suspense
import ParcLayout from "./components/ParcLayout/ParcLayout";
import AuthGuard from "./components/auth/AuthGuard"; // We'll add this next for security

// LAZY LOAD COMPONENTS
const JwtLogin = Loadable(lazy(() => import("./views/sessions/JwtLogin")));
const DefaultDashboard = Loadable(lazy(() => import("./views/dashboard/DefaultDashboard")));

// Placeholder for Onboarding (We will build these next)
const StudentOnboarding = () => <h1>Student Onboarding Form</h1>;
const FacultyOnboarding = () => <h1>Faculty Onboarding Form</h1>;

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },
  
  // SESSION ROUTES (Public)
  { path: "/session/signin", element: <JwtLogin /> },
  
  // PROTECTED ROUTES
  {
    element: (
       // AuthGuard ensures only logged-in users can see this
      // <AuthGuard> 
        <ParcLayout />
      // </AuthGuard>
    ),
    children: [
      { path: "/dashboard/default", element: <DefaultDashboard /> },
      
      // ONBOARDING ROUTES
      { path: "/onboarding/student", element: <StudentOnboarding /> },
      { path: "/onboarding/faculty", element: <FacultyOnboarding /> },
    ]
  },
  
  // Catch-all
  { path: "*", element: <Navigate to="/session/signin" /> }
];

export default routes;