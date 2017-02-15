
let currentLocation = []
let imageHolder = document.getElementById("imageholder")
let state = {
  currentCity:"",
  forecast:"",
  temperature:0,
  giphURL:"",
  giphID:""

}

function resetState(){
  state.currentCity = ""
  state.forecast = ""
  state.temperature = 0
  state.icon = ""
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

function giphy(icon){
  fetch("http://api.giphy.com/v1/gifs/search?q="+icon+"&api_key=dc6zaTOxFJmzC")
  .then((response)=>{
    return response.json()
  }).then((callback)=>{
    console.log(callback)
    state.giphID = callback.data[0].id
    state.giphURL = callback.data[0].embed_url
  })
}

function reverseGeo(lat,long){
  fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyAad-tZwV_DcZm5w32b9uYj4ccspZ_wLbw")
  .then((response)=>{
    return response.json()
  }).then((callback)=>{
    state.currentCity = callback.results[0].address_components[2].long_name
  })
}

function getWeather(){
  fetch("https://crossorigin.me/https://api.darksky.net/forecast/c8b985a5ee98592c80d7506280148708/"+currentLocation[0]+","+currentLocation[1]+"?si=[temperature]" )
    .then((response)=>{
      return response.json()
    }).then((callback)=>{
      // console.log(callback)
      resetState()
      giphy(callback.currently.icon)
      reverseGeo(currentLocation[0],currentLocation[1])
      state.currentCity = callback.timezone
      state.forecast = callback.currently.summary
      state.temperature = Math.round(convertToCelcius(callback.currently.temperature) * 100 /100)
      imageView(state,imageHolder)
    })
  }

// ---- end API Fetches --- //

function imageView(data,into){
  into.innerHTML = `<div style="max-width: 500px;" id="_giphy_${data.giphID}"></div><script>var _giphy = _giphy || []; _giphy.push({id: "DY2Pgg6GSFypi",w: 80, h: 62, clickthrough_url: "${data.giphURL}"});var g = document.createElement("script"); g.type = "text/javascript"; g.async = true;g.src = ("https:" == document.location.protocol ? "https://" : "http://") + "giphy.com/static/js/widgets/embed.js";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(g, s);</script>`
}


navigator.geolocation.getCurrentPosition(function(position) {
  currentLocation.push(position.coords.latitude, position.coords.longitude)
  getWeather()
});
