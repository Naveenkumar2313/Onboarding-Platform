import { useTheme, Box, styled } from '@mui/material';
import Sidenav from '../../Sidenav';
import Brand from '../../Brand';
import useSettings from '../../../hooks/useSettings';
import useAuth from '../../../hooks/useAuth'; 
import { adminNavigation, studentNavigation, facultyNavigation } from '../../../navigations';
import { convertHexToRGB } from '../../../utils/utils';

// STYLED COMPONENTS
const SidebarNavRoot = styled(Box)(({ theme, width, primaryBg, bgImgURL }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: width,
  boxShadow: theme.shadows[8],
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top',
  backgroundSize: 'cover',
  zIndex: 111,
  overflow: 'hidden',
  color: theme.palette.text.primary,
  transition: 'all 250ms ease-in-out',
  backgroundImage: `linear-gradient(to bottom, rgba(${primaryBg}, 0.96), rgba(${primaryBg}, 0.96)), url(${bgImgURL})`,
  '&:hover': {
    width: 'var(--sidenav-width)',
    '& .sidenavHoverShow': { display: 'block' },
    '& .compactNavItem': {
      width: '100%',
      maxWidth: '100%',
      '& .nav-bullet': { display: 'block' },
      '& .nav-bullet-text': { display: 'none' }
    }
  }
}));

const NavListBox = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const Layout1Sidenav = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth(); // Get the logged-in user

  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode, bgImgURL } = leftSidebar;

  const getSidenavWidth = () => {
    switch (mode) {
      case 'compact':
        return 'var(--sidenav-compact-width)';
      default:
        return 'var(--sidenav-width)';
    }
  };

  const getPrimaryBg = () => {
    if (settings.themes[settings.activeTheme].type === 'dark') {
      return convertHexToRGB(theme.palette.background.default);
    }
    return convertHexToRGB(theme.palette.primary.main);
  };

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } }
    });
  };

  // --- LOGIC: SELECT NAVIGATION BASED ON ROLE ---
  let navigationData = [];
  if (user?.role === 'admin') {
    navigationData = adminNavigation;
  } else if (user?.role === 'student') {
    navigationData = studentNavigation;
  } else if (user?.role === 'faculty') {
    navigationData = facultyNavigation;
  }
  // ----------------------------------------------

  return (
    <SidebarNavRoot
      image={bgImgURL}
      bg={mode}
      width={getSidenavWidth()}
      primaryBg={getPrimaryBg()}
    >
      <NavListBox>
        <Brand />
        <Sidenav items={navigationData} />
      </NavListBox>
    </SidebarNavRoot>
  );
};

export default Layout1Sidenav;