import { Avatar, Box, Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const OperationPage = () => {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {t('operation.title')}
        </Typography>

        {user && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Avatar src={user.image} alt={user.username} sx={{ width: 64, height: 64 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`@${user.username}`}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Typography variant="body1" color="text.secondary">
          {t('operation.description')}
        </Typography>

        <Box>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {t('auth.logout')}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};
