import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import PaidIcon from '@mui/icons-material/Paid';
import DialogMessage from '../../../utils/dialogMessage';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../../styles/index.css';
import validator from '../../../utils/inputsValidator.js';
import { baseURL } from '../../config.js';

const theme = createTheme();

function CreateAccountsPayable() {
    // Hooks para navegação e autenticação
    const { logout } = useAuth();
    const navigate = useNavigate();
    // Recupera o token de autenticação salvo no localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    // Estado inicial do formulário
    const [formData, setFormData] = useState({
        amount: "",
        idclient: "",
        idsale: "",
        idstore: "",
        duedate: "",
        note: ""
    });

    // Estados para armazenar os dados de clientes e lojas, além do status de diálogos
    const [clients, setClients] = useState([]);
    const [stores, setStores] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    // useEffect é utilizado para buscar os dados de clientes e lojas assim que o componente é montado
    useEffect(() => {
        const fetchStores = async () => {
            try {
                // Faz uma requisição para obter as lojas cadastradas
                const response = await axios.get(`${baseURL}/store`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStores(response.data);
            } catch (error) {
                console.error("Error fetching store", error);
                // Caso o erro seja de autenticação, exibe uma mensagem e faz o logout
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
                // Faz uma requisição para obter os clientes cadastrados
                const response = await axios.get(`${baseURL}/client`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setClients(response.data);
            } catch (error) {
                console.error("Error fetching client", error);
                // Caso o erro seja de autenticação, exibe uma mensagem e faz o logout
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
        // Chama as funções para buscar dados de clientes e lojas
        fetchClients();
        fetchStores();
    }, [token, logout]);

    // Atualiza o estado do formulário sempre que um campo for alterado
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Função para validar e enviar os dados do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Valida o valor do campos de entrada
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

            // Faz a requisição para cadastrar uma nova conta a pagar
            const response = await axios.post(`${baseURL}/payable`, { ...formData }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // Se a requisição for bem-sucedida, exibe uma mensagem de sucesso
            const successMessage = response.data || "Conta a pagar cadastrada com sucesso!";
            setFormData({
                amount: "",
                idclient: "",
                idstore: "",
                duedate: "",
                note: ""
            });
            setDialogStatus('success');
            setDialogMessage(successMessage);
            setDialogOpen(true);
        } catch (error) {
            console.log(error);
            // Se a sessão expirar, faz o logout e exibe uma mensagem
            if (error.response && error.response.status === 401) {
                const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
                setTimeout(() => {
                    logout();
                }, 4000);
            } else {
                // Exibe uma mensagem de erro genérica caso a requisição falhe
                const errorMessage = error.response?.data?.errors || "Erro ao cadastrar conta a pagar.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
            }
        }
    };

    // Função para voltar para a tela de gerenciamento
    const handleVoltar = () => {
        navigate("/manager");
    };

     // Fecha o diálogo de mensagem
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
                        Cadastro de Conta a Pagar
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

export default CreateAccountsPayable;
