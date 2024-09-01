const accountsPayableModel = require("../models/accountsPayableModel");
const saleDetailModel = require("../models/saleDetailModel");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const validator = require('../../utils/inputsValidator');
const PixString = require('../../utils/pixString');
const QRCode = require('qrcode');
const converter = require('../../utils/converter');

function drawTableLine(doc, y) {
  doc.lineWidth(0.5)
    .moveTo(50, y) // Início da linha na margem esquerda
    .lineTo(550, y) // Fim da linha na margem direita
    .stroke();
}

class ReportController {


  async readList(req, res) {
    const { month, year } = req.body;
    const date = converter.getMonthStartAndEndDates();
    let errors = [];

    const testMonth = validator.integerValidator(parseInt(month));
    const testYear = validator.integerValidator(parseInt(year));

    if (testMonth !== true) {
      errors.push(testMonth);
    }
    if (testYear !== true) {
      errors.push(testYear);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    if (!month || !year) {
      return res.status(400).send('Digite mês e ano válido.');
    }

    try {
      const result = await accountsPayableModel.dashPayableReport(date);
      const imagePath = path.join(__dirname, '..', '..', 'public', 'image', 'logo.jpg');
      const imagePathSave = path.join(__dirname, '..', '..', 'public', 'report');

      const doc = new PDFDocument();
      const filePath = path.join(imagePathSave, `Relatorio_${month}_${year}.pdf`);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      let previousClientName = '';
      let currentPage = 1;
      let productCount = 0;
      let valueCostProduct = 0;
      let valueSaleProduct = 0;
      let mapY = 0;

      for (const [index, payable] of result.entries()) {
        if (payable.ClientSupplierName !== previousClientName) {
          previousClientName = payable.ClientSupplierName;

          doc.fontSize(30).font('Times-Bold').text(`LavaQPassa Brechó`, 100, 100);
          doc.image(imagePath, 450, 60, {
            fit: [100, 100],
            align: 'right',
            valign: 'center'
          });
          doc.moveDown(1);
          doc.fontSize(25).font('Times-Bold').text(`Relatório ${month}/${year}`, 200);
          doc.fontSize(12).font('Times-Bold').text(`Nome: ${payable.ClientSupplierName}`, 30);
          doc.fontSize(12).font('Times-Bold').text(`Telefone: ${payable.Phone}`, 30);
          doc.fontSize(12).font('Times-Bold').text(`Chave-Pix: ${payable.TypeKey} - ${payable.PixKey}`, 30);
          doc.fontSize(12).font('Times-Bold').text(`Endereço: ${payable.Address}, n° ${payable.Number}, ${payable.Neighborhood}, ${payable.City}-${payable.State}`, 30);

          const tableTop = 280;
          const codProductX = 50;
          const nameProductX = 150;
          const costX = 300;
          const priceX = 450;
          doc.fontSize(10).font('Times-Bold');
          doc.text('Cód.Produto', codProductX, tableTop);
          doc.text('Descrição', nameProductX, tableTop);
          doc.text('Preço de Custo', costX, tableTop);
          doc.text('Preço de Venda', priceX, tableTop);
          drawTableLine(doc, tableTop + 15);
        }

        const saleDetail = await saleDetailModel.read(payable.IdSale);

        for (const saleDetailItem of saleDetail) {
          if (productCount > 0 && productCount % 12 === 0) {
            doc.fontSize(10).font('Times-Roman').text(`Página ${currentPage}`, 500, 700);
            currentPage++;
            doc.addPage();
            productCount = 0;
          }

          const y = 280 + 25 + (productCount * 25);
          mapY = y;
          doc.fontSize(10).font('Times-Roman');
          doc.text(saleDetailItem.IdProduct, 50, y);
          doc.text(saleDetailItem.ProductName, 150, y);
          doc.text(`R$ ${saleDetailItem.CostPrice.toFixed(2)}`, 300, y);
          doc.text(`R$ ${saleDetailItem.SalePrice.toFixed(2)}`, 450, y);
          valueCostProduct += saleDetailItem.CostPrice;
          valueSaleProduct += saleDetailItem.SalePrice;
          drawTableLine(doc, y - 10);
          drawTableLine(doc, y + 15);
          productCount++;
        }

        if (index === result.length - 1 || result[index + 1].ClientSupplierName !== payable.ClientSupplierName) {
          doc.font('Times-Bold').text(`R$ ${valueCostProduct.toFixed(2)}`, 300, mapY + 25);
          doc.font('Times-Bold').text(`R$ ${valueSaleProduct.toFixed(2)}`, 450, mapY + 25);
          drawTableLine(doc, 280 + 40 + (productCount * 25));

          const pixString = PixString.gerarPixString(
            payable.TypeKey,
            payable.PixKey,
            parseFloat(valueSaleProduct).toFixed(2),
            payable.ClientSupplierName,
            payable.City,
            'Acerto mensal.'
          );

          const qrCodeImage = await PixString.gerarQRCodeBase64(pixString);

          doc.fontSize(20).font('Times-Bold').text(`QRCode Pix`, 100, mapY + 195);
          doc.image(qrCodeImage, 250, mapY + 120, { fit: [150, 150] });

          doc.fontSize(10).font('Times-Roman').text(`Página ${currentPage}`, 500, 700);
          if (index < result.length - 1) {
            doc.addPage();
            valueCostProduct = 0;
            valueSaleProduct = 0;
            productCount = 0;
            currentPage = 1;
          }
        }
      }

      doc.end();

      stream.on('finish', () => {
        res.download(filePath, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            // Evita enviar outra resposta caso ocorra um erro ao enviar o arquivo
          }
          fs.unlinkSync(filePath);
        });
      });

    } catch (error) {
      console.error('Error generating report:', error);
      if (!res.headersSent) {
        res.status(500).send('Error generating report');
      }
    }
  }
}

module.exports = new ReportController();
