// BIBLIOTECAS
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import '../styles/index.css'

// FRAMEWORKS - MATERIAL UI
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Grid,
  Paper,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme();

export default function Manager() {
  return (
    <ThemeProvider theme={theme} >
      <div className="main-manager">
        <CssBaseline />
        <Container component="main" maxWidth="md">
          <Box className="box-manage">
            <Typography component="h1" variant="h2" margin='30px'>
              <b className="tile-manager">Gerenciador</b>
            </Typography>

            <Grid>
              <Grid item xs={12} sm={10} md={8} className="box-manage-main">
              <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Produto</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createproduct"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchproduct"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Venda</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createsale"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchsale"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Contas a Pagar</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createaccountspayable"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchaccountspayable"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Contas a Receber</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createaccountsreceivable"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchaccountsreceivable"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Usuário</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createuser"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchuser"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Cliente/Fornecedores</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createclient"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchclient"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Grupo</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/creategroup"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchgroup"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
                <Paper className="manager-cards">
                  <Typography component="h1" variant="h5">
                    <b>Subgrupo</b>
                  </Typography>
                  <Box display="flex" justifyContent="space-around">
                    <RouterLink 
                      component={RouterLink}
                      to="/createsubgroup"
                      className="primary-button-manager"
                    >
                      Cadastrar
                    </RouterLink >
                    <RouterLink 
                      component={RouterLink}
                      to="/searchsubgroup"
                      className="primary-button-manager"
                    >
                      Pesquisar
                    </RouterLink >
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
