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

const chartSettingSale = {
    height: 320,
    xAxis: [
        {
            label: 'Meses',
            scaleType: 'band',
            dataKey: 'saleMonth',
            valueFormatter: (month, context) => {
                const [year, monthNumber] = month.split('-');
                return context.location === 'tick'
                    ? `${monthNumber}/${year}`
                    : `${monthNumber}/${year}`;
            },
        },
    ],
    grid: { horizontal: true },
};

const chartSetting = {
    xAxis: [
        {
            label: 'Vendas por subgrupo',
        },
    ],
    width: 550,
    height: 430,
};

const valueFormatter = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

function Dashboard() {
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";
    const { logout } = useAuth();

    const [payables, setPayables] = useState([]);
    const [saleYears, setSalesYear] = useState([]);
    const [saleGroup, setSalesGroup] = useState([]);
    const [saleSubGroup, setSalesSubGroup] = useState([]);

    useEffect(() => {
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


            </Box>
        </Box>
    );
}

export default Dashboard;