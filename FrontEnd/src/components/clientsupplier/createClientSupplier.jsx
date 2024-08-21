import React, { useState } from "react";
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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DialogMessage from '../../../utils/dialogMessage';
import validator from '../../../utils/inputsValidator';
import ZipCode from "cep-promise";
import '../../styles/index.css'

const theme = createTheme();

function CreateClientSupplier() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const userToken = JSON.parse(localStorage.getItem('user')) || {};
    const token = userToken.token || "";

    const [formData, setFormData] = useState({
        name: "",
        cpf: "",
        cnpj: "",
        cpfcnpj: "",
        zipcode: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        phone: "",
        email: "",
        isclient: false,
        issupplier: false,
        isclientsupplier: false,
        typekey: "",
        pixkey: "",
        active: true
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStatus, setDialogStatus] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            isclient: value === "client",
            issupplier: value === "supplier",
            isclientsupplier: value === "clientsupplier",
            cpf: value === "supplier" ? "" : formData.cpf,
            cnpj: value === "client" ? "" : formData.cnpj,
            cpfcnpj: value === "clientsupplier" ? "" : formData.cpfcnpj
        });
    };

    const handleZipCodeChange = async (event) => {
        const { value } = event.target;

        if (value.length === 8) {
            try {
                const zipCode = await ZipCode(value);
                setFormData({
                    ...formData,
                    zipcode: value,
                    address: zipCode.street || "",
                    neighborhood: zipCode.neighborhood || "",
                    city: zipCode.city || "",
                    state: zipCode.state || ""
                });
            } catch (error) {
                console.error("Erro ao buscar CEP:", error.message);
            }
        } else {
            setFormData({
                ...formData,
                zipcode: value,
                address: "",
                neighborhood: "",
                city: "",
                state: ""
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const errors = [];

            const testName = validator.allValidator(formData.name, 2, 80);
            const testZipCode = validator.zipCodeValidator(formData.zipcode);
            const testAddress = validator.allValidator(formData.address, 2, 100);
            const testNeighborhood = validator.allValidator(formData.neighborhood, 2, 60);
            const testCity = validator.allValidator(formData.city, 2, 40);
            const testState = validator.allValidator(formData.state, 2, 2);
            const testPhone = validator.phoneValidator(formData.phone);
            const testEmail = validator.emailValidator(formData.email);

            if (formData.complement.length > 0) {
                const testComplement = validator.allValidator(formData.complement, 1, 100)
                if (testComplement !== true) {
                    errors.push('Complemento permite o campo maxímo de 100 caracteres.');
                }
            }
            if (formData.isclient === true) {
                if (formData.cpf.length === 11) {
                    const testCpf = validator.cpfValidator(formData.cpf)
                    if (testCpf !== true) {
                        errors.push('Formato do CPF inválido.');
                    }
                } else {
                    errors.push('Digite 11 números para o CPF.');
                }
            }
            if (formData.issupplier === true) {
                if (formData.cnpj.length === 14) {
                    const testCnpj = validator.cnpjValidator(formData.cnpj)
                    if (testCnpj !== true) {
                        errors.push(testCnpj);
                    }
                } else {
                    errors.push('Digite 14 números para o CNPJ.');
                }
            }

            if (formData.isclientsupplier === true) {
                if (formData.cpfcnpj.length === 11) {
                    const testCpf = validator.cpfValidator(formData.cpfcnpj)
                    if (testCpf !== true) {
                        errors.push('Formato do CPF inválido.');
                    }else{
                        formData.cpf = formData.cpfcnpj;
                        formData.isclient = true;
                        formData.issupplier= true;
                    }
                }
                if (formData.cpfcnpj.length === 14) {
                    const testCnpj = validator.cnpjValidator(formData.cpfcnpj)
                    if (testCnpj !== true) {
                        errors.push(testCnpj);
                    }else{
                        formData.cnpj = formData.cpfcnpj;
                        formData.isclient = true;
                        formData.issupplier= true;
                    }
                } 
                if(formData.cpfcnpj.length !== 14 && formData.cpfcnpj.length !== 11 ){
                    errors.push('Digite 14 números para o CNPJ e 11 números para CPF.');
                }
            }
            
            if (formData.typekey === 'Telefone') {
                const testTypeKey = validator.phoneValidator(formData.pixkey)
                if (testTypeKey !== true) {
                    errors.push('Formato errado para o telefone da Chave PIX');
                }
            }
            if (formData.typekey === 'Email') {
                const testTypeKey = validator.emailValidator(formData.pixkey)
                if (testTypeKey !== true) {
                    errors.push('Formato errado para o e-mail da Chave PIX');
                }
            }
            if (formData.typekey === 'CPF/CNPJ') {
                if (formData.typekey.length === 11) {
                    const testTypeKey = validator.cpfValidator(formData.pixkey)
                    if (testTypeKey !== true) {
                        errors.push('Formato errado para o CPF da Chave PIX');
                    }
                }
                if (formData.typekey.length === 14) {
                    const testTypeKey = validator.cnpjValidator(formData.pixkey)
                    if (testTypeKey !== true) {
                        errors.push('Formato errado para o CNPJ da Chave PIX');
                    }
                }
            }

            if (testName !== true) {
                errors.push('Digite no mínimo 2 caracteres para o nome.');
            }
            if (testZipCode !== true) {
                errors.push('Digite no mínimo 8 números para o CEP.');
            }
            if (testAddress !== true) {
                errors.push('Digite no mínimo 2 caracteres para o endereço.');
            }
            if (testNeighborhood !== true) {
                errors.push('Digite no mínimo 2 caracteres para o bairro.');
            }
            if (testCity !== true) {
                errors.push('Digite no mínimo 2 caracteres para o cidade.');
            }
            if (testState !== true) {
                errors.push('Digite 2 caracteres para o estado(Ex: MG, RJ...).');
            }
            if (testPhone !== true) {
                errors.push('Digite no mínimo 11 números para o telefone(Ex: 32 12345 1234');
            }
            if (testEmail !== true) {
                errors.push('Digite um formato válido para o e-mail(Ex: exemplo@exemplo.com).');
            }
            if (errors.length > 0) {
                setDialogStatus('error');
                setDialogMessage(errors.join('\n'));
                return;
            }

            const response = await axios.post('http://localhost:3000/client', { ...formData }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const successMessage = response.data || "Cliente/Fornecedor cadastrado com sucesso!";
            setFormData({
                name: "",
                cpf: "",
                cnpj: "",
                cpfcnpj: "",
                zipcode: "",
                address: "",
                number: "",
                complement: "",
                neighborhood: "",
                city: "",
                state: "",
                phone: "",
                email: "",
                isclient: false,
                issupplier: false,
                isclientsupplier: false,
                typekey: "",
                pixkey: "",
                active: true
            });
            setDialogStatus('success');
            setDialogMessage(successMessage);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                logout();
            }
            const errorMessage = error.response?.data?.errors || "Erro ao cadastrar cliente/fornecedor.";
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
            <Container className="box-container" sx={{ mt: '2%' }}>
                <CssBaseline />
                <Box className="box-manager-client" component="form" onSubmit={handleSubmit}>
                    <Avatar className='avatar'>
                        <AssignmentIndIcon className='avatar' />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Cadastro de Cliente/Fornecedor
                    </Typography>
                    <Box className="box-manager-client-form">
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            required
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            select
                            label="Tipo"
                            required
                            name="type"
                            value={formData.isclient ? "client" : formData.issupplier ? "supplier" : formData.isclientsupplier ? "clientsupplier" :""}
                            onChange={handleSelectChange}
                            SelectProps={{
                                native: true,
                            }}
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
                        >
                            <option value=""></option>
                            <option value="client">Cliente</option>
                            <option value="supplier">Fornecedor</option>
                            <option value="clientsupplier">Cliente e Fornecedor</option>
                        </TextField>

                        {formData.isclient && (
                            <TextField
                                type="number"
                                className="textfield-client"
                                fullWidth
                                margin="normal"
                                label="CPF"
                                name="cpf"
                                autoComplete="cpf"
                                value={formData.cpf}
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
                        )}

                        {formData.issupplier && (
                            <TextField
                                className="textfield-client"
                                type="number"
                                fullWidth
                                margin="normal"
                                label="CNPJ"
                                name="cnpj"
                                autoComplete="cnpj"
                                value={formData.cnpj}
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
                        )}

                        {formData.isclientsupplier && (
                            <TextField
                                className="textfield-client"
                                type="number"
                                fullWidth
                                margin="normal"
                                label="CPF ou CNPJ"
                                name="cpfcnpj"
                                autoComplete="cpfcnpj"
                                value={formData.cpfcnpj}
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
                        )}

                        {!formData.isclient && !formData.issupplier && !formData.isclientsupplier &&(
                            <TextField
                                className="textfield-client"
                                fullWidth
                                margin="normal"
                                label="CPF/CNPJ"
                                disabled
                                value=""
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
                        )}
                        <TextField
                            className="textfield-client"
                            type="number"
                            fullWidth
                            margin="normal"
                            required
                            label="CEP"
                            name="zipcode"
                            autoComplete="zipcode"
                            value={formData.zipcode}
                            onChange={handleZipCodeChange}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            label="Rua/Av."
                            name="address"
                            autoComplete="address"
                            value={formData.address}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            required
                            label="Número"
                            name="number"
                            autoComplete="number"
                            autoFocus
                            value={formData.number}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            label="Complemento"
                            name="complement"
                            autoComplete="complement"
                            autoFocus
                            value={formData.complement}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            required
                            label="Bairro"
                            name="neighborhood"
                            autoComplete="neighborhood"
                            autoFocus
                            value={formData.neighborhood}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            required
                            label="Cidade"
                            name="city"
                            autoComplete="city"
                            autoFocus
                            value={formData.city}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            required
                            label="Estado"
                            name="state"
                            autoComplete="state"
                            autoFocus
                            value={formData.state}
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
                        <TextField
                            className="textfield-client"
                            type="number"
                            fullWidth
                            margin="normal"
                            required
                            label="Telefone"
                            name="phone"
                            autoComplete="phone"
                            autoFocus
                            value={formData.phone}
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
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            required
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
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
                    </Box>
                    <Box className="box-manager-pix">
                        <TextField
                            className="textfield-client"
                            fullWidth
                            margin="normal"
                            select
                            label="Tipo de Chave"
                            required
                            name="typekey"
                            value={formData.typekey}
                            onChange={handleChange}
                            SelectProps={{
                                native: true,
                            }}
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
                        >
                            <option value=""></option>
                            <option value="Telefone">Telefone</option>
                            <option value="Email">Email</option>
                            <option value="CPF/CNPJ">CPF/CNPJ</option>
                            <option value="Chave Aleatória">Chave Aleatória</option>
                            <option value="Chave Pix">Chave PIX</option>
                        </TextField>
                        {formData.typekey && (
                            <TextField
                                className="textfield-client-pix"
                                fullWidth
                                margin="normal"
                                required
                                label="Chave Pix"
                                name="pixkey"
                                autoComplete="pixkey"
                                autoFocus
                                value={formData.pixkey}
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
                        )}
                        {!formData.typekey && (
                            <TextField
                                className="textfield-client-pix"
                                fullWidth
                                margin="normal"
                                disabled
                                required
                                label="Chave Pix"
                                name="pixkey"
                                autoComplete="pixkey"
                                autoFocus
                                value={formData.pixkey}
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
                        )}
                    </Box>
                    <Box className="box-manager-button" sx={{ width: '60%' }}>
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

export default CreateClientSupplier;
