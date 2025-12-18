import {
  Avatar,
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  alpha,
  Divider,
  Button,
} from '@mui/material';
import {
  PersonAdd,
  DateRange,
  Email,
  AccountCircle,
  Group,
  Edit,
  Logout,
} from '@mui/icons-material';
import { useUser } from 'contexts';
import { configProvider, formatDate, translateActivityStatus } from 'utils';
import { useEffect, useState } from 'react';
import { IUser } from 'interfaces';
import { useNavigate, useParams } from 'react-router';
import { useServices } from 'hooks';
import { EditUserDataModal, LogoutModal } from 'components/modals';

export const User = () => {
  const [user, setUser] = useState<Omit<IUser, 'uuid'>>();
  const [editModal, setEditModal] = useState<boolean>(false);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const { username } = useParams();
  const { getUser } = useServices();
  const { user: loggedUser } = useUser();
  const nav = useNavigate();
  const { appRoot, defaultCover } = configProvider();

  const fetchUser = () => {
    (async () => {
      if (!username) {
        return nav(appRoot);
      }

      if (username === loggedUser?.username) {
        setUser(loggedUser);
      } else {
        const res = await getUser(username, 'full');

        if (!res.user) {
          return nav(appRoot);
        }

        setUser(res.user);
      }
    })();
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  if (!user) return;

  console.log(user);
  

  const itsMe = user.username === loggedUser?.username;
  const friends = user.friends.filter((f) => f.status === 'accepted');
  const myFriend = loggedUser?.friends.find(
    (friend) => friend.user?.id === user.id,
  );

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const handleLogout = () => {
    setLogoutModal(!logoutModal);
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 2 }}>
      {/* EditModal */}
      <EditUserDataModal open={editModal} closeModal={handleEditModal} />

      {/* LogoutModal */}
      <LogoutModal canClose onClose={handleLogout} isOpen={logoutModal} />

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
            background: ({ palette }) =>
              `linear-gradient(transparent, ${alpha(palette.background.paper, 0.9)})`,
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
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}
              >
                <DateRange sx={{ fontSize: 16 }} />
                <Typography variant='body2' color='text.secondary'>
                  Membro desde {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Edit data */}
            {itsMe && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='outlined'
                  startIcon={<Edit />}
                  size='small'
                  onClick={handleEditModal}
                >
                  Editar dados
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<Logout />}
                  size='small'
                  color='error'
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </Box>
            )}
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
                  <AccountCircle
                    sx={{ fontSize: 18, color: 'text.secondary' }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    ID: {user.id}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='body2' color='text.secondary'>
                    {friends.length} amigos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Activity Status */}
          {myFriend && !itsMe && (
            <Card elevation={2}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Chip
                  label={translateActivityStatus(myFriend.activityStatus)}
                  color={(() => {
                    switch (myFriend.activityStatus) {
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant='h6'>Amigos ({friends.length})</Typography>
                {!myFriend && !itsMe && (
                  <Button
                    variant='outlined'
                    startIcon={<PersonAdd />}
                    size='small'
                  >
                    Adicionar Amigo
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {friends.map((friend) => {
                  console.log(friend);
                  
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
                        onClick={() =>
                          nav(`${appRoot}/user/${friend.user.username}`)
                        }
                        sx={{
                          transition: 'all 0.2s',
                          minWidth: 300,
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              src={friend.user.profilePic}
                              alt={friend.user.name}
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant='subtitle2'
                                noWrap
                                sx={{ fontWeight: 'medium' }}
                              >
                                {friend.user.name}
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                noWrap
                              >
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

              {friends.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <Group sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                  <Typography variant='body1'>Nenhum amigo ainda</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
