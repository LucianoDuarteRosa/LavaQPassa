const jwt = require('jsonwebtoken');
const tokenModel = require('../src/models/tokenModel');

class AuthMiddleware {

    static authMiddleware = async (req, res, next) => {
        try {
            // Obter o token do header da requisição
            const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token format

            if (!token) {
                return res.status(401).json({ message: 'Token não fornecido.' });
            }

            // Verificar o token JWT
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Token inválido.' });
                }

                // Token válido, consultar no banco para verificar se o token ainda é válido
                try {
                    const tokenRecord = await tokenModel.read(token);
                    if (!tokenRecord[0]) {
                        return res.status(401).json({ message: 'Token não encontrado.' });
                    }

                    const tokenExpiration = new Date(tokenRecord[0].ExpiresToken);
                    if (new Date() > tokenExpiration) {
                        return res.status(401).json({ message: 'Token expirado.' });
                    }

                    // Se o token for válido, passar o ID do usuário para a próxima rota
                    req.body.userId = tokenRecord[0].IdUser;
                    next();
                } catch (dbError) {
                    console.error('Erro ao consultar o banco de dados:', dbError);
                    res.status(500).json({ message: 'Erro ao validar o token.' });
                }
            });
        } catch (error) {
            console.error('Erro na autenticação:', error);
            res.status(500).json({ message: 'Erro no servidor.' });
        }
    };
}

module.exports = AuthMiddleware;
