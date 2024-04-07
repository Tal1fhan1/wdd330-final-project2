
const timezoneURL = "https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json"

var list = []
const difference = []
async function getTimezones(timezoneURL, timezone) {
    const response = await fetch(timezoneURL);
    const data = await response.json();

    for (let i = 0; i <= 106; i++) {
        const info = data[i].utc
        list.push(info)
        if (list[i].includes(timezone) == true) {
            difference.push(data[i].offset)
        }

    }
}
function currentTime() {
    const today = new Date();
    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let d = today.getDate()
    let day = days[today.getDay()];
    let month = months[today.getMonth()];
    let year = today.getFullYear();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    d = checkTime(d);
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.querySelector('.current').innerHTML = "<br>Current: <br>" + day + ", " + d + "/" + month + "/" + year + " " + h + ":" + m + ":" + s;
    setTimeout(currentTime, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

currentTime();

function destinationTime() {
    if (difference.length > 1) {
        difference.reverse()
        difference.pop()
    }
    else if (difference.length < 1) {
        difference.push(2)
    }
    const offset = difference[0]
    const today = new Date();
    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let d = today.getUTCDate()
    let day = days[today.getUTCDay()];
    let month = months[today.getUTCMonth()];
    let year = today.getUTCFullYear();
    let h = today.getUTCHours() + offset;
    if (h >= 24) {
        h = h - 24
        d = d + 1
    }
    let m = today.getUTCMinutes();
    let s = today.getUTCSeconds();
    d = checkTime(d);
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    document.querySelector('.destination').innerHTML = "<br>Destination: <br>" + day + ", " + d + "/" + month + "/" + year + " " + h + ":" + m + ":" + s;
    setTimeout(destinationTime, 1000);
}

destinationTime()

function openNav() {
    document.querySelector(".sidebar").style.width = "250px";
    document.querySelector("#main").style.marginLeft = "250px";
}

function closeNav() {
    document.querySelector(".sidebar").style.width = "0";
    document.querySelector("#main").style.marginLeft = "0";
}

const menu = document.querySelector(".menu-button")
menu.addEventListener("click", openNav)

const close = document.querySelector(".closebtn")
close.addEventListener("click", closeNav)


const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&appid=6f7485277746b0ae1a06c3ffc7583e18&units=imperial'

async function currentWeather(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayCurrentWeather(data);
        }
        else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

async function destinationWeather(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayDestinationWeather(data);
        }
        else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

currentWeather(url);

function displayCurrentWeather(data) {
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');
    const captionDesc = document.querySelector('#current-cap');

    currentTemp.innerHTML = `${data.main.temp}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    weatherIcon.setAttribute('src', iconsrc);
    captionDesc.textContent = `${desc}`
}

function displayDestinationWeather(data) {
    const destinationTemp = document.querySelector('#destination-temp');
    const weatherIcon = document.querySelector('#weather-icon2');
    const captionDesc = document.querySelector('#destination-cap');

    destinationTemp.innerHTML = `${data.main.temp}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    weatherIcon.setAttribute('src', iconsrc);
    captionDesc.textContent = `${desc}`
}

function showContent() {
    document.getElementById("hide1").style.display = "contents"
    document.getElementById("hide2").style.display = "contents"
}

function getInput() {

    localStorage.removeItem("City")
    const input = document.getElementById("input");
    const value = input.value;
    localStorage.setItem("City", value.toUpperCase())
    var search = value

    const apiUrl = 'https://booking-com.p.rapidapi.com/v1/hotels/locations?name=' + search + '&locale=en-gb';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9f1ba8075cmsh22dffebf0d2fdb3p11dc0ejsn29c70f3053e0',
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    async function searchApi() {
        try {
            const response = await fetch(apiUrl, options);
            const result = await response.json();
            localStorage.setItem("dest_id", result[0].dest_id)
            const timezone1 = result[1].timezone;
            getTimezones(timezoneURL, timezone1);

        } catch (error) {
            console.error(error);
        }
    }

    searchApi(apiUrl)

    const geocoding = "http://api.openweathermap.org/geo/1.0/direct?q=" + search + "&limit=1&appid=6f7485277746b0ae1a06c3ffc7583e18&units=imperial"

    async function changeWeather() {
        try {
            const response = await fetch(geocoding);
            if (response.ok) {
                const data = await response.json();
                const latitude = `${data[0].lat}`
                const longitude = `${data[0].lon}`

                const destinationUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=6f7485277746b0ae1a06c3ffc7583e18&units=imperial"
                destinationWeather(destinationUrl)
            }
            else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.log(error);
        }

    }

    changeWeather(geocoding)
    setTimeout(showContent, 2500)
}

const button = document.getElementById("search")
button.addEventListener("click", getInput)
const booking = document.getElementById("search")
booking.addEventListener("click", destinationTime)



