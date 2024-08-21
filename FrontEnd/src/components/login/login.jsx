// src/pages/Login.js
import { useState } from 'react';
import { useAuth } from '../login/authContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Link, InputAdornment, Avatar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DialogMessage from '../../../utils/dialogMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Credênciais inválidas. Verifique e tente novamente.";
      setDialogStatus('error');
      setDialogMessage(errorMessage);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box className='box'>
      <Paper elevation={3} style={{ padding: '40px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Avatar className='avatar'>
            <LockOutlinedIcon className='avatar' />
          </Avatar>
          <Typography variant="h4" gutterBottom align="center">
            Login
          </Typography>
        </Box>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: "column", alignItems: 'center' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: {
                color: '#0303037e', // Cor padrão do label
                '&.Mui-focused': {
                  color: '#030303', // Cor do label quando em foco
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0303037e', // Cor da borda
                },
                '&:hover fieldset': {
                  borderColor: '#0303037e', // Cor da borda ao passar o mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#030303af', // Cor da borda quando em foco
                },
              },
            }}
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: {
                color: '#0303037e', // Cor padrão do label
                '&.Mui-focused': {
                  color: '#030303', // Cor do label quando em foco
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0303037e', // Cor da borda
                },
                '&:hover fieldset': {
                  borderColor: '#0303037e', // Cor da borda ao passar o mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#030303af', // Cor da borda quando em foco
                },
              },
            }}
          />
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Link href="" variant="body2">
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className='primary-button'
            style={{ width: '50%' }}
          >
            Entrar
          </Button>
        </form>
      </Paper>
      <DialogMessage
        open={dialogOpen}
        onClose={handleCloseDialog}
        status={dialogStatus}
        message={dialogMessage}
      />
    </Box>
  );
};

export default Login;
