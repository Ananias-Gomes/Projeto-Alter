const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuarioCadastrado = {
        email: 'foco@alter.com',
        senha: '123'
    };

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
async function fazerLogin() {
    const emailDigitado = document.getElementById('emailInput').value;
    const senhaDigitada = document.getElementById('senhaInput').value;

    try {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailDigitado, senha: senhaDigitada })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            document.getElementById('tela-login').style.display = 'none';
            document.getElementById('tela-dashboard').style.display = 'block';
        } else {
            // Erro de senha
            alert("Erro: " + dados.mensagem);
        }
    } catch (erro) {
        alert("Erro ao conectar com o servidor. Verifique se o back-end está rodando.");
    }
}


async function enviarCheckin() {
    const textoDigitado = document.getElementById('campoProgresso').value;

    if (!textoDigitado) {
        alert("Por favor, digite seu progresso antes de registrar.");
        return; 
    }

    try {
        const resposta = await fetch('http://localhost:3000/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progresso: textoDigitado })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.mensagem);
            document.getElementById('campoProgresso').value = ''; 
        }
    } catch (erro) {
        alert("Erro ao enviar check-in.");
    }
}