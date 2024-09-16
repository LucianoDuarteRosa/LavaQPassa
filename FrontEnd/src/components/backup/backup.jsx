import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Importa o CircularProgress
import { baseURL } from '../../config.js';
import DialogMessage from '../../../utils/dialogMessage';
import { useAuth } from '../login/authContext';

function Backup() {
    // Hook para gerenciar o logout do usuário
    const { logout } = useAuth();

    // Hooks para gerenciar o estado do diálogo
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    // Estado para controlar o carregamento
    const [isLoading, setIsLoading] = useState(false);

    // Recupera o token do usuário armazenado no localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    // Função para lidar com o envio do formulário de backup
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Mostra o indicador de carregamento
        try {
            const response = await axios.get(`${baseURL}/backup`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // Define a mensagem de sucesso e abre o diálogo
            const successMessage = response.data || "Backup feito com sucesso!";
            setDialogStatus('success');
            setDialogMessage(successMessage);
            setDialogOpen(true);
        } catch (error) {
            console.log(error);
            // Verifica se a resposta de erro indica uma sessão expirada
            if (error.response && error.response.status === 401) {
                const errorMessage = "Sessão expirada. Você será redirecionado para a tela de login.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
                setTimeout(() => {
                    logout();
                }, 4000);
            } else {
                // Define a mensagem de erro e abre o diálogo
                const errorMessage = error.response?.data?.errors || "Erro ao cadastrar conta a pagar.";
                setDialogStatus('error');
                setDialogMessage(errorMessage);
                setDialogOpen(true);
            }
        } finally {
            setIsLoading(false); // Esconde o indicador de carregamento após a conclusão
        }
    };

    // Função para fechar o diálogo de feedback
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box className='sidebar'>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }} >
                <Box className="box-month-payment">
                    <Box
                        className="box-manager-user"
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            marginTop: '20px',
                        }}
                    >
                        <Typography variant="h5" className='dashboard-title-barchart'>Backup</Typography>

                        {/* Mostra o indicador de carregamento enquanto está fazendo o backup */}
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Button variant="contained" color="primary" type="submit"
                                className='primary-button' sx={{ width: '40%' }}
                                disabled={isLoading} // Desabilita o botão enquanto está carregando
                            >
                                Fazer Backup
                            </Button>
                        )}
                    </Box>

                </Box>
            </Box>
            <DialogMessage
                open={dialogOpen}
                onClose={handleCloseDialog}
                status={dialogStatus}
                message={dialogMessage}
            />
        </Box>
    );
}

export default Backup;
