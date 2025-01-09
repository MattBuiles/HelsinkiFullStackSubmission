import axios from 'axios'
const api_key = import.meta.env.VITE_WEATHER_API_KEY

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getWeather = async (lat, long) => {
  if (!api_key) {
    console.error('API key not found')
    throw new Error('Weather API key is missing')
  }

  try {
    const response = await axios.get(`${weatherUrl}lat=${lat}&lon=${long}&appid=${api_key}&units=metric`)
    return response.data
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message)
    throw error
  }
}

export default { getAll, getWeather }