import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import { baseURL } from '../../config.js';


function MonthPayment() {
    // Estados para armazenar os dados do mês, ano, PDF e URL de download
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    // Recupera o token do usuário do localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Valida o mês e o ano
        if (month < 1 || month > 12) {
            alert('O mês deve estar entre 1 e 12.');
            return;
        }
        if (year <= 0) {
            alert('O ano deve ser um valor positivo.');
            return;
        }
        // Prepara os dados para envio
        let date = { month: month, year: year };
        try {
            const response = await axios.post(`${baseURL}/report`, { ...date }, {
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
                            <Typography variant="h5" className='dashboard-title-barchart'>Gerar Relatório em PDF</Typography>
                            <TextField
                                margin="normal"
                                required
                                label="Mês"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                inputProps={{ min: 1, max: 12 }}
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
                                margin="normal"
                                required
                                label="Ano"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
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
                                    download={`relatorio-${month}-${year}.pdf`}
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
        </Box>
    );
}

export default MonthPayment;
