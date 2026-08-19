export interface WeatherData {
  temperatureC: number;
  condition: string;
  humidity: number;
  isRaining: boolean;
  uvIndex?: number;
}

export interface WeatherProvider {
  getCurrentWeather(lat: number, lon: number): Promise<WeatherData>;
  getForecast(lat: number, lon: number, hoursOffset: number): Promise<WeatherData>;
}
