import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { CardActionArea } from '@mui/material';


const data = [
    { id: 0, value: 10, label: 'Roupas' },
    { id: 1, value: 15, label: 'Calçados' },
    { id: 2, value: 20, label: 'Acessórios' },
];

const otherSetting = {
    height: 350,
    yAxis: [{ label: 'Venda dos Últimos 12 Mêses' }],
    grid: { horizontal: true },
    sx: {
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
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

export default function Dashboard() {
    return (
        <Box className='sidebar'>
            <CssBaseline />
            <Box
                margin={'10px'}
                component="main"
                sx={{ flexGrow: 1 }}
            >
                <Typography>
                    <BarChart
                        dataset={dataset}
                        xAxis={[
                            {
                                scaleType: 'band',
                                dataKey: 'month',
                                valueFormatter: (month, context) =>
                                    context.location === 'tick'
                                        ? `${month.slice(0, 3)} \n2023`
                                        : `${month} 2023`,
                            },
                        ]}
                        series={[{ dataKey: 'seoul', valueFormatter }]}
                        {...otherSetting}
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
                                        R$2250,00
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
                                        R$350,00
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
                                        R$1900,00
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