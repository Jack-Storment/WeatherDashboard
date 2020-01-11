const apiKey = "f2740daab2546918bc8daff8d70329e0";

 let searchedCities = [];
  if( localStorage.getItem("city-search")){
    searchedCities = JSON.parse(localStorage.getItem("city-search"));
  }
  let mph = (speed) => {
    return parseFloat(speed * (3600/1609.344)).toFixed(2);
  } 
  
  
  
    let getDate = function(days){
    let aDate = new Date();
    let numberOfDaysToAdd = days ;
    aDate.setDate(aDate.getDate() + numberOfDaysToAdd); 
  
    let dd = aDate.getDate();
    let mm = aDate.getMonth() + 1;
    let y = aDate.getFullYear();
  
    return mm + " / "+ dd + " / "+ y;
  }
  

$(document).ready(function() {

    var currentConditions = function(cityName, searched){      
      $.ajax({url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`, success: function(result){

      if(searched === true){
        if(searchedCities.includes($("#search input").val()) !== true){
          searchedCities.push($("#search input").val());
          localStorage.setItem("city-search", JSON.stringify(searchedCities));
        }
        localStorage.setItem("lastCitySearch", $("#search input").val());
       }

    cityId = result.id;
        $.ajax({url: `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&APPID=${apiKey}&units=metric`, 
        success: function(result){
          $("#today").html("");
          $("#today").append(`<div class="blockHeading"><h2>${result.city.name} ( ${getDate(0)} )</h2><img src="https://openweathermap.org/img/w/${result.list[0].weather[0].icon}.png" alt="${result.list[0].weather[0].description}" width='50' height='50'>`);
          $("#today").append(`<p class="temperature">Temperature: ${result.list[0].main.temp} °C</p>`);
          $("#today").append(`<p class="humidity"> Humidity: ${result.list[0].main.humidity} %</p>`);
          $("#today").append(`<p class="wind_speed">Wind Speed:  ${mph(result.list[0].wind.speed)} MPH</p>`);
          

        $.ajax({url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=` + result.city.coord.lat + "&lon=" + result.city.coord.lon, 
        success: function(result){
            $("#today").append(`<p class="uv">UV Index: <span>${result.value}</span></p>` );
          }});

          
        $("#forecast .five-day").html("");
            for(let i=1; i <= 5; i++){
            let forecast5 = function(i){
                return('<div>' +
                '<p class="date">' + getDate(i) + '</p>' +  
                `<img src="https://openweathermap.org/img/w/${result.list[i].weather[0].icon}.png" alt="${result.list[i].weather[0].description}" "width='50' height='50'>` +
                `<p class="temperature">Temp: ${result.list[i].main.temp}&nbsp;°C</p>` +
                `<p class="humidity">Humidity: ${result.list[i].main.humidity}&nbsp;%"</p>` +
                '</div>');
                }
            
            $("#forecast .five-day").append(forecast5(i));
          }
        }});

      },error: function () {
        if ($("#search input").val() === ""){
          $("#search-error").html("Pick a city"); 
        }else{
          $("#search-error").html("Data on that city is not available");
        }
      }
    });
}
      
      if( localStorage.getItem("lastCitySearch")){
        currentConditions( localStorage.getItem("lastCitySearch"), false);
      }else{
        currentConditions("Cary", false);
      }
    
      $("#search button").on( "click", function() {
        currentConditions($("#search input").val(), true);     
      });
    
      
    
      });
  //Google Seearch Suggestions
