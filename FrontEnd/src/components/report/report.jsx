import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress } from '@mui/material';
import { baseURL } from '../../config.js';
import { useAuth } from '../login/authContext.jsx';
import DialogMessage from '../../../utils/dialogMessage.jsx';


function Report() {
    // Estados para armazenar os dados do mês, ano, PDF e URL de download
    const [report, setReport] = useState('');
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [idClient, setIdClient] = useState('')
    const [clientName, setClientName] = useState('')
    const [clients, setClients] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState('');
    const { logout } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    // Recupera o token do usuário armazenado no localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    useEffect(() => {
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
    }, [token, logout]);

    const handleChange = (event) => {
        const { value, name } = event.target;
        if (name === 'report') {
            setReport(value);
        } else if (name === 'idClient') {
            setIdClient(value);
            const selectedClient = clients.find(client => client.IdClientSupplier === value);
            if (selectedClient) {
                setClientName(selectedClient.ClientSupplierName);
            }
        }
    }

    // Função para fechar o diálogo de mensagem
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        const client = { idClient: idClient, name: clientName };
        try {
            const response = await axios.post(`${baseURL}/${report}`, client, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob'
            });

            // Create URL for PDF
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            // Set download URL for download button
            setDownloadUrl(fileURL);

            // Display the PDF in the iframe
            setPdfData(fileURL);

            // Hide the form after download
            setLoading(false);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Houve um erro ao gerar o PDF. Tente novamente.');
            setLoading(false);
        }
    };

    // Efeito colateral para revogar a URL do Blob quando o componente for desmontado
    React.useEffect(() => {
        return () => {
            if (pdfData) {
                URL.revokeObjectURL(pdfData);
            }
        };
    }, [pdfData]);

    return (
        <Box className='sidebar'>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }} >
                {!pdfData ? (
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
                            <Typography variant="h5" className='dashboard-title-barchart'>Gerar Relatórios</Typography>
                            <Select
                                required
                                name="report"
                                value={report || ''}
                                onChange={handleChange}
                                fullWidth
                                displayEmpty
                                color="success"
                                sx={{ mt: '10px' }}
                            >
                                <MenuItem value="">Escolha um relatório</MenuItem>
                                <MenuItem value="reportproduct">Produtos por Cliente</MenuItem>
                            </Select>

                            {report === 'reportproduct' && (
                                <Select
                                    required
                                    name="idClient"
                                    value={idClient || ''}
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
                            )}

                            <Button variant="contained" color="primary" type="submit" disabled={loading}
                                className='primary-button' sx={{ width: '30%' }}>
                                {loading ? <CircularProgress size={24} /> : 'Gerar PDF'}
                            </Button>
                        </Box>

                    </Box>
                ) : (
                    <Box className="box-month-payment-pdf">
                        <Box className="box-month-payment-pdf-report">
                            <Typography variant="h5" className='dashboard-title-barchart'>Relatório:</Typography>
                            <iframe
                                src={pdfData}
                                title="PDF Preview"
                            />
                            <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                                {/* Download button */}
                                <Button
                                    variant="contained"
                                    href={downloadUrl}
                                    download={`relatorio-${name}.pdf`}
                                    className='primary-button' sx={{ width: '15%', marginRight: '20px' }}
                                >
                                    Baixar PDF
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setPdfData(null)}
                                    className='primary-button' sx={{ width: '15%' }}
                                >
                                    Voltar
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
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

export default Report;
