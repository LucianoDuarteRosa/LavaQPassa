import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
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

function GroupSearch() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroup] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Função para buscar todos os grupos
  const fetchGroup = async () => {
    try {
      const response = await axios.get("http://localhost:3000/group", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGroup(response.data);
      setFilteredGroup(response.data.filter(group => group.Active || !showActiveOnly));
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        logout();
      }
      setGroup([]);
      setFilteredGroup([]);
      const errorMessage = error.response?.data?.error || "Erro ao carregar group.";
      setDialogStatus('error');
      setDialogMessage(errorMessage);
      setDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [token]); // Dependência para atualizar quando token mudar

  useEffect(() => {
    // Filtra os grupo de acordo com o estado do checkbox
    setFilteredGroup(groups.filter(group => group.Active || !showActiveOnly));
  }, [showActiveOnly, groups]); // Dependências para atualizar quando showActiveOnly ou grupo mudar

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setShowActiveOnly(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      // Se o campo de pesquisa estiver vazio, buscar todos os grupo
      fetchGroup();
    } else {
      // Caso contrário, buscar grupo que correspondem ao termo de pesquisa
      try {
        const response = await axios.get(`http://localhost:3000/groupsearch/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const searchedGroup = response.data;
        setGroup(searchedGroup);
        setFilteredGroup(searchedGroup.filter(group => group.Active || !showActiveOnly));
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
        setGroup([]);
        setFilteredGroup([]);
        const errorMessage = error.response?.data?.error || "Nenhum grupo encontrado.";
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
            <AccountTreeIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Pesquisa de Grupo
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', maxWidth: 750, margin: '0 auto', textAlign: 'center' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="searchTerm"
              label="Pesquisar Grupo"
              name="searchTerm"
              autoComplete="searchTerm"
              autoFocus
              value={searchTerm}
              onChange={handleChange}
              placeholder="Digite o nome grupo"
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
              label="Mostrar apenas grupos ativos"
              sx={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                className='primary-button'
                sx={{ width: '31%' }}
              >
                Buscar
              </Button>
            </Box>
            {filteredGroup.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 400, overflowY: 'auto', overflowX: 'auto', border: "1px solid #ccc", borderRadius: "8px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Ativo</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGroup.map((group) => (
                      <TableRow key={group.IdGroup}>
                        <TableCell>{group.IdGroup}</TableCell>
                        <TableCell>{group.GroupName}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={!!group.Active}
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
                            to={`/updategroup/${group.IdGroup}`}
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

export default GroupSearch;
