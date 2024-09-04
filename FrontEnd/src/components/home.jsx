import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { BarChart } from '@mui/x-charts/BarChart';
import CreateProduct from '../components/product/createProduct';
import Sale from '../components/sale/createSale';
import Client from '../components/clientsupplier/createClientSupplier';
import Payable from '../components/accountsPayable/searchAccountsPayable';
import Receivable from '../components/accountsReceivable/searchAccountsReceivable';
import Dashboard from '../components/dashboard/dashboard';
import MonthPayment from '../components/monthPayment/monthPayment';
import "../styles/index.css"

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const handleDrawerItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <Box className='sidebar'>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '92px',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List className='drawer'>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('dashboard')}>
              <ListItemIcon>
                <SsidChartIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('sale')}>
              <ListItemIcon>
                <PaidIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Venda" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('product')}>
              <ListItemIcon>
                <AddShoppingCartIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Produto" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('client')}>
              <ListItemIcon>
                <Diversity3Icon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Cliente" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('payable')}>
              <ListItemIcon>
                <RequestQuoteIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Contas a Pagar" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('receivable')}>
              <ListItemIcon>
                <PriceCheckIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Contas a Receber" />
            </ListItemButton>
          </ListItem>

          <Divider />
          {/* 
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('report')}>
              <ListItemIcon>
                <LibraryBooksIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Relatório" />
            </ListItemButton>
          </ListItem> */}

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('month')}>
              <ListItemIcon>
                <ChecklistIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Acerto Mensal" />
            </ListItemButton>
          </ListItem>
        </List>

      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        {selectedItem === 'dashboard' && (
          <Typography>
            <Dashboard />
          </Typography>
        )}

        {selectedItem === 'sale' && (
          <Typography>
            <Sale />
          </Typography>
        )}

        {selectedItem === 'product' && (
          <Typography>
            <CreateProduct />
          </Typography>
        )}

        {selectedItem === 'client' && (
          <Typography>
            <Client />
          </Typography>
        )}

        {selectedItem === 'payable' && (
          <Typography>
            <Payable />
          </Typography>
        )}

        {selectedItem === 'receivable' && (
          <Typography>
            <Receivable />
          </Typography>
        )}

        {/* {selectedItem === 'report' && (
          <Typography>
            Esta é a página de Relatório.
          </Typography>
        )} */}

        {selectedItem === 'month' && (
          <Typography>
            <MonthPayment />
          </Typography>
        )}
      </Box>
    </Box>
  );
}