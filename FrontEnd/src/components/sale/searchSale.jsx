import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DialogMessage from '../../../utils/dialogMessage';
import converter from '../../../utils/converter';
import { baseURL } from '../../config.js';

const theme = createTheme();

function SearchSale() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState([]);
  const [filteredPayable, setFilteredPayable] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  const applyFilters = (salesData) => {
    const filtered = salesData.filter(sale => {
      const saleDate = new Date(sale.SaleDate);
      const start = new Date(startDate);
      const end = new Date(endDate);

      const matchesDate = saleDate >= start && saleDate <= end;

      return matchesDate;
    });

    setFilteredPayable(filtered);
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${baseURL}/sale`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSales(response.data);
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
        setSales([]);
        setFilteredPayable([]);
        const errorMessage = error.response?.data?.error || "Erro ao carregar vendas.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchSales();
  }, [token]);

  useEffect(() => {
    applyFilters(sales);
  }, [startDate, endDate, sales]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    if (event.target.name === 'startDate') {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      fetchSales();
    } else {
      try {
        const response = await axios.get(`${baseURL}/salesearch/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const searchedPayables = response.data;
        applyFilters(searchedPayables);
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
          setSales([]);
          setFilteredPayable([]);
          const errorMessage = error.response?.data?.error || "Nenhuma venda encontrada.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    }
  };

  const handleVoltar = () => {
    navigate("/manager");
  };

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
            Pesquisa de Vendas
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                margin="normal"
                required
                id="searchTerm"
                label="Pesquisar Vendas"
                name="searchTerm"
                autoComplete="searchTerm"
                autoFocus
                value={searchTerm}
                onChange={handleChange}
                placeholder="Digite o fornecedor, usuário, loja, status ou condição de pagamento"
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
                      <TableCell sx={{ minWidth: 70 }}>Data</TableCell>
                      <TableCell sx={{ minWidth: 50 }}>Valor</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Cliente</TableCell>
                      <TableCell sx={{ minWidth: 20 }}>Loja</TableCell>
                      <TableCell sx={{ minWidth: 20 }}>Condição</TableCell>
                      <TableCell sx={{ minWidth: 15 }}>Status</TableCell>
                      <TableCell sx={{ minWidth: 15 }}>Usuário</TableCell>
                      <TableCell sx={{ minWidth: 40 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayable.map((sales) => (
                      <TableRow key={sales.IdSale}>
                        <TableCell>{sales.IdSale}</TableCell>
                        <TableCell>{converter.convertToBrazilianDate(sales.SaleDate)}</TableCell>
                        <TableCell>{parseFloat(sales.SalePrice).toFixed('2')}</TableCell>
                        <TableCell>{sales.ClientSupplierName}</TableCell>
                        <TableCell>{sales.StoreName}</TableCell>
                        <TableCell>{sales.PaymentCondition}</TableCell>
                        <TableCell>{sales.SaleStatus}</TableCell>
                        <TableCell>{sales.UserName}</TableCell>
                        <TableCell sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', gap: '5px' }}>
                          <Button
                            component={Link}
                            to={`/updatesale/${sales.IdSale}`}
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
              sx={{ width: '53%' }}
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

export default SearchSale;
