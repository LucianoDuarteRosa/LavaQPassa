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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import converter from '../../../utils/converter';
import { baseURL } from '../../config.js';

const theme = createTheme();

function UpdateAccountsPayable() {
  // Hook para obter a função de logout e para navegação
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Obtém o token do usuário do localStorage
  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  // Estados para armazenar os dados do formulário, clientes e lojas
  const [formData, setFormData] = useState({
    amount: "",
    idclient: "",
    idsale: "",
    idstore: "",
    duedate: "",
    note: "",
    paid: "",
    active: ""
  });

  // Estados para armazenar dados e controlar o comportamento do componente
  const [clients, setClients] = useState([]);
  const [stores, setStores] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  // Efeito para buscar os dados da conta a pagar, clientes e lojas quando o componente é montado ou o token muda
  useEffect(() => {
    // Função para buscar os dados da conta a pagar
    const fetchAccountsPayable = async () => {
      try {
        const response = await axios.get(`${baseURL}/payable/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Atualiza os dados do formulário com os dados da conta a pagar
        const formData = response.data[0];
        setFormData({
          idaccountpayable: formData.IdAccountPayable,
          amount: formData.Amount,
          idsale: formData.IdSale,
          idclient: formData.IdClientSupplier,
          idstore: formData.IdStore,
          active: Boolean(formData.Active),
          duedate: converter.mySQLToFront(formData.DueDate),
          note: formData.Note,
          paid: Boolean(formData.Paid),
          registrationdate: converter.convertToDateTimeLocalFormat(formData.RegistrationDate)
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
          const errorMessage = error.response?.data?.error || "Erro ao carregar contas a pagar.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    }

    // Função para buscar as lojas
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

    // Função para buscar os clientes
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

  // Manipulador para atualizar os dados do formulário conforme os campos são alterados
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData, [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manipulador para enviar o formulário de atualização da conta a pagar
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Valida os dados do formulário
      const errors = [];
      const testAmount = validator.floatValidator(formData.amount);
      const testIdClientSupplier = validator.integerValidator(formData.idclient);
      const testIdStore = validator.integerValidator(formData.idstore);
      const testActive = validator.booleanValidator(formData.active);
      const testPaid = validator.booleanValidator(formData.paid);

      let testNote = true;
      if (formData.note !== null) {
        testNote = validator.allValidator(formData.note, 0, 255);
      }

      const testDueDate = validator.dateValidator(formData.duedate);

      if (testNote !== true) {
        errors.push(testNote);
      }
      if (testAmount !== true) {
        errors.push(testAmount);
      }
      if (testIdClientSupplier !== true) {
        errors.push(testIdClientSupplier);
      }
      if (testIdStore !== true) {
        errors.push(testIdStore);
      }
      if (testDueDate !== true) {
        errors.push(testDueDate);
      }
      if (testActive !== true) {
        errors.push(testActive);
      }
      if (testPaid !== true) {
        errors.push(testPaid);
      }
      if (errors.length > 0) {
        setDialogStatus('error');
        setDialogMessage(errors.join('\n'));
        setDialogOpen(true);
        return;
      }

      // Atualiza a conta a pagar na API
      await axios.put(`${baseURL}/payable/${id}`, { ...formData }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDialogStatus('success');
      setDialogMessage("Conta a pagar atualizada com sucesso");
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
        const errorMessage = error.response?.data?.errors || "Erro ao atualizar conta a pagar.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  // Manipulador para voltar à página de busca de contas a pagar
  const handleVoltar = () => {
    navigate("/searchaccountspayable");
  };

  // Manipulador para fechar o diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Verifica se o formulário deve ser desativado com base em dados
  const isDisabled = formData.idsale !== null;

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container-product">
        <CssBaseline />
        <Box className="box-manager-product" component="form" onSubmit={handleSubmit} >
          <Avatar className='avatar'>
            <PaidIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atualizar Conta a Pagar
          </Typography>
          <Box sx={{ display: "flex", gap: '10px' }}>
            <Box sx={{ mt: 1 }} className="box-manager-product-main">
              <TextField
                className="textfield-product"
                margin="normal"
                type="number"
                required
                fullWidth
                label="Valor"
                name="amount"
                autoComplete="amount"
                disabled={isDisabled}
                value={parseFloat(formData.amount).toFixed(2)}
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
                autoFocus
                fullWidth
                margin="normal"
                type="date"
                required
                label="Vencimento"
                name="duedate"
                autoComplete="duedate"
                value={formData.duedate}
                disabled={isDisabled}
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
              <Select
                required
                name="idstore"
                value={formData.idstore}
                onChange={handleChange}
                disabled={isDisabled}
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
                disabled={isDisabled}
                fullWidth
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
              <TextField
                className="textfield-product"
                margin="normal"
                fullWidth
                label="Observação"
                name="note"
                autoComplete="note"
                value={formData.note}
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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", gap: '40px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      disabled={isDisabled}
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

export default UpdateAccountsPayable;
