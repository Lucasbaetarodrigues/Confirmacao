let convidados = [];
let familiaAtual = [];

const API_URL = 'https://script.google.com/macros/s/AKfycbz-I7Hh-AQoZiNVAW3kzzPuzmCykIQPY8363KdIk9A-UBaZoemdeVM_F19PgsJQtw8T/exec';
const API_POST_URL = 'https://script.google.com/macros/s/AKfycbz-I7Hh-AQoZiNVAW3kzzPuzmCykIQPY8363KdIk9A-UBaZoemdeVM_F19PgsJQtw8T/exec';

async function buscarFamilia() {
    const nomeDigitado = document.getElementById('nome').value.trim().toLowerCase();
    
    if (!nomeDigitado) {
        alert('Por favor, digite seu nome.');
        return;
    }

    try {
        if (convidados.length === 0) {
            const response = await fetch(API_URL);
            convidados = await response.json();
            console.log("Convidados carregados:", convidados); // Debug
        }

        const convidadoEncontrado = convidados.find(c => removerAcentos(c.nome.toLowerCase()) === removerAcentos(nomeDigitado));

        if (!convidadoEncontrado) {
            alert('Nome não encontrado! Verifique se digitou corretamente.');
            return;
        }

        const familia = convidadoEncontrado.familia;

        familiaAtual = convidados
            .filter(c => c.familia === familia)
            .map(c => c.nome);

        console.log("Membros da família encontrados:", familiaAtual); // Debug

        mostrarCheckboxes(familiaAtual);
    } catch (error) {
        console.error("Erro ao buscar convidados:", error);
        alert("Erro ao carregar lista de convidados. Tente novamente mais tarde.");
    }
}

function mostrarCheckboxes(membros) {
    const container = document.getElementById('familia-container');
    const form = document.getElementById('familiaForm');
    const mensagem = document.getElementById('mensagem-sucesso');

    form.innerHTML = '';
    mensagem.style.display = 'none';

    membros.forEach(nome => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = nome;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + nome));
        form.appendChild(label);
    });

    container.style.display = 'block';
}

async function confirmarPresenca() {
    const checkboxes = document.querySelectorAll('#familiaForm input[type=checkbox]:checked');
    const nomesSelecionados = Array.from(checkboxes).map(cb => cb.value);

    if (nomesSelecionados.length === 0) {
        alert('Selecione pelo menos um nome para confirmar.');
        return;
    }

    try {
        const promises = nomesSelecionados.map(nome => {
            return fetch(API_POST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `nome=${encodeURIComponent(nome)}&status=Confirmado`
            });
        });

        await Promise.all(promises);

        document.getElementById('nome').value = '';
        document.getElementById('familia-container').style.display = 'none';
        document.getElementById('mensagem-sucesso').style.display = 'block';
    } catch (error) {
        console.error('Erro ao confirmar presença:', error);
        alert('Ocorreu um erro ao confirmar. Tente novamente.');
    }
}

// Função para ignorar acentos
function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
