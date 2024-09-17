import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogMessage from '../../../utils/dialogMessage';
import converter from '../../../utils/converter';
import { baseURL } from '../../config.js';

const theme = createTheme();

function DetailsAccountsReceivable() {
  // Hook para obter a função de logout
  const { logout } = useAuth();
  // Hook para obter o ID da URL
  const { id } = useParams();
  // Hook para navegação
  const navigate = useNavigate();

  // Recupera o token do usuário armazenado no localStorage
  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Estado para armazenar os dados do formulário e detalhes de venda
  const [formData, setFormData] = useState({
    amount: "",
    idclient: "",
    idsale: "",
    idstore: "",
    duedate: "",
    note: "",
    paid: "",
    active: "",
    registrationdate: "",
    user: "",
    saledate: ""
  });

  // Estados para armazenar os dados da pesquisa e os filtros
  const [saleDetail, setSaleDetail] = useState([]);
  const [clients, setClients] = useState([]);
  const [stores, setStores] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  // Função para buscar detalhes da conta a receber
  useEffect(() => {
    const fetchAccountsReceivable = async () => {
      try {
        const response = await axios.get(`${baseURL}/receivable/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Atualiza o estado com os dados da conta a receber
        const formData = response.data[0];
        setFormData({
          idaccountreceivable: formData.IdAccountReceivable,
          amount: parseFloat(formData.Amount).toFixed(2),
          idclient: formData.IdClientSupplier,
          idstore: formData.IdStore,
          active: Boolean(formData.Active),
          duedate: converter.mySQLToFront(formData.DueDate),
          note: formData.Note,
          paid: Boolean(formData.Paid),
          registrationdate: converter.mySQLToFront(formData.RegistrationDate),
          user: formData.UserName,
          saledate: converter.mySQLToFront(formData.SaleDate),
          idsale: formData.IdSale
        });
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          // Mensagem e redirecionamento para login se a sessão expirar
          const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
          setTimeout(() => {
            logout();
          }, 4000);
        } else {
          const errorMessage = error.response?.data?.error || "Erro ao carregar conta a receber";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    }

    // Função para buscar lojas
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

    // Função para buscar clientes
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

    // Chama as funções para buscar dados
    fetchAccountsReceivable();
    fetchClients();
    fetchStores();
  }, [token, logout, id]);

  // Atualiza os detalhes da venda quando o ID da venda muda
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

  // Função para atualizar os dados do formulário
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData, [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Função para redirecionar para a página de pesquisa de contas a receber
  const handleVoltar = () => {
    navigate("/searchaccountsreceivable");
  };

  // Função para fechar o diálogo de mensagem
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container-product">
        <CssBaseline />
        <Box className="box-manager-product">
          <Avatar className='avatar'>
            <PaidIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Detalhes Conta a Receber
          </Typography>
          <Box sx={{ display: "flex", gap: '10px' }}>
            <Box sx={{ mt: 1 }} className="box-manager-detailsaccount-main">
              <Box sx={{ display: "flex", gap: '10px' }}>
                <TextField
                  className="textfield-product"
                  margin="normal"
                  type="number"
                  disabled
                  fullWidth
                  label="Valor"
                  name="amount"
                  autoComplete="amount"
                  value={formData.amount}
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
                  type="date"
                  label="Vencimento"
                  name="duedate"
                  autoComplete="duedate"
                  value={formData.duedate}
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
                  name="user"
                  autoComplete="user"
                  value={formData.user}
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
                  type="date"
                  label="Cadastro"
                  name="registrationdate"
                  autoComplete="registrationdate"
                  value={formData.registrationdate}
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
                <TextField
                  className="textfield-product"
                  margin="normal"
                  fullWidth
                  disabled
                  label="Observação"
                  name="note"
                  autoComplete="note"
                  value={formData.note || ''}
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
                      disabled
                      checked={formData.active}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      checked={formData.paid}
                      onChange={handleChange}
                      name="paid"
                      sx={{
                        '&.Mui-checked': {
                          color: '#45a049',
                        },
                      }}
                    />
                  }
                  label="Pago"
                />
              </Box>
              <Box sx={{ display: "flex", gap: '10px' }}>
                <TextField
                  className="textfield-product"
                  margin="normal"
                  disabled
                  fullWidth
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
                  disabled
                  fullWidth
                  margin="normal"
                  type="date"
                  label="Data da Venda"
                  name="saledaate"
                  autoComplete="saledaate"
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
              {saleDetail.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 150 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 30 }}>Id</TableCell>
                        <TableCell sx={{ minWidth: 100 }}>Nome</TableCell>
                        <TableCell sx={{ minWidth: 70 }}>Custo</TableCell>
                        <TableCell sx={{ minWidth: 70 }}>Venda</TableCell>
                        <TableCell sx={{ minWidth: 30 }}>Condição de Pagamento</TableCell>
                        <TableCell sx={{ minWidth: 30 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {saleDetail.map((saleDetail) => (
                        <TableRow key={saleDetail.IdSaleDetail}>
                          <TableCell>{saleDetail.IdProduct}</TableCell>
                          <TableCell>{saleDetail.ProductName}</TableCell>
                          <TableCell>{parseFloat(saleDetail.CostPrice).toFixed('2')}</TableCell>
                          <TableCell>{parseFloat(saleDetail.SalePrice).toFixed('2')}</TableCell>
                          <TableCell>{saleDetail.PaymentCondition}</TableCell>
                          <TableCell>{saleDetail.SaleStatus}</TableCell>
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
              component={Link}
              to={`/updateaccountspayable/${id}`}
              variant="contained"
              fullWidth
              className='primary-button'
            >
              Editar
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

export default DetailsAccountsReceivable;
