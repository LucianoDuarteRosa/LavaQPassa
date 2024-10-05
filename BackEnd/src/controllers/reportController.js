const accountsPayableModel = require("../models/accountsPayableModel");
const saleDetailModel = require("../models/saleDetailModel");
const productModel = require("../models/productModel")
const converter = require('../../utils/converter');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const validator = require('../../utils/inputsValidator');
const QrCodePix = require('qrcode-pix');

function drawTableLine(doc, y) {
  doc.lineWidth(0.5)
    .moveTo(50, y) // Início da linha na margem esquerda
    .lineTo(550, y) // Fim da linha na margem direita
    .stroke();
}

class ReportController {


  async readPaymentMoth(req, res) {
    /*
    #swagger.tags = ['Relatório']
    #swagger.summary = 'Gera PDF relatório mensal'
    #swagger.description = 'Retorna um PDF contendo o relatório mensal do mês solicitado'
 
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }

    #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                month: { type: 'integer'},
                year: { type: 'integer'}
              }
            }
          }
        }
      }

    #swagger.responses[200] = {
      description: 'PDF gerado com sucesso',
      content: {
        "application/pdf": {
          schema: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: 'Venda detalhada não encontrada',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Nenhuma dado encontrado!' }
            }
          }
        }
      }
    }

    #swagger.responses[401] = {
      description: 'Token inválido, expirado ou sem o token',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Token inválido' }
            }
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: 'Erro interno do servidor',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          }
        }
      }
    }

     #swagger.responses[400] = {
        description: 'Erro ao validar campos de entrada',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
*/

    const { month, year } = req.body;
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
      const date = converter.monthTenth(year, month);
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

      for (let [index, payable] of result.entries()) {
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

          var pixkey = payable.PixKey;

          if (payable.TypeKey == "Telefone") {
            // Remove espaços em branco e caracteres especiais
            pixkey = pixkey.replace(/\s+/g, '').replace(/[^0-9]/g, '');

            // Verifica se o número começa com "55" ou "+55"
            if (pixkey.startsWith("55")) {
              // Remove o zero após o "55", se houver
              if (pixkey[2] === "0") {
                pixkey = `+55${pixkey.substring(3)}`;
              } else {
                pixkey = `+${pixkey}`;
              }
            } else {
              // Remove o zero inicial, se houver, e adiciona "+55"
              if (pixkey.startsWith("0")) {
                pixkey = pixkey.substring(1);
              }
              pixkey = `+55${pixkey}`;
            }
          }
          const qrCodePix = QrCodePix.QrCodePix({
            version: '01',
            key: pixkey, // Chave Pix (e-mail neste caso)
            name: payable.ClientSupplierName, // Nome do recebedor
            city: payable.City, // Cidade do recebedor
            transactionId: '', // ID da transação (max 25 caracteres)
            message: 'Acerto Mensal', // Mensagem (Opcional)
            cep: payable.ZipCode, // CEP (Opcional)
            value: valueCostProduct, // Valor da transação
            currency: '986', // Código da moeda (BRL)
            country: 'BR', // País do recebedor
          });
          const qrCodeImage = await qrCodePix.base64();

          doc.fontSize(20).font('Times-Bold').text(`QRCode Pix`, 100, mapY + 135);
          doc.fontSize(16).font('Times-Bold').text(`Valor: R$ ${valueCostProduct.toFixed(2)}`, 100, mapY + 170);
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
            console.error('Erro em enviar o arquivo:', err);
            // Evita enviar outra resposta caso ocorra um erro ao enviar o arquivo
          }
          fs.unlinkSync(filePath);
        });
      });

    } catch (error) {
      console.error('Erro en gerar o relatório:', error);
      if (!res.headersSent) {
        res.status(500).send('Erro en gerar o relatório.');
      }
    }
  }

  async readProductClient(req, res) {
    /*
    #swagger.tags = ['Relatório']
    #swagger.summary = 'Gera PDF estoque por cliente'
    #swagger.description = 'Retorna um PDF contendo o relatório de produtos por cliente'
 
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }

    #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                idClientSupplier: { type: 'integer'},
              }
            }
          }
        }
      }

    #swagger.responses[200] = {
      description: 'PDF gerado com sucesso',
      content: {
        "application/pdf": {
          schema: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: 'Cliente não tem dados para exibir',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Nenhuma informação encontrada!' }
            }
          }
        }
      }
    }

    #swagger.responses[401] = {
      description: 'Token inválido, expirado ou sem o token',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Token inválido' }
            }
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: 'Erro interno do servidor',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          }
        }
      }
    }

     #swagger.responses[400] = {
        description: 'Erro ao validar campos de entrada',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
*/

    const reqBody = req.body;
    let errors = [];

    const testClient = validator.integerValidator(reqBody.idClient);
    if (testClient !== true) {
      errors.push(testClient);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const result = await productModel.readProductClient(reqBody.idClient);
      const imagePath = path.join(__dirname, '..', '..', 'public', 'image', 'logo.jpg');
      const imagePathSave = path.join(__dirname, '..', '..', 'public', 'report');

      const doc = new PDFDocument();
      const filePath = path.join(imagePathSave, `Relatorio_${reqBody.name}.pdf`);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      let currentPage = 1;
      let productCount = 0;
      let valueCostProduct = 0;
      let valueSaleProduct = 0;
      let y = 320; // Ajuste inicial da posição Y para a tabela de produtos

      // Função para desenhar o cabeçalho
      const drawHeader = () => {
        doc.fontSize(30).font('Times-Bold').text(`LavaQPassa Brechó`, 100, 100);
        doc.image(imagePath, 450, 60, {
          fit: [100, 100],
          align: 'right',
          valign: 'center',
        });
        doc.moveDown(1);
        doc.fontSize(25).font('Times-Bold').text(`Relatório de estoque ${result[0].ClientSupplierName}`, 80);
        doc.fontSize(12).font('Times-Bold').text(`Nome: ${result[0].ClientSupplierName}`, 30);
        doc.fontSize(12).font('Times-Bold').text(`Telefone: ${result[0].Phone}`, 30);
        doc.fontSize(12).font('Times-Bold').text(
          `Endereço: ${result[0].Address}, n° ${result[0].Number}, ${result[0].Neighborhood}, ${result[0].City}-${result[0].State}`,
          30
        );

        const tableTop = 280; // Altura inicial da tabela
        const codProductX = 50;
        const nameProductX = 120;
        const costX = 280;
        const priceX = 380;
        const saleX = 480;
        doc.fontSize(10).font('Times-Bold');
        doc.text('Cód.Prod.', codProductX, tableTop);
        doc.text('Descrição', nameProductX, tableTop);
        doc.text('Preço de Custo', costX, tableTop);
        doc.text('Preço de Venda', priceX, tableTop);
        doc.text('Vendido', saleX, tableTop);
        drawTableLine(doc, tableTop + 20);
        y = tableTop + 30; // Atualiza a posição inicial da tabela de produtos
      };

      drawHeader(); // Desenhar o cabeçalho inicial

      // Função para verificar se precisa adicionar nova página
      const checkNewPage = () => {
        if (y > 650) { // Se a posição Y estiver muito baixa, criar nova página
          doc.fontSize(10).font('Times-Roman').text(`Página ${currentPage}`, 500, 700);
          doc.addPage();
          currentPage++;
          drawHeader();
          y = 320; // Reiniciar Y para a nova página
        }
      };

      // Loop para desenhar produtos
      for (const product of result) {
        checkNewPage(); // Verificar se precisa mudar de página

        // Desenhar o produto na tabela
        doc.fontSize(10).font('Times-Roman');
        doc.text(product.IdProduct, 50, y);
        doc.text(product.ProductName, 120, y);
        doc.text(`R$ ${product.CostPrice.toFixed(2)}`, 280, y);
        doc.text(`R$ ${product.SalePrice.toFixed(2)}`, 380, y);
        if (product.Sold) {
          const checkImagePath = path.join(__dirname, '..', '..', 'public', 'image', 'check.png');
          doc.image(checkImagePath, 500, y - 7, { width: 20, height: 20 });
        }

        // Atualiza valores e desenha as linhas
        valueCostProduct += product.CostPrice;
        valueSaleProduct += product.SalePrice;
        drawTableLine(doc, y + 15);

        // Incrementa o contador de produtos e a posição vertical (y)
        productCount++;
        y += 25; // Incrementa a altura para o próximo item
      }

      // Finalização do relatório (verificação de espaçamento)
      if (y > 680) { // Adiciona uma nova página se estiver muito no fim da página
        doc.addPage();
        drawHeader();
        y = 320;
      }

      // Desenhar totais logo abaixo da última linha da tabela
      doc.font('Times-Bold').text(`R$ ${valueCostProduct.toFixed(2)}`, 280, y);
      doc.font('Times-Bold').text(`R$ ${valueSaleProduct.toFixed(2)}`, 380, y);

      doc.fontSize(10).font('Times-Roman').text(`Página ${currentPage}`, 500, 700);

      doc.end();

      stream.on('finish', () => {
        res.download(filePath, (err) => {
          if (err) {
            console.error('Erro em enviar o arquivo:', err);
          }
          fs.unlinkSync(filePath); // Deleta o arquivo depois de enviar
        });
      });
    } catch (error) {
      console.error('Erro em gerar o relatório:', error);
      if (!res.headersSent) {
        res.status(500).send('Erro em gerar o relatório.');
      }
    }
  }

  async readDocument(req, res) {
    /*
      #swagger.tags = ['Documentação']
      #swagger.summary = 'Documentação da Aplicação'
      #swagger.description = 'Retorna um PDF contendo documentação'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
  
      #swagger.responses[200] = {
        description: 'PDF gerado com sucesso',
        content: {
          "application/pdf": {
            schema: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      }
  
      #swagger.responses[401] = {
        description: 'Token inválido, expirado ou sem o token',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Token inválido' }
              }
            }
          }
        }
      }
  
      #swagger.responses[500] = {
        description: 'Erro interno do servidor',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
  */
    try {
      const filePath = path.join(__dirname, '..', '..', 'public', 'application.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).sendFile(filePath);
    } catch (error) {
      res.status(500).send('Erro ao enviar o documento.');
    }
  }
}

module.exports = new ReportController();
