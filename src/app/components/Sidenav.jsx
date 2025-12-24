import { Fragment } from "react";
import Scrollbar from "react-perfect-scrollbar";
import styled from "@mui/material/styles/styled";

import { ParcVerticalNav } from "app/components";
import useSettings from "app/hooks/useSettings";
import useAuth from "app/hooks/useAuth"; 

// Import the specific navigation arrays from your project
import { 
  adminNavigation, 
  studentNavigation, 
  facultyNavigation 
} from "app/navigations"; 

// STYLED COMPONENTS
const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  position: "relative",
  // FIX: This ensures the scrollbar area grows to fill the gap
  flexGrow: 1, 
  display: "flex",
  flexDirection: "column",
  overflow: "hidden" 
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  width: "100vw",
  background: "rgba(0, 0, 0, 0.54)",
  [theme.breakpoints.up("lg")]: { display: "none" }
}));

export default function Sidenav({ children }) {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth(); // Get User Role

  // --- LOGIC: Select Navigation based on Role ---
  let items = studentNavigation; // Fallback
  
  if (user?.role === 'admin') items = adminNavigation;
  else if (user?.role === 'faculty') items = facultyNavigation;
  else if (user?.role === 'student') items = studentNavigation;
  // ----------------------------------------------

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: { ...activeLayoutSettings.leftSidebar, ...sidebarSettings }
      }
    });
  };

  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        {/* Render the role-specific items */}
        <ParcVerticalNav items={items} />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
}