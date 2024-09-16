import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Define o componente funcional DialogMessage que exibe um diálogo com uma mensagem
const DialogMessage = ({ open, onClose, status, message }) => {
    // Função auxiliar que retorna o ícone apropriado com base no status recebido
    const getIcon = () => {
        switch (status) {
            // Se o status for 'success', retorna o ícone de sucesso com estilo verde
            case 'success':
                return <CheckCircleIcon sx={{ fontSize: 24, color: 'green', mr: 1 }} />;
            // Se o status for 'error', retorna o ícone de erro com estilo vermelho     
            case 'error':
                return <ErrorIcon sx={{ fontSize: 24, color: 'red', mr: 1 }} />;
            // Se o status não for 'success' ou 'error', não retorna nenhum ícone
            default:
                return null;
        }
    };

    return (
        // O componente Dialog é controlado pela prop 'open' e fecha quando 'onClose' é chamado
        <Dialog open={open} onClose={onClose}>
            {/* Título do diálogo, inclui o ícone e a mensagem de status */}
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: '#333', fontWeight: 'bold' }}>
                {/* Exibe o ícone baseado no status */}
                {getIcon()}
                {/* Texto do título baseado no status (Sucesso ou Erro) */}
                <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                    {status === 'success' ? 'Sucesso' : 'Erro'}
                </Typography>
            </DialogTitle>

            {/* Conteúdo do diálogo, onde a mensagem é exibida */}
            <DialogContent sx={{ color: '#555' }}>
                <Typography>{message}</Typography>
            </DialogContent>
            {/* Ações do diálogo (neste caso, apenas o botão de fechar) */}
            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={onClose} color='success'>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogMessage;
