import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../login/authContext';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../../styles/index.css'

const theme = createTheme();

function CreateUser() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    const [formData, setFormData] = useState({
        name: "",
        idgroup: "",
    });

    const [group, setGroup] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await axios.get('http://localhost:3000/group', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setGroup(response.data);
            } catch (error) {
                console.error("Error fetching group", error);
                if (error.response && error.response.status === 401) {
                    logout();
                }
            }
        };

        fetchGroup();
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const errors = [];

            const testName = validator.allValidator(formData.name, 2, 15);

            if (testName !== true) {
                errors.push(testName);
            }

            if (errors.length > 0) {
                setDialogStatus('error');
                setDialogMessage(errors);
                return;
            }
            console.log(formData);
            const response = await axios.post('http://localhost:3000/subgroup', { ...formData }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const successMessage = response.data || "Sub-Grupo cadastrado com sucesso!";
            setFormData({
                name: "",
                idgroup: "",
            });
            setDialogStatus('success');
            setDialogMessage(successMessage);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                logout();
            }
            const errorMessage = error.response?.data?.errors || "Erro ao cadastrar sub-grupo.";
            setDialogStatus('error');
            setDialogMessage(errorMessage);
        } finally {
            setDialogOpen(true);
        }
    };

    const handleVoltar = () => {
        navigate("/manager");
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
                        Cadastro de Subgrupo
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%'}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Nome"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
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
                            value={formData.idgroup}
                            onChange={handleChange}
                            fullWidth
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>Selecione um grupo</em>;
                                }
                                return group.find(group => group.IdGroup === selected)?.GroupName || '';
                            }}
                            color="success"
                            sx={{ mt: '10px'}}
                        >
                            <MenuItem value="" >
                                <em>Selecione um grupo</em>
                            </MenuItem>
                            {group.map((group) => (
                                <MenuItem key={group.IdGroup} value={group.IdGroup}>
                                    {group.GroupName}
                                </MenuItem>
                            ))}
                        </Select>
                        <Box className="box-manager-button">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                className='primary-button'
                            >
                                Cadastrar
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                className='primary-button'
                                onClick={handleVoltar}
                            >
                                Voltar
                            </Button>
                        </Box>
                    </Box>
                    <DialogMessage
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        status={dialogStatus}
                        message={dialogMessage}
                    />
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CreateUser;
