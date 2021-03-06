const button = document.getElementById('button');
const location_button = document.getElementById('location');
const api_url = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=";
const api_key = '&appid=66b260c24439a050e5c9a2d2815fcb93';

function get_api_data(){
    let user_input = document.getElementById('ui').value;

    let http = new XMLHttpRequest();

    let final_url = api_url + user_input + api_key;

    http.open("GET", final_url);
    http.send();

    http.onload = () => {
        if(http.status == 200){
            extract_weather_data(http);
        }else{
            error_message();
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
            console.log("ERROR...");
        }
    }
}

function get_location(){
    location_button.style.visibility = 'hidden';
    
    current_loc = navigator.geolocation.getCurrentPosition(get_api_data_current_location);

}
function get_api_data_current_location(position){
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    let url = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + "66b260c24439a050e5c9a2d2815fcb93";


    let http = new XMLHttpRequest();

    http.open("GET", url);

    http.send();

    http.onload = () => {
        if(http.status == 200){
            extract_weather_data(http);
        }else{
            error_message();
        }
    }
}
function extract_weather_data(http){
    let weather_data = JSON.parse(http.response);
    update_UI_weather(weather_data);
}

function extract_time_data(http){
    let time_data = JSON.parse(http.response);
    update_UI_time(time_data);
}

function update_UI_weather(weather_data){
    
    document.getElementById('ui').value = '';
    location_button.style.visibility = 'hidden';

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

    document.getElementById('city_name').style.visibility = 'visible';
    document.getElementById('city_name').innerHTML = city_name;

    document.getElementById('temp').style.visibility = 'visible';
    document.getElementById('temp').innerHTML = weather_temperate + '°C';
    
    document.getElementById('feels_like').style.visibility = 'visible';
    document.getElementById('feels_like').innerHTML = 'Feels like: '+ weather_temperate_feels_like + '°C';
    
    document.getElementById('humidity').style.visibility = 'visible';
    document.getElementById('humidity').innerHTML = 'Humidity: ' + humidity;
    
    document.getElementById('description').style.visibility = 'visible';
    document.getElementById('description').innerHTML = 'Currently: ' + weather_description;
    document.getElementById('description').style.fontWeight = '900';

    make_emoji_descision(weather_description);
}

function update_UI_time(data){
    let time = data.formatted;
    document.getElementById('time').style.visibility = 'visible';
    document.getElementById('time').innerHTML = 'Current time: ' + time.slice(11, 16);
}

function hide_emoji(){
    document.getElementById('emoji').style.visibility = 'hidden';
}

function make_emoji_descision(weather_description){
    if (weather_description.includes('rain')){
        file_name = 'backgrounds/light-rain.jpg';
        get_file(file_name);
        document.getElementById('emoji').innerHTML = "☔";
        document.getElementById('emoji').style.visibility = 'visible';
    }else if(weather_description == 'haze'){
        file_name = 'backgrounds/haze.jpeg';
        get_file(file_name);
        document.getElementById('emoji').innerHTML = "🌫️";
        document.getElementById('emoji').style.visibility = 'visible';
    }else if(weather_description.includes('clouds')){
        file_name = 'backgrounds/clouds.jpg';
        get_file(file_name);
        document.getElementById('emoji').innerHTML = "☁️";
        document.getElementById('emoji').style.visibility = 'visible';
    }else if(weather_description == 'thunderstorm'){
        file_name = 'backgrounds/thunder.jpg';
        get_file(file_name);
        document.getElementById('emoji').innerHTML = "⛈️";
        document.getElementById('emoji').style.visibility = 'visible';
    }else{
        file_name = 'backgrounds/sunny.jpg';
        get_file(file_name);
        document.getElementById('emoji').innerHTML = "☀️";
        document.getElementById('emoji').style.visibility = 'visible'
    }
}

function error_message(){
    array_of_fields = [
        'city_name',
        'time',
        'temp',
        'humidity',
        'description',
        'emoji'
    ]
    document.getElementById('feels_like').innerHTML = "No data...please try again";

    array_of_fields.forEach(hide_fields);
}

function hide_fields(item){
    document.getElementById(item).style.visibility = 'hidden';
}

function get_file(file_name){
    document.body.style.backgroundImage = "url(" + file_name + ")";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = 'cover';
}

document.addEventListener("load", hide_emoji());
button.addEventListener("click", function(event){
    get_api_data();
    event.preventDefault();
})

location_button.addEventListener("click", function(event){
    get_location();
    event.preventDefault();
})