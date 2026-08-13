const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const usuarioCadastrado = {
    email: 'foco@alter.com',
    senha: '123'
};

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (email === usuarioCadastrado.email && senha === usuarioCadastrado.senha) {
        return res.status(200).json({ mensagem: 'Acesso liberado!' });
    }

    return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
});

app.post('/checkin', (req, res) => {
    const { progresso } = req.body;

    console.log('Novo check-in recebido no banco de dados:', progresso);

    return res.status(200).json({ mensagem: 'Progresso salvo! Mantenha a disciplina.' });
});

app.listen(3000, () => {
    console.log('O servidor do Alter está rodando na porta 3000!');
});