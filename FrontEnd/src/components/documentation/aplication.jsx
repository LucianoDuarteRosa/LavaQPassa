import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../login/authContext';
import { baseURL } from '../../config.js';


function MonthPayment() {
    const { logout } = useAuth();
    const [pdfData, setPdfData] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState('');

    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";
    console.log(token)

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                console.log(token)
                const response = await axios.get(`${baseURL}/document`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    responseType: 'blob'
                });

                // Create URL for PDF
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                setDownloadUrl(fileURL);
                setPdfData(fileURL);

            } catch (error) {
                console.error('Error downloading PDF:', error);
                alert('Houve um erro ao abir o PDF. Tente novamente.');
            }
        };
        fetchDocument();
    }, [token, logout]);

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
                <Box className="box-month-payment-pdf">
                    <Box className="box-month-payment-pdf-report">
                        <Typography variant="h5" className='dashboard-title-barchart'>Documentação:</Typography>
                        <iframe
                            src={pdfData}
                            title="PDF Preview"
                        />
                        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                            {/* Download button */}
                            <Button
                                variant="contained"
                                href={downloadUrl}
                                download={`DocumentacaoAplicacao.pdf`}
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
            </Box>
        </Box>
    );
}

export default MonthPayment;
