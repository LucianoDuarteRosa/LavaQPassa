import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
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
import { baseURL } from '../../config.js';

const theme = createTheme();

function SearchProduct() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredproducts, setFilteredProducts] = useState([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showSoldOnly, setShowSoldOnly] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const productToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = productToken.token || "";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
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
        setProducts([]);
        setFilteredProducts([]);
        const errorMessage = error.response?.data?.error || "Erro ao carregar produtos.";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  useEffect(() => {
    const filterProducts = products.filter(product => {
      const matchesActive = showActiveOnly ? product.Active : true;
      const matchesSold = showSoldOnly ? !product.Sold : true;
      return matchesActive && matchesSold;
    });
    setFilteredProducts(filterProducts);
  }, [showActiveOnly, showSoldOnly, products]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setShowActiveOnly(event.target.checked);
  };

  const handleCheckboxSoldChange = (event) => {
    setShowSoldOnly(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      // Se o campo de pesquisa estiver vazio, buscar todos os produtos
      fetchProducts();
    } else {
      // Caso contrário, buscar produtos que correspondem ao termo de pesquisa
      try {
        const response = await axios.get(`${baseURL}/productsearch/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const searchedproducts = response.data;
        setProducts(searchedproducts);
        setFilteredProducts(searchedproducts.filter(product => product.Active || !showActiveOnly) && searchedproducts.filter(product => !product.Sold || !showSoldOnly));
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
          setProducts([]);
          setFilteredProducts([]);
          const errorMessage = error.response?.data?.error || "Nenhum produto encontrado.";
          setDialogStatus('error');
          setDialogMessage(errorMessage);
          setDialogOpen(true);
        }
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
            <ProductionQuantityLimitsIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Pesquisa de Produtos
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="searchTerm"
              label="Pesquisar Produtos"
              name="searchTerm"
              autoComplete="searchTerm"
              autoFocus
              value={searchTerm}
              onChange={handleChange}
              placeholder="Digite o nome, grupo, subgrupo, loja ou fornecedor do produto"
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
              label="Mostrar somente produtos ativos"
              sx={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showSoldOnly}
                  onChange={handleCheckboxSoldChange}
                  name="showSoldOnly"
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
              label="Ocultar produtos vendidos"
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
            {filteredproducts.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 350, overflowY: 'auto', overflowX: 'auto', border: "1px solid #ccc", borderRadius: "8px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 50 }}>Id</TableCell>
                      <TableCell sx={{ minWidth: 130 }}>Nome</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>% Cliente</TableCell>
                      <TableCell sx={{ minWidth: 50 }}>Venda</TableCell>
                      {/* <TableCell sx={{ minWidth: 150 }}>Cliente</TableCell> */}
                      <TableCell sx={{ minWidth: 80 }}>Loja</TableCell>
                      <TableCell sx={{ minWidth: 30 }}>Grupo</TableCell>
                      <TableCell sx={{ minWidth: 40 }}>SubGrupo</TableCell>
                      <TableCell>Vendido</TableCell>
                      <TableCell>Ativo</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredproducts.map((product) => (
                      <TableRow key={product.IdProduct}>
                        <TableCell>{product.IdProduct}</TableCell>
                        <TableCell>{product.ProductName}</TableCell>
                        <TableCell>{product.CostPrice.toFixed('2')}</TableCell>
                        <TableCell>{product.SalePrice.toFixed('2')}</TableCell>
                        <TableCell>{product.ClientSupplierName}</TableCell>
                        {/* <TableCell>{product.StoreName}</TableCell> */}
                        <TableCell>{product.GroupName}</TableCell>
                        <TableCell>{product.SubGroupName}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={!!product.Sold}
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
                            checked={!!product.Active}
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
                            to={`/updateproduct/${product.IdProduct}`}
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

export default SearchProduct;
