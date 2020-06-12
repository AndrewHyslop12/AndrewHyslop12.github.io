const button = document.getElementById('button');
const api_url = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=";
const api_key = '&appid=66b260c24439a050e5c9a2d2815fcb93';

function get_api_data(){
    
    let user_input = document.getElementById('ui').value;

    if(user_input == "" || user_input == 'null'){
        alert('Search field cannot be blank');
    }else{
        let http = new XMLHttpRequest();

        let final_url = api_url + user_input + api_key;
    
        http.open("GET", final_url);
        http.send();
    
        http.onload = () => {
            if(http.status == 200){
                extract_weather_data(http);
            }else{
                console.log("Error...");
            }
        }
    }
}

function get_api_time_data(lat, lon){
    let api_key = 'R0TBZFUS2W5O&format=json&by=position&'
    let url = 'https://cors-anywhere.herokuapp.com/http://api.timezonedb.com/v2.1/get-time-zone?key='
    let http = new XMLHttpRequest();

    let last = 'lat=' + lat + '&lng=' + lon;
    
    let final_url = url + api_key + last

    http.open("GET", final_url);
    http.send();

    http.onload = () => {
        if(http.status == 200){
            extract_time_data(http);
        }else{
            console.log("Error...");
        }
    }
}

function extract_weather_data(http){
    let weather_data = JSON.parse(http.response);
    update_UI_weather(weather_data);
}

function extract_time_data(http){
    let time_data = JSON.parse(http.response);
    update_UI_time(time_data)
}

function update_UI_weather(weather_data, time_data){
    document.getElementById('intro_message').style.visibility = 'hidden';

    let weather_temperature_details = weather_data.main;
    let weather_description_all = weather_data.weather[0];

    let weather_temperate = Math.round(weather_temperature_details.temp - 273.15);
    let weather_temperate_feels_like = Math.round(weather_temperature_details.feels_like - 273.15);
    let humidity = weather_temperature_details.humidity;

    let weather_description = weather_description_all.description;

    let city_name = weather_data.name;

    let coords = weather_data.coord;
    let lat = coords.lat;
    let lon = coords.lon;

    get_api_time_data(lat, lon);

    document.getElementById('city_name').innerHTML = city_name;

    document.getElementById('temp').innerHTML = weather_temperate + '°C';
    document.getElementById('feels_like').innerHTML = 'Feels like: '+ weather_temperate_feels_like + '°C';
    document.getElementById('humidity').innerHTML = 'Humidity: ' + humidity;
    
    document.getElementById('description').innerHTML = 'Current Weather: ' + weather_description;

    if (weather_description == 'light rain'){
        document.body.style.backgroundImage = "url('backgrounds/light-rain.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = 'cover';
        document.getElementById('emoji').innerHTML = "🌧️";
        document.getElementById('emoji').style.visibility = 'visible';
    }

    if(weather_description == 'haze'){
        document.body.style.backgroundImage = "url('backgrounds/haze.jpeg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = 'cover';
        document.getElementById('emoji').innerHTML = "🌫️";
        document.getElementById('emoji').style.visibility = 'visible';
    }

    if(weather_description == 'overcast clouds' || weather_description == 'broken clouds' || weather_description == 'scattered clouds' || weather_description == 'few clouds'){
        document.body.style.backgroundImage = "url('backgrounds/clouds.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = 'cover';
        document.getElementById('emoji').innerHTML = "☁️";
        document.getElementById('emoji').style.visibility = 'visible';
    }

    if(weather_description == 'thunderstorm'){
        document.body.style.backgroundImage = "url('backgrounds/thunder.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = 'cover';
        document.getElementById('emoji').innerHTML = "⛈️";
        document.getElementById('emoji').style.visibility = 'visible';
    }
    if(weather_description == 'clear sky'){
        document.body.style.backgroundImage = "url('backgrounds/sunny.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = 'cover';
        document.getElementById('emoji').innerHTML = "☀️";
        document.getElementById('emoji').style.visibility = 'visible'
    }
}

function update_UI_time(data){
    let time = data.formatted;

    document.getElementById('time').innerHTML = 'Current time: ' + time.slice(11, 16);
}
function hide_emoji(){
    document.getElementById('emoji').style.visibility = 'hidden';
}
document.addEventListener("load", hide_emoji());

button.addEventListener("click", function(event){
    get_api_data(); 
    event.preventDefault();
})