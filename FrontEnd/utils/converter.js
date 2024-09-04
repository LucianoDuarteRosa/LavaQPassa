import { format, parse, isValid } from 'date-fns';

class Converter {

    frontToMySQL(dateInput) {
        let parsedDate;

        // Verificar se a entrada é um objeto Date
        if (dateInput instanceof Date) {
            parsedDate = dateInput;
        } else if (typeof dateInput === 'string') {
            // Tentar parsear a data a partir da string
            parsedDate = parse(dateInput, 'dd/MM/yyyy', new Date());

            // Se a data original não estiver válida, tentar o formato YYYY-MM-DD
            if (!isValid(parsedDate)) {
                parsedDate = parse(dateInput, 'yyyy-MM-dd', new Date());
            }
        } else {
            return ''; // Retornar uma string vazia se a entrada não for válida
        }

        // Verificar se a data é válida
        if (isValid(parsedDate)) {
            // Retorna a data formatada para YYYY-MM-DD HH:mm:ss
            return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
        } else {
            return ''; // Retornar uma string vazia se a data não for válida
        }
    }

    toMySQLDate(dateInput = new Date()) {
        let date;

        // Verificar se a entrada é uma instância de Date
        if (dateInput instanceof Date) {
            date = dateInput;
        } else if (typeof dateInput === 'string') {
            // Tentar criar um objeto Date a partir da string
            date = new Date(dateInput);

            // Verificar se a data criada é inválida
            if (isNaN(date.getTime())) {
                throw new Error('Formato de data inválido.');
            }
        } else {
            throw new Error('Entrada deve ser uma string ou um objeto Date.');
        }

        // Formatar a data no formato YYYY-MM-DD HH:MM:SS
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    }

    convertToMySQLDate(dateString) {
        // Cria um objeto Date a partir da string ISO 8601
        const date = new Date(dateString);

        // Formata a data para o formato MySQL DATETIME: YYYY-MM-DD HH:MM:SS
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    addDaysToMySQLDate(dateString, daysToAdd) {
        const date = new Date(dateString);

        // Adiciona o número de dias
        date.setDate(date.getDate() + daysToAdd);

        return this.convertToMySQLDate(date);
    }

    nextMonthTenth(dateString) {
        const date = new Date(dateString);

        // Incrementa o mês em 1
        date.setMonth(date.getMonth() + 1);

        // Define o dia como 10
        date.setDate(10);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    mySQLToFront(dateStr) {
        try {
            // Parse a data do formato ISO para um objeto Date
            const parsedDate = new Date(dateStr);

            // Verifica se a data é válida
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Formato de data inválido.');
            }

            // Formata a data para yyyy-MM-dd
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Meses são indexados a partir de 0
            const day = String(parsedDate.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            return error.message;
        }
    }

    convertToBrazilianDate(dateStr) {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                throw new Error("Data inválida.");
            }
    
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são indexados a partir de 0
            const year = date.getFullYear();
    
            return `${day}/${month}/${year}`;
        } catch (error) {
            return error.message;
        }
    }

    convertToDateTimeLocalFormat(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // meses são baseados em 0
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

}

export default new Converter();

