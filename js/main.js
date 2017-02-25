
let currentLocation = []
let imageHolder = document.getElementById("imageholder")
let forecastHolder = document.getElementById("forecast")
let temperatureID = document.getElementById("temperature")
let farenButton = document.querySelector(".converter-faren")
let celButton = document.querySelector(".converter-cel")

let state = {
  currentCity:"",
  forecast:"",
  temperatureCel:"",
  temperatureFaren:"",
  giphURL:"",

}

navigator.geolocation.getCurrentPosition(function(position) {
  currentLocation.push(position.coords.latitude, position.coords.longitude)
  getWeather()
});


function resetState(){
  state.currentCity = ""
  state.forecast = ""
  state.temperature = ""
}

function convertToCelcius(faren){
  let temp = faren-32
  return temp*.556
}

function convertToFaren(celc){
  let temp = celc*1.8
  return temp+32
}

// ---- API Fetches ----- //

function giphy(){
  fetch("http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC")
  .then((response)=>{
    return response.json()
  }).then((callback)=>{
    let randomGiph = Math.floor(Math.random() *(0,callback.data.length))
    state.giphURL = callback.data[randomGiph].images.original.url
    imageView(state,imageHolder)
  })
}

function reverseGeo(lat,long){
  fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyAad-tZwV_DcZm5w32b9uYj4ccspZ_wLbw")
  .then((response)=>{
    return response.json()
  }).then((callback)=>{
    state.currentCity = callback.results[0].address_components[2].long_name
    forecast(state,forecastHolder)
  })
}

function getWeather(){
  fetch("https://api.darksky.net/forecast/9dc8b87beac106953555dabc1202ae4b/"+currentLocation[0]+","+currentLocation[1]+"?si=[temperature]")
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
       console.log(callback)
      resetState()
      reverseGeo(currentLocation[0],currentLocation[1])
      state.forecast = callback.currently.summary
      state.temperatureCel = callback.currently.temperature +"&deg;C"
      state.temperatureFaren = Math.round(convertToFaren(callback.currently.temperature)) +"&deg;F"
      giphy()
      temperature(state.temperatureCel,temperatureID)
    })
  }

// ---- end API Fetches --- //

function imageView(data,into){
  into.innerHTML = `<img class = "giphDisplay img-fluid" src="${data.giphURL}"</a>`
}

function temperature(data,into){
  into.innerHTML = `<p class="temperature-text">${data}</p>`
}

function forecast(data,into){
  into.innerHTML = `<p class="forecast-text">The forecast in ${data.currentCity} is ${data.forecast}</p>`
}

function toFaren(){
  console.log("ehh Hellooo")
  temperature(state.temperatureFaren,temperatureID)
}

function toCel(){
  console.log("ehh Hellooo")
  temperature(state.temperatureCel,temperatureID)
}
