import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import { baseURL } from '../../config.js';

const theme = createTheme();

function UpdateGroup() {
  // Obtém a função de logout do hook useAuth
  const { logout } = useAuth();
  // Obtém o parâmetro id da URL usando useParams
  const { id } = useParams();
  // Obtém a função de navegação do hook useNavigate
  const navigate = useNavigate();

  // Estado para armazenar os dados do grupo
  const [group, setGroup] = useState({
    name: '',
    active: false,
  });

  // Estado para controlar a exibição do diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  // Obtém o token do usuário do localStorage
  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Hook useEffect para buscar os dados do grupo quando o componente é montado
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        // Faz uma requisição GET para obter os dados do grupo
        const response = await axios.get(`${baseURL}/group/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const groupData = response.data[0];

        setGroup({
          name: groupData.GroupName,
          active: Boolean(groupData.Active),
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
          const errorMessage = error.response?.data?.error || "Erro ao carregar grupo.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    };

    fetchGroup();
  }, [id, token]);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setGroup({ ...group, [name]: type === 'checkbox' ? checked : value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = [];

      const testName = validator.allValidator(group.name, 2, 15);
      const testActive = validator.booleanValidator(group.active);

      if (testName !== true) {
        errors.push(testName);
      }
      if (testActive !== true) {
        errors.push(testActive);
      }

      if (errors.length > 0) {
        setDialogStatus('error');
        setDialogMessage(errors.join('\n'));
        return;
      }

      await axios.put(`${baseURL}/group/${id}`, { ...group }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Define o status e mensagem do diálogo para sucesso
      setDialogStatus('success');
      setDialogMessage("Grupo atualizado com sucesso");
      setDialogOpen(true);
    } catch (error) {
      console.log(error);
      // Se o erro for uma resposta 401 (não autorizado), mostra mensagem e redireciona para login
      if (error.response && error.response.status === 401) {
        const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
        setTimeout(() => {
          logout();
        }, 4000);
      } else {
        // Define a mensagem de erro do diálogo com base na resposta da API ou uma mensagem padrão
        const errorMessage = error.response?.data?.errors || "Erro ao atualizar grupo.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }

    }
  };

  // Função para navegar de volta à página de busca de grupo
  const handleVoltar = () => {
    navigate("/searchgroup");
  };

  // Função para fechar o diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container">
        <CssBaseline />
        <Box className="box-manager-user">
          <Avatar className='avatar'>
            <AccountTreeIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atualizar Grupo
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
              value={group.name || ''}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={group.active}
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

export default UpdateGroup;
