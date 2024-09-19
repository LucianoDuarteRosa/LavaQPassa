import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import converter from '../../../utils/converter';
import { baseURL } from '../../config.js';

const theme = createTheme();

function UpdateSale() {
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  const [formData, setFormData] = useState({
    idsale: "",
    costprice: "",
    saleprice: "",
    idclient: "",
    idstore: "",
    iduser: "",
    saledate: "",
    paymentcondition: "",
    salestatus: "",
    username: ""
  });

  const [saleDetail, setSaleDetail] = useState([]);
  const [clients, setClients] = useState([]);
  const [stores, setStores] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const fetchAccountsPayable = async () => {
      try {
        const response = await axios.get(`${baseURL}/sale/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const formData = response.data[0];
        setFormData({
          idsale: formData.IdSale,
          costprice: formData.CostPrice,
          saleprice: formData.SalePrice.toFixed(2),
          idclient: formData.IdClientSupplier,
          idstore: formData.IdStore,
          iduser: formData.IdUser,
          saledate: converter.convertToDateTimeLocalFormat(formData.SaleDate),
          paymentcondition: formData.PaymentCondition,
          salestatus: formData.SaleStatus,
          username: formData.UserName
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
          const errorMessage = error.response?.data?.error || "Erro ao carregar venda.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    }

    const fetchStores = async () => {
      try {
        const response = await axios.get(`${baseURL}/store`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching store", error);
        if (error.response && error.response.status === 401) {
          const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
          setTimeout(() => {
            logout();
          }, 4000);
        }
      }
    };
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${baseURL}/client`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching client", error);
        if (error.response && error.response.status === 401) {
          const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
          setTimeout(() => {
            logout();
          }, 4000);
        }
      }
    };

    fetchAccountsPayable();
    fetchClients();
    fetchStores();
  }, [token, logout, id]);

  useEffect(() => {
    if (formData.idsale) {
      const fetchDetailsSale = async () => {
        try {
          const response = await axios.get(`${baseURL}/saledetail/${formData.idsale}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setSaleDetail(response.data);
        } catch (error) {
          console.error("Error fetching sale details", error);
          if (error.response && error.response.status === 401) {
            const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
            setDialogStatus('error');
            setDialogMessage(errorMessage);
            setDialogOpen(true);
            setTimeout(() => {
              logout();
            }, 4000);
          }
        }
      };
      fetchDetailsSale();
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData, [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = [];
      const testIdSale = validator.integerValidator(formData.idsale);

      let testStatus = true;
      if (formData.salestatus !== null) {
        if (!formData.salestatus === 'Dinheiro' && !formData.salestatus === 'Cartão Crédito' && !formData.salestatus === 'Cartão Débito' && !formData.salestatus === 'Cheque' && !formData.salestatus === 'Crediário') {
          testStatus = false;
          errors.push("Condição de pagamento inexistente.");
        }
      } else {
        errors.push("Selecione um status para a venda.")
      }

      if (testIdSale !== true) {
        errors.push(testIdSale);
      }
      if (testStatus !== true) {
        errors.push(testStatus);
      }

      if (errors.length > 0) {
        setDialogStatus('error');
        setDialogMessage(errors.join('\n'));
        setDialogOpen(true);
        return;
      }

      const updateSale = { IdSale: formData.idsale, SaleStatus: formData.salestatus, PaymentCondition: formData.paymentcondition };
      await axios.put(`${baseURL}/sale/${id}`, { ...updateSale }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDialogStatus('success');
      setDialogMessage("Venda atualizada com sucesso");
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
        const errorMessage = error.response?.data?.errors || "Erro ao atualizar venda.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  const handleVoltar = () => {
    navigate("/searchsale");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container-product">
        <CssBaseline />
        <Box className="box-manager-product" component="form" onSubmit={handleSubmit} >
          <Avatar className='avatar'>
            <PaidIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atualizar Venda
          </Typography>
          <Box sx={{ display: "flex", gap: '10px' }}>
            <Box sx={{ mt: 1 }} className="box-manager-detailsaccount-main">
              <Box sx={{ display: "flex", gap: '10px' }}>
                <TextField
                  disabled
                  fullWidth
                  type="number"
                  margin="normal"
                  label="Venda"
                  name="idsale"
                  autoComplete="idsale"
                  value={formData.idsale}
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
                  className="textfield-product"
                  margin="normal"
                  type="number"
                  disabled
                  fullWidth
                  label="Valor"
                  name="amount"
                  autoComplete="amount"
                  value={formData.saleprice}
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
              </Box>
              <Box sx={{ display: "flex", gap: '10px' }}>
                <Select
                  disabled
                  name="idstore"
                  value={formData.idstore}
                  onChange={handleChange}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Selecione uma Loja</em>;
                    }
                    return stores.find(store => store.IdStore === selected)?.StoreName || '';
                  }}
                  color="success"
                  sx={{ mt: '10px' }}
                >
                  <MenuItem value="" >
                    <em>Selecione uma Loja</em>
                  </MenuItem>
                  {stores.map(store => (
                    <MenuItem key={store.IdStore} value={store.IdStore}>
                      {store.StoreName}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  name="idclient"
                  value={formData.idclient}
                  onChange={handleChange}
                  fullWidth
                  disabled
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Selecione um Cliente</em>;
                    }
                    return clients.find(client => client.IdClientSupplier === selected)?.ClientSupplierName || '';
                  }}
                  color="success"
                  sx={{ mt: '10px' }}
                >
                  <MenuItem value="" >
                    <em>Selecione um Cliente</em>
                  </MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client.IdClientSupplier} value={client.IdClientSupplier}>
                      {client.ClientSupplierName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ display: "flex", gap: '10px' }}>
                <TextField
                  className="textfield-product"
                  margin="normal"
                  disabled
                  fullWidth
                  label="Usuário"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
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
                  disabled
                  fullWidth
                  margin="normal"
                  type="datetime-local"
                  label="Data da Venda"
                  name="saledate"
                  autoComplete="saledate"
                  value={formData.saledate}
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
              </Box>
              <Box sx={{ display: "flex", gap: '10px', justifyContent: 'center', alignItems: "center", }}>
                <Select
                  disabled
                  name="paymentcondition"
                  value={formData.paymentcondition}
                  onChange={handleChange}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Condição de Pagamento</em>;
                    }
                    return formData.paymentcondition || '';
                  }}
                  color="success"
                  sx={{ mt: '10px' }}
                >
                  <MenuItem value="">Forma de pagamento</MenuItem>
                  <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                  <MenuItem value="Cartão Crédito">Cartão Crédito</MenuItem>
                  <MenuItem value="Cartão Débito">Cartão Débito</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="Cheque">Crediário</MenuItem>
                </Select>
                <Select
                  required
                  name="salestatus"
                  value={formData.salestatus}
                  onChange={handleChange}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Selecione o Status</em>;
                    }
                    return formData.salestatus || '';
                  }}
                  color="success"
                  sx={{ mt: '10px' }}
                >
                  <MenuItem value="">Selecione um Status</MenuItem>
                  <MenuItem value="Finalizada">Finalizada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </Select>
              </Box>
              {saleDetail.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 150 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 30 }}>Id</TableCell>
                        <TableCell sx={{ minWidth: 100 }}>Nome</TableCell>
                        <TableCell sx={{ minWidth: 70 }}>Custo</TableCell>
                        <TableCell sx={{ minWidth: 70 }}>Venda</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {saleDetail.map((saleDetail) => (
                        <TableRow key={saleDetail.IdSaleDetail}>
                          <TableCell>{saleDetail.IdProduct}</TableCell>
                          <TableCell>{saleDetail.ProductName}</TableCell>
                          <TableCell>{parseFloat(saleDetail.CostPrice).toFixed('2')}</TableCell>
                          <TableCell>{parseFloat(saleDetail.SalePrice).toFixed('2')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
          <Box className="box-manager-button" sx={{ width: '60%' }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className='primary-button'
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              fullWidth
              className='primary-button'
              onClick={handleVoltar}
            >
              Voltar
            </Button>
          </Box>
        </Box>
      </Container>
      <DialogMessage
        open={dialogOpen}
        onClose={handleCloseDialog}
        status={dialogStatus}
        message={dialogMessage}
      />
    </ThemeProvider>
  );
}

export default UpdateSale;
