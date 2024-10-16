import dotenv from 'dotenv';
dotenv.config();
// Define a class for the Weather object
class Weather {
    constructor(temperature, description, humidity, windSpeed) {
        this.temperature = temperature;
        this.description = description;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    // private cityName: string;
    constructor() {
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
        //    this.cityName = '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`);
        console.log(response);
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        return response.json();
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        try {
            const { lat, lon } = locationData[0];
            return { latitude: lat, longitude: lon };
        }
        catch (error) {
            console.error(error);
            return { latitude: 0, longitude: 0 };
        }
    }
    // TODO: Create buildGeocodeQuery method
    //private buildGeocodeQuery(cityName: string): string {
    //  return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
    //}
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const locationData = await this.fetchLocationData(city);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const { temp, weather, humidity, wind_speed } = response.current;
        return new Weather(temp, weather[0].description, humidity, wind_speed);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = weatherData.map((data) => {
            const { temp, weather, humidity, wind_speed } = data;
            return new Weather(temp, weather[0].description, humidity, wind_speed);
        });
        return [currentWeather, ...forecastArray];
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        //  this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
        return forecastArray;
    }
}
export default new WeatherService();
