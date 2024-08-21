import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const DialogMessage = ({ open, onClose, status, message }) => {
    const getIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon sx={{ fontSize: 24, color: 'green', mr: 1 }} />;
            case 'error':
                return <ErrorIcon sx={{ fontSize: 24, color: 'red', mr: 1 }} />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: '#333', fontWeight: 'bold' }}>
                {getIcon()}
                <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                    {status === 'success' ? 'Sucesso' : 'Erro'}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ color: '#555' }}>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={onClose} sx={{ color: '#007bff' }}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogMessage;
