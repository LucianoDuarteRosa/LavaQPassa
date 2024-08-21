class InputValidator {

    stringValidator(string, min, max) {
        try {
            const regex = new RegExp(`^[a-zA-ZÀ-ÿ\\s']{${min},${max}}$`);
            if (regex.test(string)) {
                return true;
            } else {
                throw new Error('Por favor, digite valor válido.');
            }
        } catch (error) {
            return error.message;
        }
    }

    integerMaxValidator(number, max) {
        try {
            const parsedNumber = parseInt(number, 10);
            if (Number.isInteger(parsedNumber) && parsedNumber > 0 && parsedNumber <= max) {
                return true;
            } else {
                throw new Error(`Valor inválido. Digite um número inteiro entre 1 e ${max}.`);
            }
        } catch (error) {
            return error.message;
        }
    }

    integerValidator(number) {
        try {
            const parsedNumber = parseInt(number, 10);
            if (Number.isInteger(parsedNumber) && parsedNumber > 0) {
                return true;
            } else {
                throw new Error("Valor inválido, digite somente números e pelo menos 1 caractere.");
            }
        } catch (error) {
            return error.message;
        }
    }

    floatMaxValidator(number, max) {
        try {
            const parsedNumber = parseFloat(number);
            if (!isNaN(parsedNumber) && parsedNumber > 0 && parsedNumber <= max) {
                return true;
            } else {
                throw new Error(`Valor inválido. Digite um número entre 0 e ${max}.`);
            }
        } catch (error) {
            return error.message;
        }
    }

    floatValidator(number) {
        try {
            const parsedNumber = parseFloat(number);
            if (!isNaN(parsedNumber) && parsedNumber > 0) {
                return true;
            } else {
                throw new Error("Valor inválido. Digite um número maior que 0.");
            }
        } catch (error) {
            return error.message;
        }
    }

    cpfValidator(cpf) {
        try {
            cpf = cpf.replace(/[^\d]/g, ''); // Remove todos os caracteres que não são dígitos

            if (cpf.length !== 11) {
                throw new Error("Por favor, digite 11 números.");
            }

            // Elimina CPFs inválidos conhecidos
            if (/^(.)\1{10}$/.test(cpf)) {
                throw new Error("CPF inválido.");
            }

            let sum = 0;
            let remainder;

            for (let i = 1; i <= 9; i++) {
                sum += parseInt(cpf.charAt(i - 1), 10) * (11 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) {
                remainder = 0;
            }
            if (remainder !== parseInt(cpf.charAt(9), 10)) {
                throw new Error("CPF inválido.");
            }

            sum = 0;
            for (let i = 1; i <= 10; i++) {
                sum += parseInt(cpf.charAt(i - 1), 10) * (12 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) {
                remainder = 0;
            }
            if (remainder !== parseInt(cpf.charAt(10), 10)) {
                throw new Error("CPF inválido.");
            }

            return true;

        } catch (error) {
            return error.message;
        }
    }

    cnpjValidator(cnpj) {
        try {
            cnpj = cnpj.replace(/[^\d]/g, ''); // Remove todos os caracteres que não são dígitos

            if (cnpj.length !== 14) {
                throw new Error("Por favor, digite 14 números.");
            }

            // Elimina CNPJs inválidos conhecidos
            if (/^(.)\1{13}$/.test(cnpj)) {
                throw new Error("CNPJ inválido.");
            }

            let length = 12;
            let numbers = cnpj.substring(0, length);
            let digits = cnpj.substring(length);
            let sum = 0;
            let pos = length - 7;

            for (let i = length; i >= 1; i--) {
                sum += parseInt(numbers.charAt(length - i), 10) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }

            let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result !== parseInt(digits.charAt(0), 10)) {
                throw new Error("CNPJ inválido.");
            }

            length = 13;
            numbers = cnpj.substring(0, length);
            sum = 0;
            pos = length - 7;

            for (let i = length; i >= 1; i--) {
                sum += parseInt(numbers.charAt(length - i), 10) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }

            result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result !== parseInt(digits.charAt(1), 10)) {
                throw new Error("CNPJ inválido.");
            }

            return true;

        } catch (error) {
            return error.message;
        }
    }

    zipCodeValidator(zipCode) {
        try {
            zipCode = zipCode.replace(/[^\d]/g, '');

            if (!/^\d{8}$/.test(zipCode)) {
                throw new Error("CEP inválido.");
            }

            return true;
        } catch (error) {
            return error.message;
        }
    }

    emailValidator(email) {
        try {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return true;
            } else {
                throw new Error("Email inválido.");
            }
        } catch (error) {
            return error.message;
        }
    }

    phoneValidator(phone) {
        try {
            phone = phone.replace(/[^\d]/g, '');

            if (/^\d{10,11}$/.test(phone)) {
                return true;
            } else {
                throw new Error("Número de telefone inválido. Deve conter entre 10 e 11 dígitos.");
            }
        } catch (error) {
            return error.message;
        }
    }

    dateValidator(date) {
        try {
            if (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date))) {
                return true;
            } else {
                throw new Error("Data inválida. Formato esperado: YYYY-MM-DD.");
            }
        } catch (error) {
            return error.message;
        }
    }

    allValidator(value, min, max) {
        try {
            const trimmedValue = value.replace(/\s+/g, '');
            const regex = new RegExp(`^[\\p{L}0-9]{${min},${max}}$`, 'u');
            if (regex.test(trimmedValue)) {
                return true;
            } else {
                throw new Error(`Por favor, digite valor válido(entre ${min} e ${max} caracteres, apenas letras e números).`);
            }
        } catch (error) {
            return error.message;
        }
    }

    passwordValidator(password, minLength = 8) {
        try {
            if (password.length >= minLength && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                return true;
            } else {
                throw new Error(`Senha inválida. Deve conter pelo menos ${minLength} caracteres, incluindo letras maiúsculas e minúsculas, números e caracteres especiais.`);
            }
        } catch (error) {
            return error.message;
        }
    }

    booleanValidator(value) {
        try {
            if (typeof value === 'boolean') {
                return true;
            } else {
                throw new Error("Valor inválido. Deve ser um valor booleano (true ou false).");
            }
        } catch (error) {
            return error.message;
        }
    }

}

export default new InputValidator();
