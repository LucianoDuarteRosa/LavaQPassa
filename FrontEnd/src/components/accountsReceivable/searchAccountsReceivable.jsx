import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import PaidIcon from '@mui/icons-material/Paid';
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
import converter from '../../../utils/converter';
import { baseURL } from '../../config.js';

const theme = createTheme();

function SearchAccountsReceivable() {
  // Hook para obter a função de logout
  const { logout } = useAuth();
  // Hook para navegação
  const navigate = useNavigate();

  // Estados para armazenar os dados da pesquisa e os filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [receivable, setReceivable] = useState([]);
  const [filteredPayable, setFilteredPayable] = useState([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showPaidOnly, setShowPaidOnly] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const location = useLocation();
  const isHomePage = location.pathname === "/"

  // Recupera o token do usuário armazenado no localStorage
  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Função para aplicar filtros nos dados de contas a receber
  const applyFilters = (payablesData) => {
    const filtered = payablesData.filter(payable => {
      const dueDate = payable.DueDate.split('T')[0]; // Mantém apenas a parte da data
      const start = startDate;
      const end = endDate;

      // Verifica se os dados atendem aos filtros selecionados
      const matchesActive = showActiveOnly ? payable.Active : true;
      const matchesPaid = showPaidOnly ? !payable.Paid : true;
      const matchesDate = dueDate >= start && dueDate <= end;

      return matchesActive && matchesPaid && matchesDate;
    });

    setFilteredPayable(filtered);
  };

  // Função para buscar contas a receber do backend
  const fetchReceivable = async () => {
    try {
      const response = await axios.get(`${baseURL}/receivable`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReceivable(response.data);
      applyFilters(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
        setTimeout(() => {
          logout();
        }, 4000);
      } else {
        setReceivable([]);
        setFilteredPayable([]);
        const errorMessage = error.response?.data?.error || "Erro ao carregar contas a receber.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  // Busca contas a receber quando o componente é montado
  useEffect(() => {
    fetchReceivable();
  }, [token]);

  // Aplica filtros sempre que algum filtro ou dados mudam
  useEffect(() => {
    applyFilters(receivable);
  }, [showActiveOnly, showPaidOnly, startDate, endDate, receivable]);

  // Função para atualizar o termo de pesquisa
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Função para atualizar o estado de filtro para mostrar apenas ativos
  const handleCheckboxChange = (event) => {
    setShowActiveOnly(event.target.checked);
  };

  // Função para atualizar o estado de filtro para mostrar apenas pagos
  const handleCheckboxPaidChange = (event) => {
    setShowPaidOnly(event.target.checked);
  };

  // Função para atualizar as datas de início e fim dos filtros
  const handleDateChange = (event) => {
    if (event.target.name === 'startDate') {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  // Função para buscar contas a receber com base no termo de pesquisa
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      fetchReceivable();
    } else {
      try {
        const response = await axios.get(`${baseURL}/receivablesearch/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const searchedreceivable = response.data;
        applyFilters(searchedreceivable);
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
          setReceivable([]);
          setFilteredPayable([]);
          const errorMessage = error.response?.data?.error || "Nenhuma conta a receber encontrada.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    }
  };

  // Função para redirecionar para a página de gerenciamento
  const handleVoltar = () => {
    navigate("/manager");
  };

  // Função para fechar o diálogo de mensagem
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container-search">
        <Box className="box-manager-search">
          <Avatar className='avatar'>
            <PaidIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Pesquisa de Contas a Receber
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                margin="normal"
                required
                id="searchTerm"
                label="Pesquisar Contas"
                name="searchTerm"
                autoComplete="searchTerm"
                autoFocus
                value={searchTerm}
                onChange={handleChange}
                placeholder="Digite o cliente, valor, data de vencimento ou observação"
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
              <TextField
                margin="normal"
                fullWidth
                id="startDate"
                name="startDate"
                label="Data Inicial"
                type="date"
                color="success"
                value={startDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
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
                  maxWidth: 220, display: 'inline-block', mx: 1
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="endDate"
                name="endDate"
                label="Data Final"
                type="date"
                color="success"
                value={endDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
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
                  maxWidth: 220, display: 'inline-block', mx: 1
                }}
              />
            </Box>
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
              label="Mostrar somente contas ativas"
              sx={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPaidOnly}
                  onChange={handleCheckboxPaidChange}
                  name="showPaidOnly"
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
              label="Ocultar contas pagas"
              sx={{ display: 'inline-block', verticalAlign: 'middle', gap: '10px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                className='primary-button'
                sx={{ width: '29%' }}
              >
                Buscar
              </Button>
            </Box>
            {filteredPayable.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 350 }}>
                <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 30 }}>Id</TableCell>
                      <TableCell sx={{ minWidth: 70 }}>Vencimento</TableCell>
                      <TableCell sx={{ minWidth: 50 }}>Valor</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Cliente</TableCell>
                      <TableCell sx={{ minWidth: 15 }}>Venda</TableCell>
                      <TableCell sx={{ minWidth: 15 }}>Loja</TableCell>
                      <TableCell sx={{ minWidth: 10 }}>Observação</TableCell>
                      <TableCell>Pago</TableCell>
                      <TableCell>Ativo</TableCell>
                      <TableCell sx={{ minWidth: 70 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayable.map((receivable) => (
                      <TableRow key={receivable.IdAccountReceivable}>
                        <TableCell>{receivable.IdAccountReceivable}</TableCell>
                        <TableCell>{converter.convertToBrazilianDate(receivable.DueDate)}</TableCell>
                        <TableCell>{receivable.Amount.toFixed('2')}</TableCell>
                        <TableCell>{receivable.ClientSupplierName}</TableCell>
                        <TableCell> {receivable.IdSale != null ? `N° ${receivable.IdSale}` : ''}</TableCell>
                        <TableCell>{receivable.StoreName}</TableCell>
                        <TableCell>{receivable.Note}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={Boolean(receivable.Paid)}
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
                            checked={Boolean(receivable.Active)}
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
                        <TableCell sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', gap: '5px' }}>
                          <Button
                            component={Link}
                            to={`/updateaccountsreceivable/${receivable.IdAccountReceivable}`}
                            variant="contained" color="success"
                          >
                            Editar
                          </Button>
                          <Button
                            component={Link}
                            to={`/detailsaccountsreceivable/${receivable.IdAccountReceivable}`}
                            variant="contained" color="success"
                          >
                            Detalhes
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
            {!isHomePage && (
              <Button
                className='primary-button'
                sx={{ width: '53%' }}
                fullWidth
                variant="contained"
                onClick={handleVoltar}
              >
                Voltar
              </Button>
            )}
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

export default SearchAccountsReceivable;
