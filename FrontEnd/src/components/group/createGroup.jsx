import React, { useState } from "react";
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
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import '../../styles/index.css';
import { baseURL } from '../../config.js';

const theme = createTheme();

function CreateGroup() {
    // Obtém a função de logout do hook useAuth
    const { logout } = useAuth();
    // Obtém a função de navegação do hook useNavigate
    const navigate = useNavigate();

    // Obtém o token do usuário do localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        name: "",
    });

    // Estado para controlar a exibição do diálogo
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    // Função para lidar com mudanças nos campos do formulário
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Array para armazenar erros de validação
            const errors = [];
            // Valida o campo name usando um validador
            const testName = validator.allValidator(formData.name, 2, 15);

            if (testName !== true) {
                errors.push(testName);
            }
            if (errors.length > 0) {
                setDialogStatus('error');
                setDialogMessage(errors);
                return;
            }

            // Envia os dados do formulário para a API
            const response = await axios.post(`${baseURL}/group`, { ...formData }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Mensagem de sucesso, ou uma mensagem padrão se não houver resposta
            const successMessage = response.data || "Grupo cadastrado com sucesso!";
            setFormData({
                name: ""
            });
            setDialogStatus('success');
            setDialogMessage(successMessage);
            setDialogOpen(true);
        } catch (error) {
            console.log(error);
            // Se o erro for uma resposta 401 (não autorizado), mostra mensagem e redireciona para login
            if (error.response && error.response.status === 401) {
                const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
                setTimeout(() => {
                    logout();
                }, 4000);
            } else {
                // Define a mensagem de erro do diálogo com base na resposta da API ou uma mensagem padrão
                const errorMessage = error.response?.data?.errors || "Erro ao cadastrar grupo.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
            }
        }
    };

    // Função para navegar de volta à página de gerenciamento
    const handleVoltar = () => {
        navigate("/manager");
    };

    // Função para fechar o diálogo
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container className="box-container">
                <CssBaseline />
                <Box className="box-manager-user">
                    <Avatar className='avatar'>
                        <AccountTreeIcon className='avatar' />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cadastro de Grupo
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                        <Box className="box-manager-button">
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

export default CreateGroup;
