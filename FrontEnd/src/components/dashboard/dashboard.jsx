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


const data = [
    { id: 0, value: 10, label: 'Roupas' },
    { id: 1, value: 15, label: 'Calçados' },
    { id: 2, value: 20, label: 'Acessórios' },
];

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
    yAxis: [
        {
            position: 'top',
            tickLabelMargin: 0,
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

const dataset = [
    {
        london: 59,
        paris: 57,
        newYork: 86,
        seoul: 21,
        month: 'January',
    },
    {
        london: 50,
        paris: 52,
        newYork: 78,
        seoul: 28,
        month: 'February',
    },
    {
        london: 47,
        paris: 53,
        newYork: 106,
        seoul: 41,
        month: 'March',
    },
    {
        london: 54,
        paris: 56,
        newYork: 92,
        seoul: 73,
        month: 'April',
    },
    {
        london: 57,
        paris: 69,
        newYork: 92,
        seoul: 99,
        month: 'May',
    },
    {
        london: 60,
        paris: 63,
        newYork: 103,
        seoul: 144,
        month: 'June',
    },
    {
        london: 59,
        paris: 60,
        newYork: 105,
        seoul: 319,
        month: 'July',
    },
    {
        london: 65,
        paris: 60,
        newYork: 106,
        seoul: 249,
        month: 'August',
    },
    {
        london: 51,
        paris: 51,
        newYork: 95,
        seoul: 131,
        month: 'September',
    },
    {
        london: 60,
        paris: 65,
        newYork: 97,
        seoul: 55,
        month: 'October',
    },
    {
        london: 67,
        paris: 64,
        newYork: 76,
        seoul: 48,
        month: 'November',
    },
    {
        london: 61,
        paris: 70,
        newYork: 103,
        seoul: 25,
        month: 'December',
    },
];

const valueFormatter = (value) => `${value}mm`;
const valueFormatterSale = (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;

function Dashboard() {
    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";
    const { logout } = useAuth();

    const [payables, setPayables] = useState([]);
    const [saleYears, setSalesYear] = useState([]);

    useEffect(() => {
        const fetchPayables = async () => {
            try {
                const response = await axios.get("http://localhost:3000/accountspayable", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPayables(response.data);
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    logout();
                }
                setPayables([]);
                const errorMessage = error.response?.data?.error || "Erro ao carregar contas a pagar mensal.";
            }
        };

        const fetchSalesYear = async () => {
            try {
                const response = await axios.get("http://localhost:3000/saleyear", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSalesYear(response.data);
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    logout();
                }
                setSalesYear([]);
                const errorMessage = error.response?.data?.error || "Erro ao carregar vendas mensal.";
            }
        };

        fetchSalesYear();
        fetchPayables();
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
                        series={[{ dataKey: 'totalSales', valueFormatterSale, color: '#285c29' }]}
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
                                data,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                        ]}
                        height={430}
                        width={600}
                    />
                    <BarChart
                        dataset={dataset}
                        yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                        series={[{ dataKey: 'seoul', valueFormatter }]}
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