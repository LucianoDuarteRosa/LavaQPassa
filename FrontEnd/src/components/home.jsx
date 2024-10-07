import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SavingsIcon from '@mui/icons-material/Savings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CreateProduct from '../components/product/createProduct';
import ApiIcon from '@mui/icons-material/Api';
import AppsIcon from '@mui/icons-material/Apps';
import StorageIcon from '@mui/icons-material/Storage';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Sale from '../components/sale/createSale';
import Client from '../components/clientsupplier/createClientSupplier';
import Payable from '../components/accountsPayable/searchAccountsPayable';
import Receivable from '../components/accountsReceivable/searchAccountsReceivable';
import Dashboard from '../components/dashboard/dashboard';
import MonthPayment from '../components/monthPayment/monthPayment';
import Document from '../components/documentation/aplication';
import Backup from '../components/backup/backup';
import Report from '../components/report/report';
import CashFlow from '../components/cashflow/cashFlow';
import "../styles/index.css"

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const handleDrawerItemClick = (item) => {
    setSelectedItem(item);
  };

  const [open, setOpen] = useState(false);

  const handleDrawerItemClickList = () => {
    setOpen(!open);
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


          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('cashflow')}>
              <ListItemIcon>
                <SavingsIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Fluxo de Caixa" />
            </ListItemButton>
          </ListItem>

          <Divider />


          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('month')}>
              <ListItemIcon>
                <ChecklistIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Acerto Mensal" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('report')}>
              <ListItemIcon>
                <NewspaperIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Relatórios" />
            </ListItemButton>
          </ListItem>


          <Divider />


          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick('backup')}>
              <ListItemIcon>
                <StorageIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Backup" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleDrawerItemClickList}>
              <ListItemIcon>
                <LibraryBooksIcon fontSize="large" className='list-icon' />
              </ListItemIcon>
              <ListItemText className='list-item' primary="Documentação" />
              {open ? <ExpandLess className='list-icon' /> : <ExpandMore className='list-icon' />}
            </ListItemButton>
          </ListItem>

          <Collapse in={open} timeout="auto" unmountOnExit >
            <List disablePadding className='list-item'>
              <ListItemButton sx={{ pl: 4 }} onClick={() => window.open('http://localhost:3000/docs/', '_blank')}>
                <ListItemIcon>
                  <ApiIcon fontSize="large" className='list-icon' />
                </ListItemIcon>
                <ListItemText primary="API" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={() => handleDrawerItemClick('aplication')}>
                <ListItemIcon>
                  <AppsIcon fontSize="large" className='list-icon' />
                </ListItemIcon>
                <ListItemText primary="Aplicação" />
              </ListItemButton>
            </List>
          </Collapse>
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


        {selectedItem === 'cashflow' && (
          <Typography>
            <CashFlow />
          </Typography>
        )}

        {selectedItem === 'report' && (
          <Typography>
            <Report />
          </Typography>
        )}

        {selectedItem === 'month' && (
          <Typography>
            <MonthPayment />
          </Typography>
        )}

        {selectedItem === 'aplication' && (
          <Typography>
            <Document />
          </Typography>
        )}


        {selectedItem === 'backup' && (
          <Typography>
            <Backup />
          </Typography>
        )}
      </Box>
    </Box>
  );
}