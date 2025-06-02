import React from 'react';
// Importando os ícones específicos que vamos usar do conjunto 'Weather Icons'
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

const WeatherIcon = ({ weatherId }) => {
  // O 'switch' verifica o ID do tempo e retorna o ícone correspondente
  switch (true) {
    // Tempestade (IDs 2xx)
    case weatherId >= 200 && weatherId < 300:
      return <WiThunderstorm />;

    // Chuvisco e Chuva (IDs 3xx e 5xx)
    case weatherId >= 300 && weatherId < 600:
      return <WiRain />;

    // Neve (IDs 6xx)
    case weatherId >= 600 && weatherId < 700:
      return <WiSnow />;

    // Névoa, Fumaça, etc. (IDs 7xx)
    case weatherId >= 700 && weatherId < 800:
      return <WiFog />;

    // Céu Limpo (ID 800)
    case weatherId === 800:
      return <WiDaySunny />;

    // Nublado (IDs 801-804)
    case weatherId > 800 && weatherId < 805:
      return <WiCloudy />;

    // Caso padrão, se nenhum ID corresponder
    default:
      return <WiDaySunny />;
  }
};

export default WeatherIcon;