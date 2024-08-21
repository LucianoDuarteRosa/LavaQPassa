import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const theme = createTheme();

function UpdateSubGroup() {
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [subgroup, setSubGroup] = useState({
    name: '',
    active: false,
    idgroup: '',
  });
  const [loading, setLoading] = useState(true);
  const [groups, setGroup] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const userToken = JSON.parse(localStorage.getItem('user')) || {};
  const token = userToken.token || "";

  useEffect(() => {
    const fetchSubGroup = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/subgroup/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const subGroupData = response.data[0];
        setSubGroup({
          name: subGroupData.SubGroupName,
          active: Boolean(subGroupData.Active),
          idgroup: subGroupData.IdGroup,
        });
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
        const errorMessage = error.response?.data?.error || "Erro ao carregar sub-grupo";
        setDialogStatus('error');
        setDialogMessage(errorMessage);
        setDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchGroup = async () => {
      try {
        const response = await axios.get('http://localhost:3000/group', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGroup(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
        }
        console.error("Error fetching groups", error);
      }
    };

    fetchSubGroup();
    fetchGroup();
  }, [id, token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSubGroup({ ...subgroup, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = [];

      const testName = validator.allValidator(subgroup.name, 2, 15);
      const testActive = validator.booleanValidator(subgroup.active);
      const testGroup = validator.integerValidator(subgroup.idgroup);

      if (testName !== true) {
        errors.push(testName);
      }
      if (testGroup !== true) {
        errors.push(testGroup);
      }
      if (testActive !== true) {
        errors.push(testActive);
      }

      if (errors.length > 0) {
        setDialogStatus('error');
        setDialogMessage(errors.join('\n'));
        return;
      }

      await axios.put(`http://localhost:3000/subgroup/${id}`, { ...subgroup }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDialogStatus('success');
      setDialogMessage("Sub-Grupo atualizado com sucesso.");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        logout();
      }
      const errorMessage = error.response?.data?.errors || "Erro ao atualizar sub-grupo.";
      setDialogStatus('error');
      setDialogMessage(errorMessage);
    } finally {
      setDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleVoltar = () => {
    navigate("/searchsubgroup");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="box-container">
        <CssBaseline />
        <Box className="box-manager-user">
          <Avatar className='avatar'>
            <AccountTreeIcon className='avatar' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atualizar Subgrupo
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome"
              name="name"
              autoComplete="nome"
              autoFocus
              value={subgroup.name || ''}
              onChange={handleChange}
              InputLabelProps={{
                sx: {
                  color: '#0303037e',
                  '&.Mui-focused': {
                    color: '#030303',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0303037e',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0303037e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#030303af',
                  },
                },
              }}
            />
            <Select
              name="idgroup"
              value={subgroup.idgroup || ''}
              onChange={handleChange}
              fullWidth
              color="success"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Selecione um grupo</em>;
                }
                return groups.find(group => group.IdGroup === selected)?.GroupName || '';
              }}
              sx={{ mt: '10px' }}
            >
              <MenuItem value="">
                <em>Selecione um grupo</em>
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.IdGroup} value={group.IdGroup}>
                  {group.GroupName}
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  checked={subgroup.active}
                  onChange={handleChange}
                  name="active"
                  sx={{
                    '&.Mui-checked': {
                      color: '#45a049',
                    },
                  }}
                />
              }
              label="Ativo"
            />
            <Box className="box-manager-button">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className='primary-button'
              >
                Atualizar
              </Button>
              <Button
                fullWidth
                variant="contained"
                className='primary-button'
                onClick={handleVoltar}
              >
                Voltar
              </Button>
            </Box>
          </Box>
        </Box>
        <DialogMessage
          open={dialogOpen}
          onClose={handleCloseDialog}
          status={dialogStatus}
          message={dialogMessage}
        />
      </Container>
    </ThemeProvider>
  );
}

export default UpdateSubGroup;
