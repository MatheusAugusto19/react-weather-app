import React, { useState } from 'react';
import WeatherIcon from './WeatherIcon'; 
import './App.css';

function App() {
  const [cidade, setCidade] = useState('');
  const [dadosClima, setDadosClima] = useState(null);

  const buscarClima = async () => {
    const apiKey = 'e7b3396f1c6609ded4f6ad12fe0d4932';
    // <-- CORRIGIDO: A URL foi limpa, usando a sintaxe correta de template string.
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (dados.cod === 200) {
        setDadosClima(dados);
      } else {
        // Agora, este alerta só aparecerá se a cidade realmente não for encontrada pela API.
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
        <button onClick={buscarClima}>Pesquisar</button>
      </div>

      {/* <-- CORRIGIDO: Este bloco foi movido para fora do "input-container". */}
      {/* Ele agora é um irmão do input-container, não um filho. */}
      {dadosClima && (
        <div className="info-clima">
          <h2>{dadosClima.name}</h2>
          <div className="temperatura-container">
            <div className="icone-clima">
              <WeatherIcon weatherId={dadosClima.weather[0].id} />
            </div>
            <p className="temperatura">{Math.round(dadosClima.main.temp)}°C</p>
          </div>
          <p className="descricao">{dadosClima.weather[0].description}</p>
          <p>Umidade: {dadosClima.main.humidity}%</p>
        </div>
      )}
      {/* <-- CORRIGIDO: A letra 's' que estava aqui foi removida. */}
    </div>
  );
}

export default App;
// <-- CORRIGIDO: A chave '}' extra que estava aqui foi removida.