import React, { useState } from 'react';
import './App.css';

function App() {
  // O estado 'cidade' armazenará o que o usuário digitar no input.
  const [cidade, setCidade] = useState('');
  const [dadosClima, setDadosClima] = useState(null);
  const buscarClima = async () => {
  // Substitua PELA_SUA_CHAVE_API pela sua chave real!
  const apiKey = 'e7b3396f1c6609ded4f6ad12fe0d4932';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=<span class="math-inline">\{cidade\}&appid\=</span>{apiKey}&units=metric&lang=pt_br`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.cod === 200) {
      setDadosClima(dados);
    } else {
      alert('Cidade não encontrada. Tente novamente.');
    }
  } catch (erro) {
    console.error("Erro ao buscar dados: ", erro);
    alert('Ocorreu um erro. Tente novamente mais tarde.');
  }
};

  return (
    <div className="container">
      <h1 className="titulo">Previsão do Tempo</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Digite o nome da cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        {dadosClima && (
  <div className="info-clima">
    <h2>{dadosClima.name}</h2>
    <p className="temperatura">{Math.round(dadosClima.main.temp)}°C</p>
    <p>{dadosClima.weather[0].description}</p>
    <p>Umidade: {dadosClima.main.humidity}%</p>
  </div>
)}s
        
        <button onClick={buscarClima}>Pesquisar</button>
      </div>
    </div>
  );
}

export default App;