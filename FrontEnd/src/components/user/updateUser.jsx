import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { baseURL } from '../../config.js';

const theme = createTheme();

function UpdateUser() {
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    active: false,
    profile: ''
  });
  const [profiles, setProfiles] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = response.data[0];
        setUser({
          name: userData.UserName,
          email: userData.UserEmail,
          active: Boolean(userData.Active),
          profile: userData.IdProfile || ''
        });
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
          setTimeout(() => {
            logout();
          }, 4000);
        } else {
          const errorMessage = error.response?.data?.error || "Erro ao carregar usuário";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfiles(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
          setTimeout(() => {
            logout();
          }, 4000);
        }
        console.error("Error fetching profiles", error);
      }
    };

    fetchUser();
    fetchProfiles();
  }, [id, token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = [];

      const testName = validator.allValidator(user.name, 2, 15);
      const testEmail = validator.emailValidator(user.email);
      const testActive = validator.booleanValidator(user.active);

      if (testName !== true) {
        errors.push(testName);
      }
      if (testEmail !== true) {
        errors.push(testEmail);
      }
      if (testActive !== true) {
        errors.push(testActive);
      }

      if (errors.length > 0) {
        setDialogStatus('error');
        setDialogMessage(errors.join('\n'));
        return;
      }

      await axios.put(`${baseURL}/user/${id}`, { ...user }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDialogStatus('success');
      setDialogMessage("Usuário atualizado com sucesso");
      setDialogOpen(true);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
        setTimeout(() => {
          logout();
        }, 4000);
      } else {
        const errorMessage = error.response?.data?.errors || "Erro ao atualizar usuário.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  const handleVoltar = () => {
    navigate("/searchuser");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container">
        <CssBaseline />
        <Box className="box-manager-user">
          <Avatar className='avatar'>
            <AccountCircleIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atualizar Usuário
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome"
              name="name"
              autoComplete="nome"
              autoFocus
              value={user.name || ''}
              onChange={handleChange}
              InputLabelProps={{
                sx: {
                  color: '#0303037e',
                  '&.Mui-focused': {
                    color: '#030303',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0303037e',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0303037e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#030303af',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              value={user.email || ''}
              onChange={handleChange}
              InputLabelProps={{
                sx: {
                  color: '#0303037e',
                  '&.Mui-focused': {
                    color: '#030303',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0303037e',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0303037e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#030303af',
                  },
                },
              }}
            />
            <Select
              name="IdProfile" // Atualiza o nome da propriedade no Select
              value={user.profile || ''}
              onChange={handleChange}
              fullWidth
              color="success"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Selecione um perfil</em>;
                }
                return profiles.find(profile => profile.IdProfile === selected)?.UserProfile || '';
              }}
              sx={{ mt: '10px' }}
            >
              <MenuItem value="">
                <em>Selecione um perfil</em>
              </MenuItem>
              {profiles.map((profile) => (
                <MenuItem key={profile.IdProfile} value={profile.IdProfile}>
                  {profile.UserProfile}
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  checked={user.active}
                  onChange={handleChange}
                  name="active"
                  sx={{
                    '&.Mui-checked': {
                      color: '#45a049',
                    },
                  }}
                />
              }
              label="Ativo"
            />
            <Box className="box-manager-button">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className='primary-button'
              >
                Atualizar
              </Button>
              <Button
                fullWidth
                variant="contained"
                className='primary-button'
                onClick={handleVoltar}
              >
                Voltar
              </Button>
            </Box>
          </Box>
        </Box>
        <DialogMessage
          open={dialogOpen}
          onClose={handleCloseDialog}
          status={dialogStatus}
          message={dialogMessage}
        />
      </Container>
    </ThemeProvider>
  );
}

export default UpdateUser;
