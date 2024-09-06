import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './login/authContext';
import { Box, Typography, IconButton, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HandymanIcon from '@mui/icons-material/Handyman';
import '../styles/index.css'

const theme = createTheme();

export default function Navbar() {
  const { user, logout } = useAuth(); // Obtém o usuário e a função de logout do contexto de autenticação

  // Função para obter o nome do usuário do localStorage
  const getUserNameFromLocalStorage = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      return userObj.name;
    }
    return '';
  };

  const userName = getUserNameFromLocalStorage(); // Obtém o nome do usuário

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className='navbar'>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            width: '27%',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#FFF',
              textDecoration: 'none',
            }}
          >
            LavaQPassa Brechó
          </Link>
        </Typography>
        {user && (
          <Box className="navbar-box">
            <Typography sx={{ color: '#fff', mr: 3 }}>
              Olá, {userName}.
            </Typography>
            <IconButton component={Link} to="/manager" sx={{ color: '#fff', marginRight: '5px' }}>
              <HandymanIcon fontSize="large" />
            </IconButton>
            <button className='secundary-button' onClick={logout}>
              Sair
            </button>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
