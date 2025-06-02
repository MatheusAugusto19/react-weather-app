import React, { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import ForecastCard from './ForecastCard';
import './App.css';


const getBackgroundImage = (weatherId) => {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return `${process.env.PUBLIC_URL}/img/tempestade.jpg`;
    case weatherId >= 300 && weatherId < 600:
      return `${process.env.PUBLIC_URL}/img/chuva.jpg`;
    case weatherId >= 600 && weatherId < 700:
      return `${process.env.PUBLIC_URL}/img/neve.jpg`;
    case weatherId >= 700 && weatherId < 800:
      return `${process.env.PUBLIC_URL}/img/nevoa.jpg`; 
    case weatherId === 800:
      return `${process.env.PUBLIC_URL}/img/ensolarado.jpg`;
    case weatherId > 800 && weatherId < 805:
      return `${process.env.PUBLIC_URL}/img/nublado.jpg`;
    default:
      return `${process.env.PUBLIC_URL}/img/default.jpg`;
  }
};

function App() {
  const [dadosClima, setDadosClima] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  
  // NOVO ESTADO: Para a probabilidade de chuva do tempo atual
  const [probChuva, setProbChuva] = useState(null);

  useEffect(() => {
    if (dadosClima) {
      const weatherId = dadosClima.weather[0].id;
      document.body.style.backgroundImage = `url(${getBackgroundImage(weatherId)})`;
    } else {
      document.body.style.backgroundImage = `url('/img/default.jpg')`;
    }
  }, [dadosClima]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => setError('Falha ao buscar estados.'));
  }, []);

  useEffect(() => {
    if (!estadoSelecionado) {
      setCidades([]);
      return;
    }
    setIsLoading(true); 
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
      .then(res => res.json())
      .then(data => setCidades(data))
      .catch(err => setError('Falha ao buscar cidades.'))
      .finally(() => setIsLoading(false));
  }, [estadoSelecionado]);
  
  const fetchWeather = async (params) => {
    setIsLoading(true);
    setDadosClima(null);
    setError('');
    setForecastData([]);
    setProbChuva(null); // Limpa a probabilidade de chuva antiga

    const apiKey = 'e7b3396f1c6609ded4f6ad12fe0d4932'; // Mova para .env no futuro
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?${params}&appid=${apiKey}&units=metric&lang=pt_br`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}&appid=${apiKey}&units=metric&lang=pt_br`;
    
    try {
      const [currentWeatherRes, forecastRes] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);
      if (!currentWeatherRes.ok || !forecastRes.ok) throw new Error('Não foi possível obter os dados do tempo.');

      const currentWeatherData = await currentWeatherRes.json();
      const forecastApiData = await forecastRes.json();

      setDadosClima(currentWeatherData);
      localStorage.setItem('lastSearchedCity', currentWeatherData.name);

      // CORRIGIDO: Define a probabilidade de chuva a partir da previsão
      if (forecastApiData.list && forecastApiData.list.length > 0) {
        setProbChuva(forecastApiData.list[0].pop);
      }

      const dailyForecasts = forecastApiData.list.filter(reading =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecastData(dailyForecasts);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
      fetchWeather(`q=${lastCity}`);
    }
  }, []);

  return (
    <div className="container">
      <h1 className="titulo">Previsão do Tempo</h1>
      
      <div className="select-container">
        <select value={estadoSelecionado} onChange={(e) => setEstadoSelecionado(e.target.value)}>
          <option value="">Selecione um Estado</option>
          {estados.map(estado => (
            <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
          ))}
        </select>

        <select 
          disabled={cidades.length === 0} 
          onChange={(e) => { if(e.target.value) fetchWeather(`q=${e.target.value}`) }}
        >
          <option value="">Selecione a Cidade</option>
          {cidades.map(cidade => (
            <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
          ))}
        </select>
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
          
          {/* CORRIGIDO: Estrutura para agrupar os detalhes */}
          <div className="detalhes-adicionais">
            <p>Umidade: {dadosClima.main.humidity}%</p>
            {probChuva !== null && (
              <p>Chuva: {Math.round(probChuva * 100)}%</p>
            )}
          </div>
        </div>
      )}

      {!isLoading && forecastData.length > 0 && (
        <div className="forecast-container">
          {forecastData.map(day => (
            <ForecastCard key={day.dt} data={day} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;