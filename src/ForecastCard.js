// Em src/ForecastCard.js
import React from 'react';
import WeatherIcon from './WeatherIcon';
import { WiRaindrop } from 'react-icons/wi'; // Importa o ícone de gota
import './ForecastCard.css';

const ForecastCard = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const probChuva = Math.round(data.pop * 100); // Calcula a % de chuva

  return (
    <div className="forecast-card">
      <p className="forecast-day">{dayOfWeek}</p>
      <div className="forecast-icon">
        <WeatherIcon weatherId={data.weather[0].id} />
      </div>
      <p className="forecast-temp">{Math.round(data.main.temp)}°C</p>
      {/* NOVA LINHA PARA PROBABILIDADE DE CHUVA */}
      <div className="forecast-pop">
        <WiRaindrop />
        <span>{probChuva}%</span>
      </div>
    </div>
  );
};

export default ForecastCard;