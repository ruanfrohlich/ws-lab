import { Avatar, Box, Typography, Paper, Chip, Grid, Card, CardContent, alpha, Divider, Button } from '@mui/material';
import { PersonAdd, DateRange, Email, AccountCircle, Group } from '@mui/icons-material';
import { useUser } from 'contexts';
import { formatDate, translateActivityStatus } from 'utils';
import { useEffect, useState } from 'react';
import { IUser } from 'interfaces';
import { useParams } from 'react-router';
import { useServices } from 'hooks';

export const User = () => {
  const [user, setUser] = useState<Omit<IUser, 'uuid'>>();
  const { username } = useParams();
  const { getUser } = useServices();
  const { user: loggedUser } = useUser();
  const defaultCover = new URL('url:../assets/images/generic-cover.jpeg?as=webp', import.meta.url);

  const fetchUser = () => {
    (async () => {
      if (!username) return;

      const res = await getUser(username, 'full');

      setUser(res.user);
    })();
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  if (!user) return;

  const friend = loggedUser?.friends.find((friend) => friend.user?.id === user.id);

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 2 }}>
      {/* Cover Image and Profile Section */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 3,
        }}
      >
        {/* Cover Image */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 200, md: 300 },
            backgroundImage: `url(${user.coverImage !== '' ? user.coverImage : defaultCover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Profile Info Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: ({ palette }) => `linear-gradient(transparent, ${alpha(palette.background.paper, 0.9)})`,
            padding: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'end', gap: 3 }}>
            {/* Profile Picture */}
            <Avatar
              src={user.profilePic}
              alt={user.name}
              sx={{
                width: { xs: 80, md: 120 },
                height: { xs: 80, md: 120 },
                border: '4px solid',
                borderColor: 'background.paper',
                boxShadow: 3,
              }}
            />

            {/* User Info */}
            <Box sx={{ flex: 1, mb: 1 }}>
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: ({ palette }) => alpha(palette.text.primary, 0.8),
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                @{user.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <DateRange sx={{ fontSize: 16 }} />
                <Typography variant='body2' color='text.secondary'>
                  Membro desde {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - User Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Informações
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='body2' color='text.secondary'>
                    {user.email}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountCircle sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='body2' color='text.secondary'>
                    ID: {user.id}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='body2' color='text.secondary'>
                    {user.friends.length} amigos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Activity Status */}
          {friend && (
            <Card elevation={2}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Chip
                  label={translateActivityStatus(friend.activityStatus)}
                  color={(() => {
                    switch (friend.activityStatus) {
                      case 'online': {
                        return 'success';
                      }
                      case 'away': {
                        return 'warning';
                      }
                      case 'busy': {
                        return 'error';
                      }
                    }
                  })()}
                  size='small'
                  sx={{ fontWeight: 'medium' }}
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Friends List */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6'>
                  Amigos ({user.friends.filter((f) => f.status === 'accepted').length})
                </Typography>
                {!friend && (
                  <Button variant='outlined' startIcon={<PersonAdd />} size='small'>
                    Adicionar Amigo
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {user.friends
                  .filter((friend) => friend.status === 'accepted')
                  .map((friend) => {
                    const getStatusColor = () => {
                      switch (friend.activityStatus) {
                        case 'away':
                          return 'warning';
                        case 'busy':
                          return 'error';
                        case 'online':
                          return 'success';
                        default:
                          return 'default';
                      }
                    };

                    return (
                      <Grid item xs={12} sm={6} md={4} key={friend.id}>
                        <Card
                          variant='outlined'
                          sx={{
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: 2,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                src={friend.user.profilePic}
                                alt={friend.user.name}
                                sx={{ width: 40, height: 40 }}
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant='subtitle2' noWrap sx={{ fontWeight: 'medium' }}>
                                  {friend.user.name}
                                </Typography>
                                <Typography variant='caption' color='text.secondary' noWrap>
                                  @{friend.user.username}
                                </Typography>
                              </Box>
                              <Chip
                                label={friend.activityStatus}
                                color={getStatusColor()}
                                size='small'
                                sx={{
                                  fontSize: '0.6rem',
                                  height: 20,
                                  textTransform: 'capitalize',
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>

              {user.friends.filter((f) => f.status === 'accepted').length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <Group sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                  <Typography variant='body1'>Nenhum amigo ainda</Typography>
                  <Typography variant='body2'>Comece adicionando alguns amigos para ver sua rede!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
