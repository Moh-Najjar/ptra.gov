import { useEffect, useState, type MouseEvent } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';
import { NAV_ITEMS, UTILITY_LINKS } from '../../../constants/navigation';
import { SOCIAL_LINKS } from '../../../constants/socialLinks';
import type { NavItem, UtilityLink } from '../../../types/navigation';
import { alpha, type Theme } from '@mui/material/styles';
import { rem } from '../../../theme/rem';

const UTILITY_ICONS: Record<UtilityLink['path'], typeof HelpOutlineOutlinedIcon> = {
  [ROUTES.FAQ]: HelpOutlineOutlinedIcon,
  [ROUTES.ABOUT]: InfoOutlinedIcon,
  [ROUTES.CONTACT]: MailOutlineOutlinedIcon,
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
  fontSize: { md: rem(13), lg: rem(14) },
  minWidth: 0,
  px: { md: 1, lg: 1.5 },
  py: 0.75,
  whiteSpace: 'nowrap',
  borderRadius: 1.5,
  border: '0.0625rem solid',
  borderColor: isActive || isOpen ? 'primary.light' : 'transparent',
  bgcolor: isOpen ? alpha(theme.palette.utilityBar.main, 0.4) : 'transparent',
  transition: 'all 0.2s ease',
  '& .MuiButton-endIcon': {
    marginInlineStart: rem(2),
    marginInlineEnd: 0,
  },
  '&:hover': {
    bgcolor: alpha(theme.palette.utilityBar.main, 0.2),
    borderColor: 'primary.light',
    color: 'primary.main',
  },
});

const getMenuPaperSx = (isDarkMode: boolean) => ({
  mt: 1.25,
  borderRadius: 2.5,
  border: '0.0625rem solid',
  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(27, 117, 188, 0.2)',
  boxShadow: isDarkMode
    ? '0 0.75rem 2rem rgba(0, 0, 0, 0.35)'
    : '0 0.75rem 2rem rgba(27, 117, 188, 0.14)',
  minWidth: rem(240),
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
    borderInlineStart: '0.1875rem solid',
    borderColor: 'primary.main',
    '&:hover': {
      bgcolor: alpha(theme.palette.utilityBar.main, 0.2),
    },
  },
});

const drawerItemSx = {
  borderRadius: 2,
  py: 1,
  '&.Mui-selected': {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.12),
    color: 'primary.main',
    fontWeight: 700,
  },
} as const;

const getActiveGroupPaths = (pathname: string): string[] =>
  NAV_ITEMS.filter(
    (item) => item.children !== undefined && item.children.length > 0 && isNavItemActive(pathname, item),
  ).map((item) => item.path);

