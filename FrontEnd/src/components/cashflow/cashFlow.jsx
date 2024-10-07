import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import SavingsIcon from '@mui/icons-material/Savings';
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


function CashFlow() {
    // Hook para obter a função de logout
    const { logout } = useAuth();
    // Hook para navegação
    const navigate = useNavigate();

    // Estados para armazenar os dados da pesquisa e os filtros
    const [cashFlow, setCashFlow] = useState([]);
    const [month, setStartDate] = useState('');
    const [year, setEndDate] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const location = useLocation();
    const isHomePage = location.pathname === "/"

    // Recupera o token do usuário armazenado no localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";


    // Função para buscar contas a receber do backend
    const fetchCashFlow = async () => {
        try {
            const date = { month: month, year: year };
            const response = await axios.post(`${baseURL}/cashflow`, { ...date }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCashFlow(response.data);
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
                setCashFlow([]);
                const errorMessage = error.response?.data?.error || "Erro ao carregar lançamentos do fluxo de caixa.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
            }
        }
    };

    // Busca contas a receber quando o componente é montado
    useEffect(() => {
        fetchCashFlow();
    }, [token]);


    // Função para atualizar as datas de início e fim dos filtros
    const handleDateChange = (event) => {
        if (event.target.name === 'month') {
            setStartDate(event.target.value);
        } else {
            setEndDate(event.target.value);
        }
    };

    // Função para buscar contas a receber com base no termo de pesquisa
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const date = { month: month, year: year };
            console.log(date);
            const response = await axios.put(`${baseURL}/cashflowsearch`, { ...date }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCashFlow(response.data);
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
                setCashFlow([]);
                const errorMessage = error.response?.data?.error || "Nenhuma lançamento de fluxo de caixa encontrado.";
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
            <Container className="box-container-search">
                <Box className="box-manager-search">
                    <Avatar className='avatar'>
                        <SavingsIcon className='avatar' />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Fluxo de Caixa
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%', margin: '0 auto', textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TextField
                                className="textfield-product"
                                margin="normal"
                                fullWidth
                                id="month"
                                name="month"
                                label="Mês"
                                type="number"
                                color="success"
                                value={month}
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
                                    maxWidth: 120, display: 'inline-block', mx: 1
                                }}
                            />
                            <TextField
                                className="textfield-product"
                                margin="normal"
                                fullWidth
                                id="year"
                                name="year"
                                label="Ano"
                                type="number"
                                color="success"
                                value={year}
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
                                    maxWidth: 120, display: 'inline-block', mx: 1
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                className='primary-button-cashflow'
                                sx={{ width: '10%' }}
                            >
                                Buscar
                            </Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ mt: 2, width: "100%", maxWidth: '100%', maxHeight: 350 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 30 }}>Id</TableCell>
                                        <TableCell sx={{ minWidth: 70 }}>Origem</TableCell>
                                        <TableCell sx={{ minWidth: 100 }}>Descrição</TableCell>
                                        <TableCell sx={{ minWidth: 60 }}>Valor</TableCell>
                                        <TableCell sx={{ minWidth: 60 }}>Acumulado</TableCell>
                                        <TableCell sx={{ minWidth: 100 }}>Regristro</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cashFlow.map((cashFlow) => (
                                        <TableRow key={cashFlow.IdCashFlow}>
                                            <TableCell>{cashFlow.IdCashFlow}</TableCell>
                                            <TableCell>{cashFlow.Origin}</TableCell>
                                            <TableCell>{cashFlow.Description}</TableCell>
                                            <TableCell>{cashFlow.Amount.toFixed('2')}</TableCell>
                                            <TableCell>{cashFlow.Accumulated.toFixed('2')}</TableCell>
                                            <TableCell>{converter.convertToBrazilianDate(cashFlow.RegistrationDate)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 0, width: '100%', maxWidth: 600 }}>
                        {!isHomePage && (
                            <Button
                                className='primary-button'
                                sx={{ width: '53%' }}
                                fullWidth
                                variant="contained"
                                onClick={handleVoltar}
                            >
                                Voltar
                            </Button>
                        )}
                    </Box>
                    <DialogMessage
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        status={dialogStatus}
                        message={dialogMessage}
                    />
                    <Box>
                        <TextField
                            className="textfield-product"
                            margin="normal"
                            fullWidth
                            id="acumulatedStart"
                            name="acumulatedStart"
                            label="Saldo Inicial"
                            type="number"
                            color="success"
                            disabled
                            value={cashFlow.length > 0 ? cashFlow[0].Accumulated.toFixed(2) : ''}
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
                                maxWidth: 150, display: 'inline-block', mx: 1
                            }}
                        />
                        <TextField
                            className="textfield-product"
                            margin="normal"
                            fullWidth
                            disabled
                            id="acumulatedEnd"
                            name="acumulatedEnd"
                            label="Saldo Final"
                            type="number"
                            color="success"
                            value={cashFlow.length > 0 ? cashFlow[cashFlow.length - 1].Accumulated.toFixed(2) : ''}
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
                                maxWidth: 150, display: 'inline-block', mx: 1
                            }}
                        />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CashFlow;
