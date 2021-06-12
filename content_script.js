
// http://moto-occasion.motorevue.com/motos?particulier=0&professionnel=0&is_first_hand=0&is_guarantee=0&is_sale=0&search_ok=1

window.onload = function() {
    console.log("👉 👉 👉 👉 👉 👉 ")
    make_prediction();
}


function make_prediction() {
  document.querySelectorAll(".announces_list_item").forEach(
    e => {

      // retrieve element
      mileage = e.getElementsByClassName("item_desc_km")[0].innerText.replace(' Km', '').replace(' ', '');
      cylinders = e.getElementsByClassName("item_desc_cylindre")[0].innerText.replace(' cm3', '');
      bike_year = e.getElementsByClassName("item_desc_millesime")[0].innerText.replace('Année ', '');
      brand = e.querySelector('span[itemprop="brand"]').innerText.toLowerCase();
      model = e.querySelector('span[itemprop="name"]').innerText.toLowerCase();
      price = e.querySelector('span[itemprop="price"]').innerText.replace(' ', '');
      id = e.querySelector('a.title_link.item_link').href.replace('.html', '').split('/').pop();

      // print element content
      console.log(mileage, cylinders, bike_year, brand, model, price, id);

      // api request
      url = `http://localhost:8000/predict?mileage=${mileage}&cylinders=${cylinders}&bike_year=${bike_year}&brand=${brand}&model=${model}&price=${price}&id=${id}`
      console.log(url)
      fetch(url).then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => {
        console.log(networkError.message);
      }).then(jsonResponse => {
        console.log(jsonResponse.price);
        console.log("🧙‍♂️ 🧙‍♂️ 🧙‍♂️ 🧙‍♂️");

        e.querySelector(".item_price").insertAdjacentHTML("beforeend", `<li>🔥 ${jsonResponse.price} 🔥</li>`);

      });
    }
  );
}
