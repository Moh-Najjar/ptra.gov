import { useMemo, useState, type MouseEvent } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';
import { NAV_ITEMS } from '../../../constants/navigation';
import { useAuth } from '../../../hooks/useAuth';
import type { NavItem } from '../../../types/navigation';
import { alpha, type Theme } from '@mui/material/styles';

const OPERATION_NAV_ITEM: NavItem = {
  labelKey: 'nav.operation',
  path: ROUTES.OPERATION,
};

const isNavItemActive = (pathname: string, item: NavItem): boolean => {
  if (item.path === ROUTES.HOME) {
    return pathname === ROUTES.HOME;
  }

  if (item.children && item.children.length > 0) {
    const isChildActive = item.children.some(
      (child) => pathname === child.path || pathname.startsWith(`${child.path}/`),
    );
    if (isChildActive) {
      return true;
    }
  }

  return pathname === item.path || pathname.startsWith(`${item.path}/`);
};

const getNavButtonSx = (isActive: boolean, isOpen: boolean, theme: Theme) => ({
  color: isActive || isOpen ? 'primary.main' : 'text.primary',
  fontWeight: isActive || isOpen ? 700 : 500,
  fontSize: '0.875rem',
  px: 1.5,
  py: 0.75,
  whiteSpace: 'nowrap',
  borderRadius: 1.5,
  border: '1px solid',
  borderColor: isActive || isOpen ? 'primary.light' : 'transparent',
  bgcolor: isOpen ? alpha(theme.palette.utilityBar.main, 0.4) : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: alpha(theme.palette.utilityBar.main, 0.2),
    borderColor: 'primary.light',
    color: 'primary.main',
  },
});

const getMenuPaperSx = (isDarkMode: boolean) => ({
  mt: 1.25,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(27, 117, 188, 0.2)',
  boxShadow: isDarkMode
    ? '0 12px 32px rgba(0, 0, 0, 0.35)'
    : '0 12px 32px rgba(27, 117, 188, 0.14)',
  minWidth: 240,
  overflow: 'hidden',
  bgcolor: 'background.paper',
  backgroundImage: isDarkMode
    ? 'none'
    : 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFE 100%)',
  '& .MuiList-root': {
    py: 1.25,
    px: 0.75,
  },
});

const getMenuItemSx = (theme: Theme) => ({
  py: 1.25,
  px: 2,
  mx: 0.75,
  my: 0.35,
  borderRadius: 1.5,
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'text.primary',
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: alpha(theme.palette.utilityBar.main, 0.2),
    color: 'primary.main',
  },
  '&.Mui-selected': {
    bgcolor: alpha(theme.palette.utilityBar.main, 0.2),
    color: 'primary.main',
    fontWeight: 700,
    borderInlineStart: '3px solid',
    borderColor: 'primary.main',
    '&:hover': {
      bgcolor: alpha(theme.palette.utilityBar.main, 0.2),
    },
  },
});

const NavDropdown = ({ item }: { item: NavItem }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();
  const isOpen = Boolean(anchorEl);
  const isActive = isNavItemActive(location.pathname, item);
  const isRtl = theme.direction === 'rtl';
  const isDarkMode = theme.palette.mode === 'dark';

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!item.children || item.children.length === 0) {
    return (
      <Button
        component={RouterLink}
        to={item.path}
        sx={getNavButtonSx(isActive, false, theme)}
      >
        {t(item.labelKey)}
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        }
        sx={getNavButtonSx(isActive, isOpen, theme)}
      >
        {t(item.labelKey)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isRtl ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isRtl ? 'right' : 'left',
        }}
        slotProps={{
          paper: {
            sx: getMenuPaperSx(isDarkMode),
          },
        }}
      >
        {item.children.map((child) => (
          <MenuItem
            key={child.path}
            component={RouterLink}
            to={child.path}
            onClick={handleClose}
            selected={location.pathname === child.path}
            sx={getMenuItemSx(theme)}
          >
            {t(child.labelKey)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

interface MobileNavProps {
  navItems: NavItem[];
}

const MobileNav = ({ navItems }: MobileNavProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const drawerAnchor = theme.direction === 'rtl' ? 'right' : 'left';

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleToggle} aria-label={t('common.menu')} sx={{ display: { md: 'none' } }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor={drawerAnchor} open={open} onClose={handleClose}>
        <Box sx={{ width: 300, p: 2 }} role="navigation">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            {t('common.menu')}
          </Typography>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.map((item) => (
              <Box key={item.path}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={isNavItemActive(location.pathname, item)}
                  onClick={handleClose}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'utilityBar.main',
                      color: 'primary.main',
                      fontWeight: 700,
                    },
                  }}
                >
                  <ListItemText primary={t(item.labelKey)} />
                </ListItemButton>
                {item.children && item.children.length > 0 && (
                  <Box
                    sx={{
                      ml: 1,
                      mr: 1,
                      mb: 1,
                      p: 1,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.default',
                    }}
                  >
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={RouterLink}
                        to={child.path}
                        selected={location.pathname === child.path}
                        onClick={handleClose}
                        sx={{
                          borderRadius: 1.5,
                          py: 1,
                          '&.Mui-selected': {
                            bgcolor: 'utilityBar.main',
                            color: 'primary.main',
                            fontWeight: 700,
                          },
                        }}
                      >
                        <ListItemText
                          primary={t(child.labelKey)}
                          slotProps={{ primary: { sx: { fontSize: '0.875rem' } } }}
                        />
                      </ListItemButton>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export const NavMenu = () => {
  const { isAuthenticated } = useAuth();

  const navItems = useMemo<NavItem[]>(
    () => (isAuthenticated ? [...NAV_ITEMS, OPERATION_NAV_ITEM] : NAV_ITEMS),
    [isAuthenticated],
  );

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {navItems.map((item) => (
          <NavDropdown key={item.path} item={item} />
        ))}
      </Stack>
      <MobileNav navItems={navItems} />
    </>
  );
};
