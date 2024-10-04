import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress } from '@mui/material';
import { baseURL } from '../../config.js';


function Report() {
    // Estados para armazenar os dados do mês, ano, PDF e URL de download
    const [report, setReport] = useState('');
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    // Recupera o token do usuário do localStorage
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    const handleChange = (event) => {
        const { value } = event.target;
        setReport(value);
    }

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${baseURL}/${report}`, {
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
                                <MenuItem value="productclient">Produtos por Cliente</MenuItem>
                            </Select>

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

export default Report;
