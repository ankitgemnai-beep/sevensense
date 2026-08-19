import { Injectable } from '@nestjs/common';
import { WeatherProvider, WeatherData } from './weather.provider.interface';

@Injectable()
export class MockWeatherProvider implements WeatherProvider {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    // Deterministic mock for testing AI rules
    return {
      temperatureC: 22,
      condition: 'Overcast',
      humidity: 65,
      isRaining: false,
    };
  }

  async getForecast(lat: number, lon: number, hoursOffset: number): Promise<WeatherData> {
    // Simulates upcoming rain
    return {
      temperatureC: 18,
      condition: 'Light Rain',
      humidity: 85,
      isRaining: true,
    };
  }
}
