document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '55eb03efb121efa810d392f4ae007d8a';

  const canvas = document.getElementById('rain-canvas');
  const ctx = canvas.getContext('2d');
  let raindrops = [];

  function createRaindrop() {
    return {
      x: Math.random() * canvas.width,
      y: 0,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 5 + 5
    };
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    raindrops.forEach((drop, index) => {
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      drop.y += drop.speed;

      if (drop.y > canvas.height) {
        raindrops[index] = createRaindrop();
      }
    });

    ctx.stroke();
    requestAnimationFrame(drawRain);
  }

  function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', updateCanvasSize);
  updateCanvasSize();

  for (let i = 0; i < 100; i++) {
    raindrops.push(createRaindrop());
  }

  drawRain();

  function getWeather() {
    const province = document.getElementById('province').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${province}&appid=${apiKey}&units=metric&lang=th`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('weather-result').innerHTML = `
          <div class="weather-icon">${getWeatherIcon(data.weather[0].main)}</div>
          <h2>พยากรณ์อากาศสำหรับ ${data.name}</h2>
          <p>สภาพอากาศ: ${data.weather[0].description}</p>
          <p>อุณหภูมิ: ${data.main.temp} °C</p>
          <p>ความชื้น: ${data.main.humidity}%</p>
        `;
        updateBackground(data.weather[0].main, data.main.humidity);
      })
      .catch(error => {
        document.getElementById('weather-result').innerHTML = `<p style="color: red;">เกิดข้อผิดพลาด: ${error.message}</p>`;
      });
  }

  function updateBackground(weatherMain, humidity) {
    let backgroundClass = '';
    if (humidity < 30) {
      backgroundClass = 'dry-background';
    } else if (humidity >= 30 && humidity <= 60) {
      switch (weatherMain.toLowerCase()) {
        case 'clear':
          backgroundClass = 'sunny-background';
          break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
          backgroundClass = 'rainy-background';
          break;
        case 'clouds':
          backgroundClass = 'cloudy-background';
          break;
        default:
          backgroundClass = '';
      }
    } else {
      backgroundClass = 'humid-background';
    }
    document.body.className = backgroundClass;
  }

  function getWeatherIcon(weatherMain) {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'rain':
      case 'drizzle':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
      case 'clouds':
        return '☁️';
      default:
        return '🌤️';
    }
  }

  document.getElementById('get-weather').addEventListener('click', getWeather);
});
