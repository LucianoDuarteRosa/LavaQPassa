import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';


function MonthPayment() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');

    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    const handleDownloadPdf = async () => {
        let date = { month: month, year: year };

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/report', { date }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleDownloadPdf();
    };

    return (
        <Box className='sidebar'>
            <CssBaseline />
            <Box margin={'10px'} sx={{ flexGrow: 1 }}>
                <Typography variant="h5">Gerar Relatório em PDF</Typography>
                {!pdfData ? (
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            marginTop: '20px',
                        }}
                    >
                        <TextField
                            required
                            label="Mês"
                            type="number"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            inputProps={{ min: 1, max: 12 }}
                        />
                        <TextField
                            required
                            label="Ano"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Gerar PDF'}
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="h6">Relatório Gerado:</Typography>
                        {/* Display the PDF */}
                        <iframe
                            src={pdfData}
                            style={{ width: '100%', height: '500px' }}
                            title="PDF Preview"
                        />
                        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                            {/* Download button */}
                            <Button
                                variant="contained"
                                color="secondary"
                                href={downloadUrl}
                                download={`relatorio-${month}-${year}.pdf`}
                            >
                                Baixar PDF
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default MonthPayment;
