if (document.getElementById("hotels") == null) {
    hotelListing()
}

var hotelList = []
async function create() {

    const heading = document.createElement("h1")
    heading.setAttribute("id", "heading")
    document.body.appendChild(heading)

    const ul2 = document.createElement("ul")
    ul2.setAttribute("id", "hotels")
    document.body.appendChild(ul2)

    const newDest_id = localStorage.getItem("dest_id")
    const url2 = "https://booking-com.p.rapidapi.com/v1/hotels/search?checkout_date=2024-09-15&order_by=popularity&filter_by_currency=AED&room_number=1&dest_id=" + newDest_id + "&dest_type=city&adults_number=2&checkin_date=2024-09-14&locale=en-gb&units=metric&include_adjacency=true&children_number=2&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1&page_number=0&children_ages=5%2C0";
    const options2 = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9f1ba8075cmsh22dffebf0d2fdb3p11dc0ejsn29c70f3053e0',
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url2, options2);
        const result = await response.json()
        loading.remove()
        hotelList = result.result
        heading.innerHTML = `The Top ${hotelList.length} Hotels In ${localStorage.getItem('City')}`
        console.log(hotelList.length)
        for (let i = 0; i <= 19; i++) {
            hotelCardTemplate(result.result[i], ul2)
        }
    } catch (error) {
        console.error(error);
    }
}


function hotelCardTemplate(result, ul) {

    const countryCode = `${result.countrycode}`
    const upperCase = countryCode.toUpperCase()
    const formatting = Intl.NumberFormat(`en-${upperCase}`, {
        style: "currency",
        currency: `${result.currency_code}`
    });
    const listing = `<img src="${result.max_photo_url}" alt="Image of ${result.hotel_name}">
        <h3 class="card__brand">${result.hotel_name}</h3>
        <a href="${result.url}">Book Now</a>
        <p class="product-card__price">${formatting.format(result.min_total_price)}</p>`;
    const li = document.createElement("li")
    li.innerHTML = listing
    ul.appendChild(li)
}

function hotelListing() {
    if (document.getElementById("hotels") != null) {
        document.getElementById("hotels").remove()
        document.getElementById("heading").remove()
    }
    const loading = document.createElement("h2")
    loading.setAttribute("id", "loading")
    loading.innerHTML = "Loading..."
    document.body.appendChild(loading)

    setTimeout(create, 3000)
}

const button = document.getElementById("search")
button.addEventListener("click", hotelListing)