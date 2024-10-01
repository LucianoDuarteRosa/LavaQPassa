import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext.jsx';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PaidIcon from '@mui/icons-material/Paid';
import DialogMessage from '../../../utils/dialogMessage.jsx';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import '../../styles/index.css';
import validator from '../../../utils/inputsValidator.js';
import converter from "../../../utils/converter.js";
import { baseURL } from '../../config.js';

const theme = createTheme();

function CreateSale() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/"


    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    const [formData, setFormData] = useState({
        idclient: "",
        idstore: "",
        saledate: "",
        paymentcondition: "",
        amount: ""
    });

    const [paymentCondition, setPaymentCondition] = useState(formData.paymentcondition);
    const [clientSelectEnabled, setClientSelectEnabled] = useState(formData.paymentcondition === 'Crediário' || formData.paymentcondition === 'Cheque');
    const [products, setProducts] = useState([]);
    const [sale, setSales] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [stores, setStores] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);


    useEffect(() => {
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

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/productsale`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.warn("Resposta vazia ou formato inesperado", response.data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching product sale", error);
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

        const fetchSales = async () => {
            try {
                const response = await axios.get(`${baseURL}/sale`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                let position = response.data.length - 1;
                position = response.data[position].IdSale + 1

                setSales({
                    idsale: position,
                    saledate: converter.convertToDateTimeLocalFormat(converter.toMySQLDate())
                });
            } catch (error) {
                console.error("Error fetching sale", error);
                setSales({
                    idsale: 1,
                    saledate: converter.convertToDateTimeLocalFormat(converter.toMySQLDate())
                });
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

        fetchProducts();
        fetchSales();
        fetchClients();
        fetchStores();
    }, [token, logout, formData]);

    useEffect(() => {
        const filtered = products
            .filter(product =>
                !selectedProducts.some(selected => selected.IdProduct === product.IdProduct)
            )
            .filter(product =>
                product.ProductName.toLowerCase().includes(searchProduct.toLowerCase()) ||
                product.IdProduct.toString().includes(searchProduct)
            );
        setFilteredProducts(filtered);
    }, [searchProduct, products, selectedProducts]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleProductSelect = (product) => {
        setSelectedProducts(prevProducts => [...prevProducts, product]);

        const newAmount = (parseFloat(formData.amount) || 0) + product.SalePrice;
        setFormData(prevFormData => ({
            ...prevFormData,
            amount: newAmount.toFixed(2)
        }));

        // Fechar o diálogo
        setProductDialogOpen(false);
    };

    const handlePaymentConditionChange = (e) => {
        const selectedValue = e.target.value;
        setPaymentCondition(selectedValue);
        setClientSelectEnabled(selectedValue === 'Crediário' || selectedValue === 'Cheque');
        handleChange(e);
    };

    const handleProductSearch = (e) => {
        setSearchProduct(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {


            if (selectedProducts.length === 0) {
                setDialogStatus('error');
                setDialogMessage('Adicione produtos à venda.');
                return;
            }

            const errors = [];

            let testClient = true;
            const idClientValue = String(formData.idclient).trim();
            if (idClientValue !== "") {
                testClient = validator.integerValidator(formData.idclient);
            }

            const testAmount = validator.floatValidator(formData.amount);
            const testIdStore = validator.integerValidator(formData.idstore);
            formData.saledate = converter.convertToMySQLDate(sale.saledate)


            if (testAmount !== true) {
                errors.push(testAmount);
            }
            if (testClient !== true) {
                errors.push(testClient);
            }
            if (testIdStore !== true) {
                errors.push(testIdStore);
            }

            if (errors.length > 0) {
                setDialogStatus('error');
                setDialogMessage(errors.join('\n'));
                setDialogOpen(true);
                return;
            }

            const response = await axios.post(`${baseURL}/sale`, { ...formData, products: selectedProducts }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const successMessage = response.data || "Venda cadastrada com sucesso!";
            setFormData({
                idclient: "",
                idstore: "",
                saledate: "",
                paymentcondition: "",
                amount: ""
            });
            setSelectedProducts([]);
            setDialogStatus('success');
            setDialogMessage(successMessage);
            setDialogOpen(true);
            setSales({
                idsale: sale.idsale + 1,
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
                const errorMessage = error.response?.data?.errors || "Erro ao cadastrar venda.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
            }
        }
    };

    const handleVoltar = () => {
        navigate("/manager");
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenProductDialog = () => {
        setProductDialogOpen(true);
    };

    const handleCloseProductDialog = () => {
        setProductDialogOpen(false);
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
                        Cadastro de Venda
                    </Typography>
                    <Box sx={{ display: "flex", gap: '10px', flexDirection: 'column' }}>
                        <Box sx={{ display: "flex", gap: '10px' }}>
                            <Box sx={{ mt: 1 }} className="box-manager-sale-main">
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <TextField
                                        className="textfield-product"
                                        margin="normal"
                                        disabled
                                        type="number"
                                        fullWidth
                                        name="idsale"
                                        autoComplete="idsale"
                                        value={parseInt(sale.idsale) || ''}
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
                                        fullWidth
                                        disabled
                                        name="amount"
                                        autoComplete="amount"
                                        value={formData.amount || ''}
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
                                        margin="normal"
                                        type="datetime-local"
                                        disabled
                                        name="saledate"
                                        autoComplete="saledate"
                                        value={sale.saledate || ''}
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
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <Select
                                        required
                                        name="idstore"
                                        value={formData.idstore || ''}
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
                                        name="paymentcondition"
                                        value={paymentCondition || ''}
                                        onChange={handlePaymentConditionChange}
                                        fullWidth
                                        displayEmpty
                                        color="success"
                                        sx={{ mt: '10px' }}
                                    >
                                        <MenuItem value="">Forma de pagamento</MenuItem>
                                        <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                                        <MenuItem value="Cartão Crédito">Cartão Crédito</MenuItem>
                                        <MenuItem value="Cartão Débito">Cartão Débito</MenuItem>
                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                        <MenuItem value="Crediário">Crediário</MenuItem>
                                    </Select>

                                    <Select
                                        disabled={!clientSelectEnabled}
                                        name="idclient"
                                        value={formData.idclient || ''}
                                        onChange={handleChange}
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
                                        <MenuItem value="">
                                            <em>Selecione um Cliente</em>
                                        </MenuItem>
                                        {clients.map(client => (
                                            <MenuItem key={client.IdClientSupplier} value={client.IdClientSupplier}>
                                                {client.ClientSupplierName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 0, padding: 3 }} className="box-manager-product">
                            <Button
                                variant="contained"
                                className='primary-button'
                                onClick={() => setProductDialogOpen(true)}
                                sx={{ width: 'auto' }}
                            >
                                Incluir Produto
                            </Button>
                            <Box mt={2}>
                                <Typography variant="h5" sx={{ textAlign: 'center' }}>Produtos Adicionados</Typography>
                                <TableContainer component={Paper} sx={{ width: "100%", maxWidth: '100%', maxHeight: 220, minHeight: 220, margin: '5px' }}>
                                    <Table sx={{ minWidth: 600 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><Typography variant="h6" sx={{ width: '80px' }}>Id</Typography></TableCell>
                                                <TableCell><Typography variant="h6" sx={{ width: '250px' }}>Nome</Typography></TableCell>
                                                <TableCell><Typography variant="h6" sx={{ width: '50px' }}>Valor</Typography></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedProducts.map(product => (
                                                <TableRow key={product.IdProduct}>
                                                    <TableCell>{product.IdProduct}</TableCell>
                                                    <TableCell>{product.ProductName}</TableCell>
                                                    <TableCell>{parseFloat(product.SalePrice).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="box-manager-button" sx={{ width: '50%' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            className='primary-button'
                        >
                            Cadastrar
                        </Button>
                        {!isHomePage && (
                            <Button
                                variant="contained"
                                fullWidth
                                className='primary-button'
                                onClick={handleVoltar}
                            >
                                Voltar
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{dialogStatus === 'success' ? 'Sucesso' : 'Erro'}</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Fechar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={productDialogOpen} onClose={handleCloseProductDialog}>
                <DialogTitle>Adicionar Produto</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="productSearch"
                        label="Pesquisar Produto"
                        type="text"
                        fullWidth
                        value={searchProduct}
                        onChange={handleProductSearch}
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
                    <Box>
                        <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 350, minHeight: 350, margin: '5px' }}>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography variant="h6" sx={{ width: '50px' }}>Id</Typography></TableCell>
                                        <TableCell><Typography variant="h6" sx={{ width: '200px' }}>Nome</Typography></TableCell>
                                        <TableCell><Typography variant="h6" sx={{ width: '40px' }}>Valor</Typography></TableCell>
                                        <TableCell><Typography variant="h6" sx={{ width: '40px' }}>Ação</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts.map(product => (
                                        <TableRow key={product.IdProduct}>
                                            <TableCell>{product.IdProduct}</TableCell>
                                            <TableCell>{product.ProductName}</TableCell>
                                            <TableCell>{parseFloat(product.SalePrice).toFixed(2)}</TableCell>
                                            <TableCell sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', gap: '5px' }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleProductSelect(product)}
                                                >
                                                    Adicionar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="success" onClick={handleCloseProductDialog}>Fechar</Button>
                </DialogActions>
            </Dialog>
            <DialogMessage
                open={dialogOpen}
                onClose={handleCloseDialog}
                status={dialogStatus}
                message={dialogMessage}
            />
        </ThemeProvider >
    );
}

export default CreateSale;
