import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
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

function UpdateProduct() {
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  const [formData, setFormData] = useState({
    idproduct: "",
    name: "",
    costprice: "",
    saleprice: "",
    idclient: "",
    idgsubgroup: "",
    idgroup: "",
    idsubgroup: "",
    idstore: "",
    idsale:"",
    sold: "",
    active: "",
    iduser: "",
    username: "",
    registrationdate: "",
  });

  const [groups, setGroup] = useState([]);
  const [clients, setClients] = useState([]);
  const [stores, setStores] = useState([]);
  const [subGroups, setSubGroup] = useState([]);
  const [percentage, setPercentage] = useState("");
  const [costprice, setCostPrice] = useState("");
  const [filteredSubGroups, setFilteredSubGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const formData = response.data[0];
        setFormData({
          idproduct: formData.IdProduct,
          name: formData.ProductName,
          costprice: parseFloat(formData.CostPrice).toFixed(2),
          saleprice: parseFloat(formData.SalePrice).toFixed(2),
          idclient: formData.IdClientSupplier,
          idgsubgroup: formData.IdSubGroup,
          idgroup: formData.IdGroup,
          idsubgroup: formData.IdSubGroup,
          idstore: formData.IdStore,
          sold: formData.Sold,
          active: Boolean(formData.Active),
          iduser: formData.IdUser,
          username: formData.UserName,
          registrationdate: converter.convertToDateTimeLocalFormat(formData.RegistrationDate)
        });
        setCostPrice();
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
          const errorMessage = error.response?.data?.error || "Erro ao carregar produto.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
      }
    }

    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${baseURL}/group`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group", error);
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
    const fetchSubGroup = async () => {
      try {
        const response = await axios.get(`${baseURL}/subgroup`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSubGroup(response.data);
      } catch (error) {
        console.error("Error fetching sub-group", error);
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

    fetchProduct();
    fetchClients();
    fetchStores();
    fetchSubGroup();
    fetchGroup();
  }, [id, token, logout]);

  useEffect(() => {
    const calculatePercentage = () => {
      const saleprice = parseFloat(formData.saleprice);
      const costprice = saleprice * 0.4;
      const percentage = 60;

      if (!isNaN(saleprice)) {
        formData.costprice = costprice.toFixed(2);
        setCostPrice(costprice.toFixed(2));
        setPercentage(percentage.toFixed(2) + '%');
      } else {
        setPercentage('');
        setCostPrice('');

      }
    };

    calculatePercentage();
  }, [formData.costprice, formData.saleprice]);

  useEffect(() => {
    if (selectedGroup) {
      setFilteredSubGroups(subGroups.filter(subGroup => subGroup.IdGroup === selectedGroup));
    } else {
      setFilteredSubGroups([]);
    }
  }, [selectedGroup, subGroups]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData, [name]: type === 'checkbox' ? checked : value
    }));

    if (name === "idgroup") {
      setSelectedGroup(value);
      setFormData(prevFormData => ({
        ...prevFormData,
        idsubgroup: ""
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = [];

      const testProductName = validator.allValidator(formData.name, 2, 50);
      const testCostPrice = validator.floatValidator(formData.costprice);
      const testSalePrice = validator.floatValidator(formData.saleprice);
      const testIdClientSupplier = validator.integerValidator(formData.idclient);
      const testIdStore = validator.integerValidator(formData.idstore);
      const testIdGroup = validator.integerValidator(formData.idgroup);
      const testIdSubGroup = validator.integerValidator(formData.idsubgroup);

      if (testProductName !== true) {
        errors.push(testProductName);
      }
      if (testCostPrice !== true) {
        errors.push(testCostPrice);
      }
      if (testSalePrice !== true) {
        errors.push(testSalePrice);
      }
      if (testIdClientSupplier !== true) {
        errors.push(testIdClientSupplier);
      }
      if (testIdStore !== true) {
        errors.push(testIdStore);
      }
      if (testIdGroup !== true) {
        errors.push(testIdGroup);
      }
      if (testIdSubGroup !== true) {
        errors.push(testIdSubGroup);
      }
      if (errors.length > 0) {
        setDialogStatus('error');
        setDialogMessage(errors.join('\n'));
        return;
      }

      await axios.put(`${baseURL}/product/${id}`, { ...formData }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDialogStatus('success');
      setDialogMessage("Usuário atualizado com sucesso");
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
        const errorMessage = error.response?.data?.errors || "Erro ao atualizar usuário.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  const handleVoltar = () => {
    navigate("/searchproduct");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container-product">
        <CssBaseline />
        <Box className="box-manager-product" sx={{ mt: '2%' }} component="form" onSubmit={handleSubmit} >
          <Avatar className='avatar'>
            <ProductionQuantityLimitsIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atualizar de Produto
          </Typography>
          <Box sx={{ display: "flex", gap: '10px' }}>
            <Box sx={{ mt: 1 }} className="box-manager-product-main">
              <TextField
                fullWidth
                margin="normal"
                disabled={formData.sold}
                required
                label="Nome"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
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
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <TextField
                  className="textfield-product"
                  disabled
                  margin="normal"
                  type="number"
                  required
                  fullWidth
                  label="Preço de Custo"
                  name="costprice"
                  autoComplete="costprice"
                  value={formData.costprice}
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
                  disabled
                  fullWidth
                  label="Percentual"
                  name="percentage"
                  autoComplete="percentage"
                  value={percentage}
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
                  required
                  fullWidth
                  label="Preço de Venda"
                  name="saleprice"
                  autoComplete="saleprice"
                  value={formData.saleprice}
                  disabled={formData.sold}
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
              <Select
                required
                name="idstore"
                value={formData.idstore}
                onChange={handleChange}
                disabled={formData.sold}
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
                disabled={formData.sold}
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
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Select
                  required
                  name="idgroup"
                  value={formData.idgroup}
                  disabled={formData.sold}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedGroup(e.target.value);
                  }}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Selecione um Grupo</em>;
                    }
                    return groups.find(group => group.IdGroup === selected)?.GroupName || '';
                  }}
                  color="success"
                  sx={{ mt: '10px' }}
                >
                  <MenuItem value="" >
                    <em>Selecione um Grupo</em>
                  </MenuItem>
                  {groups.map(group => (
                    <MenuItem key={group.IdGroup} value={group.IdGroup}>
                      {group.GroupName}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  required
                  name="idsubgroup"
                  value={formData.idsubgroup}
                  disabled={formData.sold}
                  onChange={handleChange}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Selecione um Subgrupo</em>;
                    }
                    return subGroups.find(subGroup => subGroup.IdSubGroup === selected)?.SubGroupName || '';
                  }}
                  color="success"
                  sx={{ mt: '10px' }}
                >
                  <MenuItem value="" >
                    <em>Selecione um Subgrupo</em>
                  </MenuItem>
                  {filteredSubGroups.map(subGroup => (
                    <MenuItem key={subGroup.IdSubGroup} value={subGroup.IdSubGroup}>
                      {subGroup.SubGroupName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <TextField
                fullWidth
                margin="normal"
                disabled
                label="Usuário"
                name="username"
                autoComplete="username"
                autoFocus
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
                fullWidth
                type="datetime-local"
                margin="normal"
                disabled
                label="Data de Cadastro"
                name="registrationdate"
                autoComplete="registrationdate"
                autoFocus
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.active}
                    disabled={formData.sold}
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
            </Box>
          </Box>
          <Box className="box-manager-button" sx={{ width: '60%' }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={formData.sold}
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

export default UpdateProduct;
