import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  FormControlLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DialogMessage from '../../../utils/dialogMessage';

const theme = createTheme();

function UserSearch() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Função para buscar todos os usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setFilteredUsers(response.data.filter(user => user.Active || !showActiveOnly));
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        logout();
      }
      setUsers([]);
      setFilteredUsers([]);
      const errorMessage = error.response?.data?.error || "Erro ao carregar usuários.";
      setDialogStatus('error');
      setDialogMessage(errorMessage);
      setDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]); // Dependência para atualizar quando token mudar

  useEffect(() => {
    // Filtra os usuários de acordo com o estado do checkbox
    setFilteredUsers(users.filter(user => user.Active || !showActiveOnly));
  }, [showActiveOnly, users]); // Dependências para atualizar quando showActiveOnly ou users mudar

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setShowActiveOnly(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      // Se o campo de pesquisa estiver vazio, buscar todos os usuários
      fetchUsers();
    } else {
      // Caso contrário, buscar usuários que correspondem ao termo de pesquisa
      try {
        const response = await axios.get(`http://localhost:3000/usersearch/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const searchedUsers = response.data;
        setUsers(searchedUsers);
        setFilteredUsers(searchedUsers.filter(user => user.Active || !showActiveOnly));
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
        setUsers([]);
        setFilteredUsers([]);
        const errorMessage = error.response?.data?.error || "Nenhum usuário encontrado.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  const handleVoltar = () => {
    navigate("/manager"); // Navegar de volta para a página
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container-search">
        <Box className="box-manager-search">
          <Avatar className='avatar'>
            <AccountCircleIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Pesquisa de Usuário
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="searchTerm"
              label="Pesquisar Usuário"
              name="searchTerm"
              autoComplete="searchTerm"
              autoFocus
              value={searchTerm}
              onChange={handleChange}
              placeholder="Digite o nome ou email do usuário"
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
                maxWidth: 'calc(100% - 120px)', display: 'inline-block'
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showActiveOnly}
                  onChange={handleCheckboxChange}
                  name="showActiveOnly"
                  sx={{
                    '&.Mui-checked': {
                      color: '#45a049',
                    },
                    '&.Mui-checked + .MuiCheckbox-label::before': {
                      backgroundColor: '#45a049',
                    },
                  }}
                />
              }
              label="Mostrar apenas usuários ativos"
              sx={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                className='primary-button'
                sx={{ width: '32%' }}
              >
                Buscar
              </Button>
            </Box>
            {filteredUsers.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 400, overflowY: 'auto', overflowX: 'auto', border: "1px solid #ccc", borderRadius: "8px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Perfil</TableCell>
                      <TableCell>Ativo</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.IdUser}>
                        <TableCell>{user.IdUser}</TableCell>
                        <TableCell>{user.UserName}</TableCell>
                        <TableCell>{user.UserEmail}</TableCell>
                        <TableCell>{user.UserProfile}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={!!user.Active}
                            readOnly
                            sx={{
                              '&.Mui-checked': {
                                color: '#45a049',
                              },
                              '&.Mui-checked + .MuiCheckbox-label::before': {
                                backgroundColor: '#45a049',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            component={Link}
                            to={`/updateuser/${user.IdUser}`}
                            variant="contained" color="success"
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 0, width: '100%', maxWidth: 600 }}>
            <Button
              className='primary-button'
              sx={{ width: '50%' }}
              fullWidth
              variant="contained"
              onClick={handleVoltar}
            >
              Voltar
            </Button>
          </Box>
          <DialogMessage
            open={dialogOpen}
            onClose={handleCloseDialog}
            status={dialogStatus}
            message={dialogMessage}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UserSearch;
