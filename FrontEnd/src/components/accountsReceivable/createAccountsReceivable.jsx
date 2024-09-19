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
import '../../styles/index.css';
import validator from '../../../utils/inputsValidator.js';
import { baseURL } from '../../config.js';

const theme = createTheme();

function CreateAccountsReceivable() {
    // Hook para obter a função de logout e redirecionar
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/"

    // Recupera o token do usuário armazenado no localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        amount: "",
        idclient: "",
        idsale: "",
        idstore: "",
        duedate: "",
        note: ""
    });

    // Estados para armazenar os dados de clientes e lojas
    const [clients, setClients] = useState([]);
    const [stores, setStores] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    // Efeito para buscar clientes e lojas ao montar o componente
    useEffect(() => {
        const fetchStores = async () => {
            try {
                // Requisição para obter as lojas
                const response = await axios.get(`${baseURL}/store`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Atualiza o estado com as lojas
                setStores(response.data);
            } catch (error) {
                console.error("Error fetching store", error);
                // Mensagem e redirecionamento para login se a sessão expirar
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

        fetchClients();
        fetchStores();
    }, [token, logout]);

    // Função para lidar com mudanças nos campos do formulário
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Valida os dados do formulário
            const errors = [];
            const testAmount = validator.floatValidator(formData.amount);
            const testIdClientSupplier = validator.integerValidator(formData.idclient);
            const testIdStore = validator.integerValidator(formData.idstore);
            const testDueDate = validator.dateValidator(formData.duedate);
            let testNote = true;
            if (formData.note !== null) {
                testNote = validator.allValidator(formData.note, 0, 255);
            }
            let testIdSale = true;
            const idSaleValue = String(formData.idsale).trim();

            const today = new Date().toISOString().split('T')[0];
            if (formData.duedate < today) {
                errors.push("A data de vencimento não pode ser anterior à data atual.");
            }

            if (idSaleValue !== "") {
                testIdSale = validator.integerValidator(idSaleValue);
            }

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
            if (testIdSale !== true) {
                errors.push(testIdSale);
            }
            if (testDueDate !== true) {
                errors.push(testDueDate);
            }
            if (errors.length > 0) {
                setDialogStatus('error');
                setDialogMessage(errors.join('\n'));
                setDialogOpen(true);
                return;
            }

            const response = await axios.post(`${baseURL}/receivable`, { ...formData }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const successMessage = response.data || "Conta a receber cadastrada com sucesso!";
            setFormData({
                amount: "",
                idclient: "",
                idsale: "",
                idstore: "",
                duedate: "",
                note: ""
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
                const errorMessage = error.response?.data?.errors || "Erro ao cadastrar conta a receber.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
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
            <Container className="box-container-product">
                <CssBaseline />
                <Box className="box-manager-product" component="form" onSubmit={handleSubmit} >
                    <Avatar className='avatar'>
                        <PaidIcon className='avatar' />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cadastro de Conta a Receber
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
                                autoFocus
                                fullWidth
                                margin="normal"
                                type="date"
                                required
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

export default CreateAccountsReceivable;
