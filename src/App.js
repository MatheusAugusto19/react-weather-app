import React, { useState } from 'react';
import WeatherIcon from './WeatherIcon'; 
import './App.css';

function App() {
  const [cidade, setCidade] = useState('');
  const [dadosClima, setDadosClima] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // NOVO estado para o erro

  const buscarClima = async () => {
    if (!cidade) return;
    
    setIsLoading(true);
    setDadosClima(null);
    setError(''); // MODIFICADO: Limpa erros antigos

    const apiKey = 'e7b3396f1c6609ded4f6ad12fe0d4932';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (dados.cod === 200) {
        setDadosClima(dados);
      } else {
        // MODIFICADO: Define o erro em vez de usar alert()
        setError(dados.message || 'Cidade não encontrada. Tente novamente.');
      }
    } catch (erro) {
      console.error("Erro ao buscar dados: ", erro);
      // MODIFICADO: Define o erro de rede
      setError('Ocorreu um erro na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
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
        <button onClick={buscarClima} disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Pesquisar'}
        </button>
      </div>


      {error && <div className="error-message">{error}</div>}

      {isLoading && <div className="loader"></div>}

      {!isLoading && dadosClima && (
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
    </div>
  );
}

export default App;