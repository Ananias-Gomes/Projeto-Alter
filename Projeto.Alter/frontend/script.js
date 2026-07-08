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
async function enviarCheckin() {
    const input = document.getElementById('campoProgresso').value;
    if (!input) {
        alert("Por favor, escreva o seu foco ");
        return;
}

const hoje = new Date().toISOString().split('T')[0];

let ultimoCheckin = localStorage.getItem('ultimoCheckin');
let streakAtual = parseInt(localStorage.getItem('streakAtual')) || 0;

if (ultimoCheckin === hoje) {
    const dataHoje = new Date();
    const dataAntiga = new Date(ultimoCheckin);
    const diferencaTempo = datahHoje - dataAntiga;
    const diferencaDias = diferencaTempo / (1000 * 60 * 60 * 24);

    if (diferencaDias == 1) {
        streakAtual++;
    } else if (diferencaDias > 1) {
        streakAtual = 1;
        alert("Parece que você perdeu o streak. Mas não desanime, recomece hoje!");
    }
} else {
    streakAtual = 1;
  }
}
 localStorage.sytem('ultimoCheckin', hoje);
 localStorage.setItem('streakAtual', streakAtual);

 atualizarStreak(streakAtual);
 document.getElementById('campoProgresso').value = '';
    alert("Progresso registrado com sucesso! Seu streak atual é de ${streakAtual} dias. ");

    function atualizarStreak(streak) {
        document.getElementById('contadorStreak').innerText = `streak Atual: ${streak} dias`;
        const avatar = document.querySelector('.avatar-placeholder');
        const nivel = document.querySelector('#pagina-avatar h1');

        if (streak >= 7 && streak < 21) {
            nivel.innerText = "Nível 2";
            avatar.style.backgroundColor = '#4caf50';
            avatar.style.borderRadius = "30%";
    }
else if (streak >= 21 && streak < 66) {
    nivel.innerText = "Nível 3";
    avatar.style.backgroundColor = '#ff9800';
    avatar.style.borderRadius = "10%";
}
else if (streak >= 66) {
    nivel.innerText = "Ikigai Alcançado!";
    avatar.style.backgroundColor = '#2196f3';
    avatar.style.borderRadius = "50%";
 }
 else {
    nivel.innerText = "Nível 1";
    avatar.style.backgroundColor = '#e1e1e1';
    avatar.style.borderRadius = "50%";
    avatar.style.boxShadow = "none";
  }
}
window.onload = function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if(usuarioLogado) {
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('tela-dashboard').style.display = 'block';
        const streakSalvo = parseInt(localStorage.getItem('streakAtual')) || 0;
        atualizarStreak(streakSalvo);
    }
}
// --- NOVO GERENCIADOR DE ESTADOS (window.onload) ---
window.onload = function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const triagemCompleta = localStorage.getItem('triagemCompleta');

    // Força o fechamento visual de tudo antes do veredito
    document.getElementById('tela-triagem').style.display = 'none';
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('tela-dashboard').style.display = 'none';

    if (usuarioLogado) {

        document.getElementById('tela-dashboard').style.display = 'block';
        atualizarTelaStreak(parseInt(localStorage.getItem('streak')) || 0);
    
    } else if (triagemCompleta) {
        document.getElementById('tela-login').style.display = 'block';
   
    } else {
        document.getElementById('tela-triagem').style.display = 'block';
    }
};

function finalizarTriagem() {
    const hobby = document.getElementById('triagemHobby').value;
    const hobbyObj = document.getElementById('triagemHobbyObjetivo').value;
    const carreira = document.getElementById('triagemCarreira').value;
    const corpo = document.getElementById('triagemCorpo').value;
    const mente = document.getElementById('triagemMente').value;
    const espirito = document.getElementById('triagemEspirito').value;

    if (!hobby || !carreira || !corpo || !mente || !espirito) {
        alert("Para calibrar o Alter e criar seus desafios, preencha todos os campos da tríade.");
        return;
    }
    localStorage.setItem('triagem_hobby', hobby);
    localStorage.setItem('triagem_hobby_objetivo', hobbyObj);
    localStorage.setItem('triagem_carreira', carreira);
    localStorage.setItem('triagem_corpo', corpo);
    localStorage.setItem('triagem_mente', mente);
    localStorage.setItem('triagem_espirito', espirito);

    localStorage.setItem('triagemCompleta', 'true');

    document.getElementById('tela-triagem').style.display = 'none';
    document.getElementById('tela-login').style.display = 'block';
}
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
            localStorage.setItem('usuarioLogado', emailDigitado);
            document.getElementById('tela-login').style.display = 'none';
            document.getElementById('tela-dashboard').style.display = 'block';
            atualizarTelaStreak(parseInt(localStorage.getItem('streak')) || 0);
        } else {
            alert("Erro: " + dados.mensagem);
        }
    } catch (erro) {
        alert("Não foi possível conectar com o servidor do Alter.");
    }
}

async function enviarCheckin() {
    const input = document.getElementById('campoProgresso').value;
    if (!input) return alert("Escreva seu progresso.");

    const hoje = new Date().toISOString().split('T')[0]; 
    let ultimoCheckin = localStorage.getItem('ultimoCheckin');
    let streakAtual = parseInt(localStorage.getItem('streak')) || 0;

    if (ultimoCheckin === hoje) {
        return alert("Check-in diário já computado.");
    }

    if (ultimoCheckin) {
        const diferencaDias = (new Date(hoje) - new Date(ultimoCheckin)) / (1000 * 3600 * 24);
        if (diferencaDias === 1) {
            streakAtual++;
        } else if (diferencaDias > 1) {
            streakAtual = 1;
            alert("O fogo do seu streak apagou. Recomeçando do Nível 1.");
        }
    } else {
        streakAtual = 1;
    }

    localStorage.setItem('ultimoCheckin', hoje);
    localStorage.setItem('streak', streakAtual);
    atualizarTelaStreak(streakAtual);
    document.getElementById('campoProgresso').value = '';
}

function atualizarTelaStreak(streak) {
    document.getElementById('contador-streak').innerText = `🔥 ${streak} Dias`;
    const avatar = document.querySelector('.avatar-placeholder');
    const nivel = document.querySelector('#pagina-avatar h1');

    if (streak >= 7 && streak < 21) {
        nivel.innerText = "Nível 2";
        avatar.style.backgroundColor = "#4caf50";
        avatar.style.borderRadius = "30%";
    } else if (streak >= 21 && streak < 66) {
        nivel.innerText = "Nível 3 (Mestre)";
        avatar.style.backgroundColor = "#ff9800";
        avatar.style.borderRadius = "10%";
    } else if (streak >= 66) {
        nivel.innerText = "Nível Máximo (Ikigai)";
        avatar.style.backgroundColor = "#2196f3";
        avatar.style.borderRadius = "50%";
        avatar.style.boxShadow = "0 0 20px #2196f3";
    } else {
        nivel.innerText = "Nível 1";
        avatar.style.backgroundColor = "#e1e1e1";
        avatar.style.borderRadius = "50%";
        avatar.style.boxShadow = "none";
    }
}

function fazerLogout() {
    localStorage.clear(); // Limpa login e triagem para testes rápidos
    window.location.reload(); // Recarrega a aplicação do estado zero
}