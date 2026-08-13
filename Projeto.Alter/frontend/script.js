// --- Alter: front-end ---
const API_URL = 'http://localhost:3000';

// --- Respostas da triagem (perfil/personalidade) ---
let respostasTriagem = {
    perfil: null,
    hobbyCategoria: null,
    carreira: null,
    pilarPrioritario: null,
    motivacao: null
};

// --- Gerenciador de estados ao carregar a página ---
window.onload = function () {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const triagemCompleta = localStorage.getItem('triagemCompleta');

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

    ativarArraste('.carrossel-triagem');
    ativarArraste('.carrossel-instagram');
};

// --- Triagem (teste de perfil) ---
function selecionarOpcao(grupo, valor, elemento) {
    respostasTriagem[grupo] = valor;
    const opcoes = elemento.parentElement.querySelectorAll('.opcao-triagem');
    opcoes.forEach(op => op.classList.remove('selecionada'));
    elemento.classList.add('selecionada');
}

function irParaProximaPagina(botao) {
    const paginaAtual = botao.closest('.pagina-triagem');
    const proximaPagina = paginaAtual.nextElementSibling;
    if (proximaPagina) {
        proximaPagina.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
}

function finalizarTriagem() {
    const hobbyDetalhe = document.getElementById('triagemHobbyDetalhe').value;

    if (!respostasTriagem.perfil || !respostasTriagem.hobbyCategoria || !respostasTriagem.carreira ||
        !respostasTriagem.pilarPrioritario || !respostasTriagem.motivacao) {
        alert("Para calibrar o Alter e criar seus desafios, responda todas as perguntas do perfil.");
        return;
    }

    localStorage.setItem('triagem_perfil', respostasTriagem.perfil);
    localStorage.setItem('triagem_hobby_categoria', respostasTriagem.hobbyCategoria);
    localStorage.setItem('triagem_hobby_detalhe', hobbyDetalhe);
    localStorage.setItem('triagem_carreira', respostasTriagem.carreira);
    localStorage.setItem('triagem_pilar_prioritario', respostasTriagem.pilarPrioritario);
    localStorage.setItem('triagem_motivacao', respostasTriagem.motivacao);
    localStorage.setItem('triagemCompleta', 'true');

    document.getElementById('tela-triagem').style.display = 'none';
    document.getElementById('tela-login').style.display = 'block';
}

// --- Login ---
async function fazerLogin() {
    const emailDigitado = document.getElementById('emailInput').value;
    const senhaDigitada = document.getElementById('senhaInput').value;

    try {
        const resposta = await fetch(`${API_URL}/login`, {
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
        alert("Não foi possível conectar com o servidor do Alter. Verifique se o back-end está rodando.");
    }
}

// --- Check-in diário ---
async function enviarCheckin() {
    const input = document.getElementById('campoProgresso').value;
    if (!input) {
        alert("Escreva seu progresso antes de registrar.");
        return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    const ultimoCheckin = localStorage.getItem('ultimoCheckin');
    let streakAtual = parseInt(localStorage.getItem('streak')) || 0;

    if (ultimoCheckin === hoje) {
        alert("Check-in diário já computado.");
        return;
    }

    if (ultimoCheckin) {
        const diferencaDias = (new Date(hoje) - new Date(ultimoCheckin)) / (1000 * 3600 * 24);
        if (diferencaDias === 1) {
            streakAtual++;
        } else {
            streakAtual = 1;
            alert("O fogo do seu streak apagou. Recomeçando do Nível 1.");
        }
    } else {
        streakAtual = 1;
    }

    try {
        const resposta = await fetch(`${API_URL}/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progresso: input })
        });
        const dados = await resposta.json();
        if (resposta.ok) {
            alert(dados.mensagem);
        }
    } catch (erro) {
        console.warn("Não foi possível registrar o check-in no servidor; progresso salvo localmente.");
    }

    localStorage.setItem('ultimoCheckin', hoje);
    localStorage.setItem('streak', streakAtual);
    atualizarTelaStreak(streakAtual);
    document.getElementById('campoProgresso').value = '';
}

// --- Atualiza avatar/nível na tela conforme o streak ---
function atualizarTelaStreak(streak) {
    document.getElementById('contador-streak').innerText = `🔥 ${streak} Dias`;
    const avatar = document.querySelector('.avatar-placeholder');
    const nivel = document.querySelector('#pagina-avatar h1');

    if (streak >= 7 && streak < 21) {
        nivel.innerText = "Nível 2";
        avatar.style.backgroundColor = "#4caf50";
        avatar.style.borderRadius = "30%";
        avatar.style.boxShadow = "none";
    } else if (streak >= 21 && streak < 66) {
        nivel.innerText = "Nível 3 (Mestre)";
        avatar.style.backgroundColor = "#ff9800";
        avatar.style.borderRadius = "10%";
        avatar.style.boxShadow = "none";
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

// --- Logout ---
function fazerLogout() {
    localStorage.clear(); // Limpa login e triagem para testes rápidos
    window.location.reload(); // Recarrega a aplicação do estado zero
}

// --- Arrastar com o mouse para navegar nos carrosséis ---
// (no touch, o navegador já faz isso nativamente, então só ativamos para mouse)
function ativarArraste(seletor) {
    const container = document.querySelector(seletor);
    if (!container) return;

    let arrastando = false;
    let posicaoInicialX = 0;
    let scrollInicial = 0;

    container.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        arrastando = true;
        container.classList.add('arrastando');
        posicaoInicialX = e.pageX;
        scrollInicial = container.scrollLeft;
        container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', (e) => {
        if (!arrastando) return;
        const distancia = e.pageX - posicaoInicialX;
        container.scrollLeft = scrollInicial - distancia;
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach((evento) => {
        container.addEventListener(evento, () => {
            arrastando = false;
            container.classList.remove('arrastando');
        });
    });
}