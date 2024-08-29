const QRCode = require('qrcode');

class PixString {
    gerarPixString(tipoChave, chave, valor, nomeRecebedor, cidadeRecebedor, descricao) {
        const payloadFormatIndicator = '000201';
        const merchantCategoryCode = '52040000';
        const transactionCurrency = '5303986';
        const transactionAmount = '54' + valor.toFixed(2).replace('.', '').padStart(4, '0');
        const countryCode = '5802BR';
        const merchantName = '59' + nomeRecebedor.length.toString().padStart(2, '0') + nomeRecebedor;
        const merchantCity = '60' + cidadeRecebedor.length.toString().padStart(2, '0') + cidadeRecebedor;
        const additionalDataFieldTemplate = '62' + (6 + descricao.length).toString().padStart(2, '0') + '0503' + descricao.length.toString().padStart(2, '0') + descricao;
        const crc16 = '6304';

        let merchantAccountInformation = '';

        switch (tipoChave) {
            case 'cpf':
                merchantAccountInformation = '26' + (4 + chave.length).toString().padStart(2, '0') + '0014br.gov.bcb.pix01' + chave.length.toString().padStart(2, '0') + chave;
                break;
            case 'email':
                merchantAccountInformation = '26' + (4 + chave.length).toString().padStart(2, '0') + '0016br.gov.bcb.pix01' + chave.length.toString().padStart(2, '0') + chave;
                break;
            case 'telefone':
                merchantAccountInformation = '26' + (4 + chave.length).toString().padStart(2, '0') + '0017br.gov.bcb.pix01' + chave.length.toString().padStart(2, '0') + chave;
                break;
            case 'aleatoria':
                merchantAccountInformation = '26' + (4 + chave.length).toString().padStart(2, '0') + '0018br.gov.bcb.pix01' + chave.length.toString().padStart(2, '0') + chave;
                break;
            default:
                throw new Error('Tipo de chave Pix inválido');
        }

        const pixString = payloadFormatIndicator + merchantAccountInformation + merchantCategoryCode + transactionCurrency + transactionAmount + countryCode + merchantName + merchantCity + additionalDataFieldTemplate;

        const crc = this.calcularCRC16(pixString + crc16);

        return pixString + crc16 + crc;
    }

    calcularCRC16(payload) {
        let crc = 0xFFFF;
        const polinomio = 0x1021;
        for (let i = 0; i < payload.length; i++) {
            crc ^= payload.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ polinomio;
                } else {
                    crc <<= 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    async gerarQRCodeBase64(pixString) {
        return await QRCode.toDataURL(pixString, { errorCorrectionLevel: 'H', type: 'image/png' });
    }
}

module.exports = new PixString();
