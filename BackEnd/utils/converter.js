const { format, parse, isValid } = require('date-fns');

class Converter {

    convertToMySQLDateTimeFormat(dateTimeLocalString) {
        const [date, time] = dateTimeLocalString.split('T');
        const formattedDateTime = `${date} ${time}:00`; // Adiciona os segundos
        return formattedDateTime;
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



    mySQLToFront(dateStr) {
        try {
            // Parse a data do formato MySQL
            let parsedDate = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());

            // Se o tempo estiver no formato sem segundos, tentamos parsear novamente
            if (isNaN(parsedDate)) {
                parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
            }

            if (!isNaN(parsedDate)) {
                return format(parsedDate, 'dd/MM/yyyy');
            } else {
                throw new Error('Formato de data inválido.');
            }
        } catch (error) {
            return error.message;
        }
    }

    convertToBrazilianDate(dateStr) {
        try {
            let [year, month, day] = dateStr.split('-');
            if (year && month && day) {
                return `${day}/${month}/${year}`;
            }
            throw new Error("Formato de data inválido.");
        } catch (error) {
            return error.message;
        }
    }

    getMonthStartAndEndDates() {
        const now = new Date();

        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const firstDayFormatted = firstDay.toISOString().split('.')[0];
        const lastDayFormatted = lastDay.toISOString().split('.')[0];

        let dateReturn = {
            firstDay: firstDayFormatted,
            lastDay: lastDayFormatted
        }

        return dateReturn
    }
}

module.exports = new Converter();
