import { useMemo, useState, type MouseEvent } from 'react';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';
import { AUTHENTICATED_MENU_ROUTES } from '../../../constants/authenticatedMenuRoutes';
import { useAuth } from '../../../hooks/useAuth';
import { getAccessibleRoutes, getUserDisplayName, getUserInitials } from '../../../utils/roles';
import type { RoleRouteItem } from '../../../types/roles';

const ROUTE_ICONS: Partial<Record<RoleRouteItem['path'], typeof ArticleOutlinedIcon>> = {
  [ROUTES.POST]: ArticleOutlinedIcon,
  [ROUTES.PAGES]: DescriptionOutlinedIcon,
};

export const UserMenu = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isOpen = Boolean(anchorEl);
  const isRtl = theme.direction === 'rtl';
  const accessibleRoutes = useMemo(() => getAccessibleRoutes(user), [user]);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logoutMutation.mutateAsync();
    navigate(ROUTES.HOME);
  };

  if (!user) {
    return null;
  }

  const displayName = getUserDisplayName(user);
  const userInitials = getUserInitials(user);

  return (
    <>
      <IconButton
        type="button"
        onClick={handleOpen}
        aria-label={displayName}
        aria-controls={isOpen ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        disabled={logoutMutation.isPending}
        sx={{
          p: 0.25,
          flexShrink: 0,
        }}
      >
        <Avatar
          alt={user.username}
          sx={{
            width: 44,
            height: 44,
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: 'primary.main',
            fontWeight: 700,
          }}
        >
          {userInitials}
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isRtl ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isRtl ? 'left' : 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 280,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(27, 117, 188, 0.18)',
            },
          },
          list: {
            sx: { p: 0 },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.75,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            alt={user.username}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid',
              borderColor: alpha('#FFFFFF', 0.6),
              bgcolor: alpha('#FFFFFF', 0.15),
              fontWeight: 700,
            }}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }} noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ py: 0.5 }}>
          {AUTHENTICATED_MENU_ROUTES.map((route) => (
            <MenuItem
              key={route.path}
              component={RouterLink}
              to={route.path}
              onClick={handleClose}
              sx={{
                py: 1.25,
                px: 2,
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                <PersonOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t(route.labelKey)} />
            </MenuItem>
          ))}

          {accessibleRoutes.map((route) => {
            const RouteIcon = ROUTE_ICONS[route.path] ?? ArticleOutlinedIcon;

            return (
              <MenuItem
                key={route.path}
                component={RouterLink}
                to={route.path}
                onClick={handleClose}
                sx={{
                  py: 1.25,
                  px: 2,
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                  <RouteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t(route.labelKey)} />
              </MenuItem>
            );
          })}
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            void handleLogout();
          }}
          disabled={logoutMutation.isPending}
          sx={{
            py: 1.25,
            px: 2,
            color: 'error.main',
            bgcolor: (muiTheme) => alpha(muiTheme.palette.action.hover, 0.04),
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('auth.logout')} />
        </MenuItem>
      </Menu>
    </>
  );
};
