import axios from 'axios'
const city='delhi'
function Weather() {
    async function getWeather(){
        const res=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1fe85b3ad8fa502e23bf446831171936`)
        console.log(res.data)
    }
    getWeather()
  return (
<>
<p>Weather Information</p>
</>

)
}

export default Weather