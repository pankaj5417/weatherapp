import axios from 'axios'
import { useEffect } from 'react'
import { debounce } from "lodash";

import { useState } from 'react'
import './weather.css'
//const city='delhi'
function Weather() {

  const [weatherData,setWeatherData]=useState(null)
  const [forcast,setForcast]=useState([])
  const [city,setCity]=useState("")

  const handleChange=(e)=>{
        const inputVal=e.target.value
       // setCity(prev=>prev=inputVal)
       // debounce(getWeather,1000)
       debounceWeather(inputVal)

      }
      async function getWeather(city){
        try{
          const res=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1fe85b3ad8fa502e23bf446831171936`)
          console.log(res.data)
          setWeatherData(res.data)
          getWeather2()
          
            
          
        }catch(err){
          console.log(err)
        }
      }
      
    //getWeather()

    
    const debounceWeather=debounce(query=> {
      
        getWeather(query)
        
      },1000)
      
      
      async function getWeather2(){
     const lat=weatherData.coord.lat
     const lon=weatherData.coord.lon
       const res=await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutelyalerts&units=metric&appid=1fe85b3ad8fa502e23bf446831171936`)
       console.log(res.data)
  }


  return (
<>
<div className='weatherContainer'>
  <div className="searchContainer">
   <input type="search" className='searchBox' placeholder='Search...' onInput={handleChange} />
  </div>
  <div className="searchOutputContainer">

  </div>
  <div className="dailyForcastContainer">
     
  </div>
</div>
<p>Weather Information</p>
<p>{weatherData?.name}</p>
<p>{weatherData?.coord.lat}</p>
<p>{weatherData?.coord.lon}</p>

</>

)
}

export default Weather


// https://api.openweathermap.org/data/2.5/onecall?lat=25.5940947&lon=85.1375645&exclude=current,minutelyalerts&units=metric&appid=e4c70ce6a6821649a416cb9521d5f4f8