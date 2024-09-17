import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DialogMessage from '../../../utils/dialogMessage';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../../styles/index.css';
import validator from '../../../utils/inputsValidator';
import { baseURL } from '../../config.js';

const theme = createTheme();

function CreateProduct() {
    // Obtém as funções de autenticação e navegação
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/"

    // Recupera o token do usuário do localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    // Estados para armazenar os dados do formulário, listas de opções e mensagens de diálogo
    const [formData, setFormData] = useState({
        idProduct: "",
        name: "",
        costprice: "",
        saleprice: "",
        idclient: "",
        idgroup: "",
        idsubgroup: "",
        idstore: ""
    });

    // Lista de entidades e armazenar variaveis de calculos
    const [products, setProducts] = useState([]);
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

    // Efeito colateral para buscar dados ao montar o componente
    useEffect(() => {
        // Função para buscar grupos
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

        // Função para buscar subgrupos
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

        // Função para buscar produtos e definir o próximo ID do produto
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/product`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                let position = response.data.length - 1;

                setProducts({
                    idProduct: response.data[position].IdProduct + 1,
                });
            } catch (error) {
                console.error("Error fetching product", error);
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

        // Chama as funções de busca de dados
        fetchProducts();
        fetchClients();
        fetchStores();
        fetchSubGroup();
        fetchGroup();
    }, [token, logout]);

    // Efeito colateral para filtrar subgrupos com base no grupo selecionado
    useEffect(() => {
        if (selectedGroup) {
            setFilteredSubGroups(subGroups.filter(subGroup => subGroup.IdGroup === selectedGroup));
        } else {
            setFilteredSubGroups([]);
        }
    }, [selectedGroup, subGroups]);

    // Efeito colateral para calcular o percentual com base no preço de venda e custo
    useEffect(() => {
        const calculatePercentage = () => {
            const saleprice = parseFloat(formData.saleprice);
            const costprice = saleprice * 0.4;
            const percentage = 60;

            if (!isNaN(saleprice)) {
                formData.costprice = costprice
                setCostPrice(costprice.toFixed(2));
                setPercentage(percentage.toFixed(2) + '%');
            } else {
                setPercentage('');
                setCostPrice('');

            }
        };

        calculatePercentage();
    }, [formData.costprice, formData.saleprice]);

    // Função para lidar com mudanças nos campos do formulário
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));


        if (name === "idgroup") {
            setSelectedGroup(value);
            setFormData(prevFormData => ({
                ...prevFormData,
                idsubgroup: ""
            }));
        }
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Valida os dados do formulário
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

            const response = await axios.post(`${baseURL}/product`, { ...formData }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const successMessage = response.data || "Produto cadastrado com sucesso!";
            setFormData({
                idProduct: "",
                name: "",
                costprice: "",
                saleprice: "",
                isclient: "",
                idgroup: "",
                idsubgroup: "",
                idstore: ""
            });
            setDialogStatus('success');
            setDialogMessage(successMessage);
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
                const errorMessage = error.response?.data?.errors || "Erro ao cadastrar produto.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
            }

        }
    };

    // Função para navegar de volta à página anterior
    const handleVoltar = () => {
        navigate("/manager");
    };

    // Função para fechar o diálogo
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container className="box-container-product">
                <CssBaseline />
                <Box className="box-manager-product" component="form" onSubmit={handleSubmit} >
                    <Avatar className='avatar'>
                        <ProductionQuantityLimitsIcon className='avatar' />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cadastro de Produto
                    </Typography>
                    <Box sx={{ display: "flex", gap: '10px' }}>
                        <Box sx={{ mt: 1 }} className="box-manager-product-main">
                            <TextField
                                margin="normal"
                                disabled
                                fullWidth
                                label="Código do Produto"
                                name="idProduct"
                                autoComplete="naidProductme"
                                autoFocus
                                value={products.idProduct || ''}
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
                                    value={costprice}
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
                            <Select
                                required
                                name="idgroup"
                                value={formData.idgroup}
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
                                disabled={!selectedGroup}
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
                    </Box>
                    <Box className="box-manager-button" sx={{ width: '60%' }}>
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
            <DialogMessage
                open={dialogOpen}
                onClose={handleCloseDialog}
                status={dialogStatus}
                message={dialogMessage}
            />
        </ThemeProvider>
    );
}

export default CreateProduct;
