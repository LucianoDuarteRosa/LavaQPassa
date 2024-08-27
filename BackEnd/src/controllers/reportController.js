const accountsPayableModel = require("../models/accountsPayableModel");
const saleDeatilModel = require("../models/saleDetailModel");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const validator = require('../../utils/inputsValidator')

class ReportController {

  async readList(req, res) {
    const { month, year } = req.body;
    let errors = [];

    const testMonth = validator.integerMinMaxValidator(month, 2, 2);
    const testYear = validator.integerMinMaxValidator(year, 4, 4);

    if (testMonth !== true) {
      errors.push(testMonth)
    }
    if (testYear !== true) {
      errors.push(testYear)
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    if (!month || !year) {
      return res.status(400).send('Digite mês e ano válido.');
    }

    try {
      const result = accountsPayableModel.dashPayableReport(month, year); // arrumar esse metódo
      const imagePath = path.join(__dirname, 'public', 'image', 'logo.jpg');
      const imagePathSave = path.join(__dirname, 'public', 'report');

      const doc = new PDFDocument();
      const filePath = path.join(imagePathSave, `Relatorio_${month}_${year}.pdf`);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      result.forEach((payable, index) => {

        let currentPage = 1; // Inicia o contador de páginas
        let productCount = 0; // Contador de produtos

        const drawInitialHeaders = () => {
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
          doc.fontSize(12).font('Times-Bold').text(`E-mail: ${payable.Email}`, 30);
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
        };

        drawInitialHeaders();

        //Tabela
        const tableTop = 280;
        const codProductX = 50;
        const nameProductX = 150;
        const costX = 300;
        const priceX = 450;

        // Linhas da tabela
        let valueCostProduct = 0;
        let valueSaleProduct = 0;
        let mapY = 0

        saleDetail.forEach((saleDetail) => {
          // Verifica se precisa adicionar uma nova página
          if (productCount > 0 && productCount % 12 === 0) {
            // Escreve o número da página no canto inferior antes de adicionar uma nova página
            doc.fontSize(10).font('Times-Roman').text(`Página ${currentPage}`, 500, 700);
            currentPage++; // Incrementa o contador de páginas
            doc.addPage(); // Adiciona uma nova página

            // Redefine as posições Y e o contador de produtos para a nova página
            productCount = 0;
            // Desenha os cabeçalhos novamente na nova página
            drawInitialHeaders();
          }

          const y = tableTop + 25 + (productCount * 25);
          mapY = y;
          doc.fontSize(10).font('Times-Roman');
          doc.text(saleDetail.IdProduct, codProductX, y);
          doc.text(saleDetail.ProductName, nameProductX, y);
          doc.text(`R$ ${saleDetail.CostPrice.toFixed(2)}`, costX, y);
          doc.text(`R$ ${saleDetail.SalePrice.toFixed(2)}`, priceX, y);
          valueCostProduct += saleDetail.CostPrice;
          valueSaleProduct += saleDetail.SalePrice;
          // Desenha bordas ao redor das células
          drawTableLine(doc, y - 10); // Linha superior da célula
          drawTableLine(doc, y + 15); // Linha inferior da célula
          productCount++;
        });
        doc.font('Times-Bold').text(`R$ ${valueCostProduct.toFixed(2)}`, costX, mapY + 25);
        doc.font('Times-Bold').text(`R$ ${valueSaleProduct.toFixed(2)}`, priceX, mapY + 25);

        // Desenha a última linha após a tabela
        drawTableLine(doc, tableTop + 40 + (productCount * 25));

        doc.fontSize(20).font('Times-Bold').text(`QRCode Pix`, 200, mapY + 100);

        doc.fontSize(10).font('Times-Roman').text(`Página ${currentPage}`, 500, 700);
        // Se não for o último cliente, adiciona uma nova página
        if (index < result.length - 1) {
          doc.addPage();
          productCount = 0;
          currentPage = 1;
        }
      });

      doc.end();


      stream.on('finish', () => {
        // Enviar o PDF gerado ao cliente
        res.download(filePath, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
          }
          // Após enviar, você pode excluir o arquivo temporário, se desejar
          fs.unlinkSync(filePath);
        });
      });

    } catch (error) {

    }
  }

  drawTableLine(doc, y) {
    doc.lineWidth(0.5)
      .moveTo(50, y) // Início da linha na margem esquerda
      .lineTo(550, y) // Fim da linha na margem direita
      .stroke();
  }
}

module.exports = new ReportController();
