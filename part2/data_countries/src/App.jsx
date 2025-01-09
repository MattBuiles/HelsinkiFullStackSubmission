import { useState, useEffect } from 'react'
import communication from './communication'

const ShowContent = ({countries, filter, setFilter}) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [lastFetchedCoords, setLastFetchedCoords] = useState(null)
  
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    let isSubscribed = true;

    if(filteredCountries.length === 1) {
      const [lat, lon] = filteredCountries[0].latlng;
      const coordsString = `${lat},${lon}`;
      
      if (lastFetchedCoords !== coordsString) {
        communication
          .getWeather(lat, lon)
          .then(weatherData => {
            if (isSubscribed) {
              setWeather(weatherData)
              setError(null)
              setLastFetchedCoords(coordsString)
            }
          })
          .catch(error => {
            if (isSubscribed) {
              setError('Failed to fetch weather data')
              console.error(error)
            }
          })
      }
    }

    return () => {
      isSubscribed = false;
    }
  }, [filteredCountries, lastFetchedCoords])

  if(filteredCountries.length === 1) {
    return (
      <div>
        <h1>{filteredCountries[0].name.common}</h1>
        <p>capital {filteredCountries[0].capital}</p>
        <p>area {filteredCountries[0].area}</p>
        <h2>languages</h2>
        <ul>
          {Object.values(filteredCountries[0].languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
        <img 
          src={filteredCountries[0].flags.png} 
          alt={`flag of ${filteredCountries[0].name.common}`} 
        />

        <h2>Weather in {filteredCountries[0].capital}</h2>
        {error && <p>{error}</p>}
        {weather && (
          <>
            <p>temperature: {weather.main.temp} celcius</p>
            <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather.description}
              />
            <p>wind: {weather.wind.speed} m/s</p>
          </>
        )}
      </div>
    )
  }
  else if (filteredCountries.length === 0) {
    return <p>No matches found</p>
  }
  else if(filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  else if (filter !== '') {
    return (
      <div>
        {countries.filter(country => filteredCountries.includes(country)).map(country => <p key={country.cca3}>{country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button></p>)}
      </div>
    )
  }
}

function App() {
const [countries, setCountries] = useState([])

useEffect(() => {
  communication
    .getAll()
    .then(initialCountries => {
      setCountries(initialCountries)
    })
}, [])

const [filter, setFilter] = useState('')
const handleFilterChange = (event) => {
  setFilter(event.target.value)
}


return (
  <div>
    <h1>Countries</h1>
    <p>find countries<input value={filter} onChange={handleFilterChange}/></p>
    <ShowContent countries={countries} filter={filter} setFilter={setFilter} />
  </div>
)
}

export default App