interface DrawerNavGroupProps {
  item: NavItem;
  pathname: string;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

/** Leaf link, or a parent row that expands its children instead of navigating. */
const DrawerNavGroup = ({ item, pathname, isExpanded, onToggle, onNavigate }: DrawerNavGroupProps) => {
  const { t } = useTranslation();
  const hasChildren = item.children !== undefined && item.children.length > 0;
  const isActive = isNavItemActive(pathname, item);

  if (!hasChildren || item.children === undefined) {
    return (
      <ListItemButton
        component={RouterLink}
        to={item.path}
        selected={isActive}
        onClick={onNavigate}
        sx={drawerItemSx}
      >
        <ListItemText
          primary={t(item.labelKey)}
          slotProps={{ primary: { sx: { fontWeight: isActive ? 700 : 600 } } }}
        />
      </ListItemButton>
    );
  }

  return (
    <Box sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={onToggle}
        selected={isActive}
        aria-expanded={isExpanded}
        sx={drawerItemSx}
      >
        <ListItemText
          primary={t(item.labelKey)}
          slotProps={{ primary: { sx: { fontWeight: 700 } } }}
        />
        <ExpandMoreIcon
          sx={{
            color: 'text.secondary',
            fontSize: rem(22),
            transition: 'transform 0.2s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List
          disablePadding
          sx={{
            mt: 0.25,
            mb: 0.5,
            marginInlineStart: 1.5,
            borderInlineStart: '0.125rem solid',
            borderColor: 'divider',
            py: 0.25,
          }}
        >
          {item.children.map((child) => {
            const isChildActive = pathname === child.path;

            return (
              <ListItemButton
                key={child.path}
                component={RouterLink}
                to={child.path}
                selected={isChildActive}
                onClick={onNavigate}
                sx={{
                  ...drawerItemSx,
                  py: 0.7,
                  marginInlineStart: 1,
                }}
              >
                <ListItemText
                  primary={t(child.labelKey)}
                  slotProps={{ primary: { sx: { fontSize: '0.875rem' } } }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

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

/** Compact hamburger + full-height sheet used only below the md breakpoint. */
export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<string[]>(() =>
    getActiveGroupPaths(location.pathname),
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleGroup = (path: string) => {
    setExpandedPaths((current) =>
      current.includes(path) ? current.filter((itemPath) => itemPath !== path) : [...current, path],
    );
  };

  // Keep the active category open so the current page is visible when the sheet appears.
  useEffect(() => {
    if (!open) {
      return;
    }

    const activeGroupPaths = getActiveGroupPaths(location.pathname);
    setExpandedPaths((current) => {
      const nextPaths = new Set(current);
      for (const path of activeGroupPaths) {
        nextPaths.add(path);
      }
      return [...nextPaths];
    });
  }, [location.pathname, open]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label={t('common.menu')}
        sx={{
          width: rem(40),
          height: rem(40),
          color: 'text.primary',
        }}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        // Always "left": stylis-plugin-rtl flips it, so Arabic opens from the physical right.
        anchor="left"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        disableDiscovery
        slotProps={{
          paper: {
            sx: {
              width: `min(86vw, ${rem(320)})`,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              borderStartEndRadius: rem(20),
              borderEndEndRadius: rem(20),
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 0 2.5rem rgba(0, 0, 0, 0.45)'
                  : '0 0 2.5rem rgba(27, 117, 188, 0.16)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.75,
            borderBottom: '0.0625rem solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t('common.menu')}
          </Typography>
          <IconButton
            onClick={handleClose}
            aria-label={t('common.close')}
            size="small"
            sx={{
              color: 'text.secondary',
              bgcolor: (theme) => alpha(theme.palette.text.primary, 0.06),
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          role="navigation"
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 1.5,
            py: 1.5,
          }}
        >
          <List disablePadding>
            {NAV_ITEMS.map((item) => (
              <DrawerNavGroup
                key={item.path}
                item={item}
                pathname={location.pathname}
                isExpanded={expandedPaths.includes(item.path)}
                onToggle={() => handleToggleGroup(item.path)}
                onNavigate={handleClose}
              />
            ))}
          </List>

          <Divider sx={{ my: 1.75 }} />

          <Typography
            variant="caption"
            sx={{
              px: 1.25,
              mb: 0.75,
              display: 'block',
              fontWeight: 700,
              letterSpacing: rem(0.3),
              color: 'text.secondary',
            }}
          >
            {t('utility.quickLinks')}
          </Typography>
          <List disablePadding>
            {UTILITY_LINKS.map((link) => {
              const UtilityIcon = UTILITY_ICONS[link.path] ?? InfoOutlinedIcon;

              return (
                <ListItemButton
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  selected={location.pathname === link.path}
                  onClick={handleClose}
                  sx={drawerItemSx}
                >
                  <ListItemIcon sx={{ minWidth: rem(36), color: 'primary.main' }}>
                    <UtilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t(link.labelKey)} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.75,
            borderTop: '0.0625rem solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Typography
            variant="caption"
            sx={{ mb: 0.75, display: 'block', fontWeight: 700, color: 'text.secondary' }}
          >
            {t('utility.followUs')}
          </Typography>
          <Stack direction="row" spacing={0.75}>
            {SOCIAL_LINKS.map((socialLink) => (
              <IconButton
                key={socialLink.id}
                size="small"
                aria-label={socialLink.label}
                component="a"
                href={socialLink.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  bgcolor: (muiTheme) => alpha(muiTheme.palette.primary.main, 0.1),
                }}
              >
                <socialLink.Icon fontSize="small" />
              </IconButton>
            ))}
          </Stack>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export const NavMenu = () => (
  <Stack
    direction="row"
    spacing={{ md: 0.25, lg: 0.5 }}
    sx={{
      display: { xs: 'none', md: 'flex' },
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}
  >
    {NAV_ITEMS.map((item) => (
      <NavDropdown key={item.path} item={item} />
    ))}
  </Stack>
);
