import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
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

function SearchClientSupplier() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSupplier, setClientSupplier] = useState([]);
  const [filteredClientSupplier, setFilteredClientSupplier] = useState([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Função para buscar todos os cliente/fornecedor
  const fetchClientSupplier = async () => {
    try {
      const response = await axios.get("http://localhost:3000/client", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setClientSupplier(response.data);
      setFilteredClientSupplier(response.data.filter(clientSupplier => clientSupplier.Active || !showActiveOnly));
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        logout();
      }
      setClientSupplier([]);
      setFilteredClientSupplier([]);
      const errorMessage = error.response?.data?.error || "Erro ao carregar cliente/fornecedor.";
      setDialogStatus('error');
      setDialogMessage(errorMessage);
      setDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchClientSupplier();
  }, [token]);

  useEffect(() => {
    // Filtra os cliente/fornecedor de acordo com o estado do checkbox
    setFilteredClientSupplier(clientSupplier.filter(clientSupplier => clientSupplier.Active || !showActiveOnly));
  }, [showActiveOnly, clientSupplier]); // Dependências para atualizar quando showActiveOnly

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setShowActiveOnly(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      // Se o campo de pesquisa estiver vazio, buscar todos os cliente/fornecedor
      fetchClientSupplier();
    } else {
      // Caso contrário, buscar cliente/fornecedor que correspondem ao termo de pesquisa
      try {
        const response = await axios.get(`http://localhost:3000/clientsearch/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const searchClientSupplier = response.data;
        setClientSupplier(searchClientSupplier);
        setFilteredClientSupplier(searchClientSupplier.filter(clientSupplier => clientSupplier.Active || !showActiveOnly));
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
        setClientSupplier([]);
        setFilteredClientSupplier([]);
        const errorMessage = error.response?.data?.error || "Nenhum cliente/fornecedor encontrado.";
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
      <Container className="box-container-search" >
        <Box className="box-manager-search">
          <Avatar className='avatar'>
            <AssignmentIndIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Pesquisa de Cliente/Fornecedor
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', maxWidth: 1000, margin: '0 auto', textAlign: 'center', }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="searchTerm"
              label="Pesquisar Cliente/Fornecedor"
              name="searchTerm"
              autoComplete="searchTerm"
              autoFocus
              value={searchTerm}
              onChange={handleChange}
              placeholder="Digite o nome, endereço, bairro, cidade, e-mail ou telefone"
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
              label="Mostrar apenas clientes/fornecedores ativos"
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
            <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxHeight: 800, overflowY: 'auto', overflowX: 'auto', border: "1px solid #ccc", borderRadius: "8px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 50 }}>Id</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Nome</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Telefone</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>E-mail</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Tipo</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Chave Pix</TableCell>
                    <TableCell sx={{ minWidth: 300 }}>Endereço</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Número</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Complemento</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Bairro</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Cidade</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Cliente</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Fornecedor</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Ativo</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClientSupplier.map((clientSupplier) => (
                    <TableRow key={clientSupplier.IdClientSupplier}>
                      <TableCell>{clientSupplier.IdClientSupplier}</TableCell>
                      <TableCell>{clientSupplier.ClientSupplierName}</TableCell>
                      <TableCell>{clientSupplier.Phone}</TableCell>
                      <TableCell>{clientSupplier.Email}</TableCell>
                      <TableCell>{clientSupplier.TypeKey}</TableCell>
                      <TableCell>{clientSupplier.PixKey}</TableCell>
                      <TableCell>{clientSupplier.Address}</TableCell>
                      <TableCell>{clientSupplier.Number}</TableCell>
                      <TableCell>{clientSupplier.Complement}</TableCell>
                      <TableCell>{clientSupplier.Neighborhood}</TableCell>
                      <TableCell>{clientSupplier.City}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={!!clientSupplier.IsClient}
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
                        <Checkbox
                          checked={!!clientSupplier.IsSupplier}
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
                        <Checkbox
                          checked={!!clientSupplier.Active}
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
                          to={`/updateclient/${clientSupplier.IdClientSupplier}`}
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

export default SearchClientSupplier;
