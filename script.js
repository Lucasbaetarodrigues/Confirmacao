let convidados = [];
let familiaAtual = [];

const API_URL = 'https://script.google.com/macros/s/AKfycbz-I7Hh-AQoZiNVAW3kzzPuzmCykIQPY8363KdIk9A-UBaZoemdeVM_F19PgsJQtw8T/exec';
const API_POST_URL = API_URL;

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
    }

    const convidadoEncontrado = convidados.find(c => removerAcentos(c.nome.toLowerCase()) === removerAcentos(nomeDigitado));

    if (!convidadoEncontrado) {
      alert('Nome não encontrado.');
      return;
    }

    const familia = convidadoEncontrado.familia;

    familiaAtual = convidados
      .filter(c => c.familia === familia)
      .map(c => c.nome);

    mostrarCheckboxes(familiaAtual);
  } catch (err) {
    alert("Erro ao buscar lista. Tente novamente.");
    console.error(err);
  }
}

function mostrarCheckboxes(membros) {
  const form = document.getElementById('familiaForm');
  const container = document.getElementById('familia-container');
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
  const nomes = Array.from(checkboxes).map(cb => cb.value);

  if (nomes.length === 0) {
    alert("Selecione pelo menos um nome.");
    return;
  }

  try {
    await Promise.all(nomes.map(nome => {
      return fetch(API_POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nome=${encodeURIComponent(nome)}&status=Confirmado`
      });
    }));

    document.getElementById('familia-container').style.display = 'none';
    document.getElementById('mensagem-sucesso').style.display = 'block';
    document.getElementById('nome').value = '';
  } catch (err) {
    console.error(err);
    alert('Erro ao confirmar presença.');
  }
}

function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarImagem(tipo) {
  const container = document.getElementById('imagem-container');
  const scrollContainer = document.getElementById('scroll-imagens');
  const main = document.getElementById('main-container');

  main.style.display = 'none';
  container.style.display = 'block';
  scrollContainer.innerHTML = '';

  if (tipo === 'convite') {
    scrollContainer.innerHTML = `<img src="2.png" alt="Convite" />`;
  } else {
    scrollContainer.innerHTML = `
      <img src="3.jpg" alt="Informação 1" />
      <img src="4.jpg" alt="Informação 2" />
    `;
  }
}

function voltarTelaInicial() {
  document.getElementById('imagem-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
}
