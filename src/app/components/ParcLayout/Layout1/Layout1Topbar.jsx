import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Hidden,
  IconButton,
  MenuItem,
  useMediaQuery,
  Box,
  styled,
  useTheme
} from '@mui/material';

import { ParcMenu, ParcSearchBox } from 'app/components';
import { themeShadows } from 'app/components/ParcTheme/themeColors';
import { NotificationProvider } from 'app/contexts/NotificationContext';
import useAuth from 'app/hooks/useAuth'; // Import useAuth
import useSettings from 'app/hooks/useSettings';
import { topBarHeight } from 'app/utils/constant';

import NotificationBar from '../../NotificationBar/NotificationBar';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const TopbarRoot = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: 'all 0.3s ease',
  boxShadow: themeShadows[8],
  height: topBarHeight
}));

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: '8px',
  paddingLeft: 18,
  paddingRight: 20,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 16,
    paddingRight: 16
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: 14,
    paddingRight: 16
  }
}));

const UserMenu = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: 24,
  padding: 4,
  '& span': { margin: '0 8px' }
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 185,
  '& a': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  },
  '& span': { marginRight: '10px', color: theme.palette.text.primary }
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth(); // Get logout function and user
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: {
        leftSidebar: {
          ...settings.layout1Settings.leftSidebar,
          ...sidebarSettings
        }
      }
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === 'close' ? 'mobile' : 'close';
    } else {
      mode = layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full';
    }
    updateSidebarMode({ mode });
  };

  // LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await logout(); // Clears local storage and auth state
      navigate('/session/signin'); // Force redirect to signin
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <span className="material-icons">menu</span>
          </StyledIconButton>

          <Hidden mdDown>
            <StyledIconButton>
              <span className="material-icons">mail_outline</span>
            </StyledIconButton>
            <StyledIconButton>
              <span className="material-icons">web_asset</span>
            </StyledIconButton>
            <StyledIconButton>
              <span className="material-icons">star_outline</span>
            </StyledIconButton>
          </Hidden>
        </Box>

        <Box display="flex" alignItems="center">
          <ParcSearchBox />

          <NotificationProvider>
            <NotificationBar />
          </NotificationProvider>

          <ParcMenu
            menuButton={
              <UserMenu>
                  <span style={{ color: 'black' }}>
                    Hi, <strong>{user?.name || 'User'}</strong>
                  </span>
                <Avatar src={user?.avatar} sx={{ cursor: 'pointer' }} />
              </UserMenu>
            }
          >
            <StyledItem>
              <Link to="/">
                <span className="material-icons">home</span>
                <span className="pl-2">Home</span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to="/page-layouts/user-profile">
                <span className="material-icons">person</span>
                <span className="pl-2">Profile</span>
              </Link>
            </StyledItem>

            <StyledItem>
              <span className="material-icons">settings</span>
              <span className="pl-2">Settings</span>
            </StyledItem>

            {/* LOGOUT BUTTON */}
            <StyledItem onClick={handleLogout}>
              <span className="material-icons">power_settings_new</span>
              <span className="pl-2">Logout</span>
            </StyledItem>
          </ParcMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);