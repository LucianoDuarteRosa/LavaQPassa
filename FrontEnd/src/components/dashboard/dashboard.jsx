import * as React from 'react';
import axios from "axios";
import { useEffect } from 'react';
import { useAuth } from '../login/authContext';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { baseURL } from '../../config.js';
import DialogMessage from '../../../utils/dialogMessage';

// Configuração para o gráfico de vendas por mês
const chartSettingSale = {
    height: 320,
    xAxis: [
        {
            label: 'Meses',
            scaleType: 'band',
            dataKey: 'saleMonth',
            valueFormatter: (month, context) => {
                // Formata a data exibida no eixo X
                const [year, monthNumber] = month.split('-');
                return context.location === 'tick'
                    ? `${monthNumber}/${year}` // Formata o mês e o ano para tick
                    : `${monthNumber}/${year}`; // Formata o mês e o ano para outros locais
            },
        },
    ],
    grid: { horizontal: true },// Adiciona linhas horizontais na grade do gráfico
};

// Configuração padrão para o gráfico de vendas por subgrupo
const chartSetting = {
    xAxis: [
        {
            label: 'Vendas por subgrupo', // Rótulo do eixo X
        },
    ],
    width: 550,
    height: 430,
};

// Função para formatar valores monetários
const valueFormatter = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

// Componente principal do Dashboard
function Dashboard() {
    const userToken = JSON.parse(localStorage.getItem('user')) || {}; // Obtém o token do usuário do localStorage
    const token = userToken.token || ""; // Extraí o token do objeto do usuário
    const { logout } = useAuth(); // Componente principal do Dashboard

    //Estado para armazenar os dados de cada entidade
    const [payables, setPayables] = useState([]);
    const [saleYears, setSalesYear] = useState([]);
    const [saleGroup, setSalesGroup] = useState([]);
    const [saleSubGroup, setSalesSubGroup] = useState([]);

    // Estados para controle do diálogo de feedback
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        // Função para buscar contas a pagar
        const fetchPayables = async () => {
            try {
                const response = await axios.get(`${baseURL}/accountspayable`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPayables(response.data);
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
                }
                setPayables([]);
            }
        };

        // Função para buscar os anos de vendas
        const fetchSalesYear = async () => {
            try {
                const response = await axios.get(`${baseURL}/saleyear`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSalesYear(response.data);
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
                }
                setSalesYear([]);
            }
        };

        // Função para buscar os grupos de vendas
        const fetchSalesGroup = async () => {
            try {
                const response = await axios.get(`${baseURL}/salegroup`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSalesGroup(response.data);
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
                }
                setSalesGroup([]);
            }
        };

        // Função para buscar os subgrupos de vendas
        const fetchSalesSubGroup = async () => {
            try {
                const response = await axios.get(`${baseURL}/salesubgroup`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSalesSubGroup(response.data);
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
                }
                setSalesSubGroup([]);
            }
        };

        fetchSalesSubGroup();
        fetchSalesYear();
        fetchPayables();
        fetchSalesGroup();
    }, []);

    // Função para redirecionar para a página inicial
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box className='sidebar'>
            <CssBaseline />
            <Box
                margin={'10px'}
                sx={{ flexGrow: 1 }}
            >
                <Typography>
                    <Typography className='dashboard-title-barchart'>Vendas dos últimos 12 mêses</Typography>
                    <BarChart
                        dataset={saleYears}
                        xAxis={chartSettingSale.xAxis}
                        series={[{ dataKey: 'totalSales', valueFormatter, color: '#388e3c' }]}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 60,
                            bottom: 20,
                        }}
                        {...chartSettingSale}
                    />
                </Typography>

                <Typography sx={{ display: 'flex', padding: '10px' }} >
                    <PieChart
                        series={[
                            {
                                data: saleGroup,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 20, additionalRadius: -20, color: 'green' },
                            },
                        ]}
                        height={430}
                        width={600}
                    />
                    <BarChart
                        dataset={saleSubGroup}
                        yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                        series={[{ dataKey: 'value', valueFormatter, color: '#02b2af' }]}
                        layout="horizontal"
                        grid={{ vertical: true }}
                        {...chartSetting}
                    />
                    <Typography className="box-card-dashboard">
                        <Card className='card-dashboard'>
                            <CardActionArea className='card-area-dashboard'>
                                <CardContent>
                                    <Typography className='card-dashboard-title' gutterBottom>
                                        Contas a Pagar - Mensal
                                    </Typography>
                                    <Typography variant="body2" className='card-dashboard-text'>
                                        R$ {parseFloat(payables.account).toFixed(2).replace('.', ',')}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Card className='card-dashboard'>
                            <CardActionArea className='card-area-dashboard'>
                                <CardContent>
                                    <Typography gutterBottom
                                        className='card-dashboard-title'
                                    >
                                        Contas quitadas
                                    </Typography>
                                    <Typography className='card-dashboard-text'>
                                        R$ {parseFloat(payables.paids).toFixed(2).replace('.', ',')}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Card className='card-dashboard'>
                            <CardActionArea className='card-area-dashboard'>
                                <CardContent>
                                    <Typography gutterBottom
                                        className='card-dashboard-title'
                                    >
                                        Contas a vencer
                                    </Typography>
                                    <Typography className='card-dashboard-text'>
                                        R$ {parseFloat(payables.billsDue).toFixed(2).replace('.', ',')}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Typography>
                </Typography>
                <DialogMessage
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    status={dialogStatus}
                    message={dialogMessage}
                />
            </Box>
        </Box>
    );
}

export default Dashboard;