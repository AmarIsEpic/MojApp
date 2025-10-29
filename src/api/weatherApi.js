const API_KEY = 'ed0604f6922da175d2395178306397bd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export async function getWeather(city, units = 'metric') {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&units=${units}&appid=${API_KEY}&lang=hr`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Greška prilikom dohvaćanja podataka:', error);
  }
}

export async function getForecast(city, units = 'metric') {
  try {
    const response = await fetch(
      `${FORECAST_URL}?q=${city}&units=${units}&appid=${API_KEY}&lang=hr`
    );
    const data = await response.json();
    return data; // has list (3-hourly)
  } catch (error) {
    console.error('Greška prilikom dohvaćanja prognoze:', error);
  }
}

export function groupDaily(list = []) {
  const byDay = {};
  list.forEach((item) => {
    const day = item.dt_txt.split(' ')[0];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(item);
  });
  return Object.keys(byDay).slice(0, 5).map((d) => {
    const items = byDay[d];
    const temps = items.map((i) => i.main.temp);
    const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
    const icon = items[0]?.weather?.[0]?.icon;
    const desc = items[0]?.weather?.[0]?.description;
    return { date: d, temp: avg, icon, desc };
  });
}