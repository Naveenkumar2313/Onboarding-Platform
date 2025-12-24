import { memo } from "react";
import { Box, styled, useTheme, Switch } from "@mui/material"; // Added Switch

import useSettings from "app/hooks/useSettings";
import Brand from "app/components/Brand"; // Required for the logo area
import Sidenav from "app/components/Sidenav";
import { themeShadows } from "app/components/ParcTheme/themeColors";
import { sidenavCompactWidth, sideNavWidth } from "app/utils/constant";
import { convertHexToRGB } from "app/utils/utils";

// STYLED COMPONENTS
const SidebarNavRoot = styled(Box)(({ theme, width, primaryBg, bgImgURL }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: width,
  boxShadow: themeShadows[8],
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top",
  backgroundSize: "cover",
  zIndex: 111,
  overflow: "hidden",
  color: theme.palette.text.primary,
  transition: "all 250ms ease-in-out",
  backgroundImage: `linear-gradient(to bottom, rgba(${primaryBg}, 0.96), rgba(${primaryBg}, 0.96)), url(${bgImgURL})`,
  "&:hover": {
    width: sideNavWidth,
    "& .sidenavHoverShow": { display: "block" },
    "& .compactNavItem": {
      width: "100%",
      maxWidth: "100%",
      "& .nav-bullet": { display: "block" },
      "& .nav-bullet-text": { display: "none" }
    }
  }
}));

const NavListBox = styled("div")(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column"
}));

const Layout1Sidenav = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode, bgImgURL } = leftSidebar;

  const getSidenavWidth = () => {
    switch (mode) {
      case "compact":
        return sidenavCompactWidth;
      default:
        return sideNavWidth;
    }
  };

  const getPrimaryBg = () => {
    if (settings.themes[settings.activeTheme].type === "dark") {
      return convertHexToRGB(theme.palette.background.default);
    }
    return convertHexToRGB(theme.palette.primary.main);
  };

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } }
    });
  };

  // RESTORED: Toggle Logic
  const handleSidenavToggle = () => {
    updateSidebarMode({ mode: mode === "compact" ? "full" : "compact" });
  };

  return (
    <SidebarNavRoot
      image={bgImgURL}
      bg={mode}
      width={getSidenavWidth()}
      primaryBg={getPrimaryBg()}
    >
      <NavListBox>
        {/* RESTORED: Brand with Toggle Switch */}
        <Brand>
          <Switch
            size="small"
            color="secondary"
            onChange={handleSidenavToggle}
            checked={leftSidebar.mode !== "full"}
            sx={{ [theme.breakpoints.down("md")]: { display: "none" } }}
          />
        </Brand>
        
        {/* Render Sidenav (Logic handled inside Sidenav.jsx) */}
        <Sidenav />
      </NavListBox>
    </SidebarNavRoot>
  );
};

export default memo(Layout1Sidenav);