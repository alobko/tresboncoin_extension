
window.onload = function() {

  // run predictions for all of the ads
  console.log("👉 👉 👉 make predictions")
  make_prediction();
  console.log("👍 👍 👍 done")
}

function inject_content(e, jsonResponse) {

  // retrieve response price
  price = jsonResponse.price

  // inject content
  e.querySelector(".item_price").insertAdjacentHTML("beforeend", `<li>🔥 ${jsonResponse.price} 🙏</li>`);
}

function make_prediction() {

  // select all of the ads
  document.querySelectorAll(".announces_list_item").forEach(e => {

    // retrieve the elements of the ad
    mileage = e.getElementsByClassName("item_desc_km")[0].innerText.replace(' Km', '').replace(' ', '');
    cylinders = e.getElementsByClassName("item_desc_cylindre")[0].innerText.replace(' cm3', '');
    bike_year = e.getElementsByClassName("item_desc_millesime")[0].innerText.replace('Année ', '');
    brand = e.querySelector('span[itemprop="brand"]').innerText.toLowerCase();
    model = e.querySelector('span[itemprop="name"]').innerText.toLowerCase();
    price = e.querySelector('span[itemprop="price"]').innerText.replace(' ', '');
    id = e.querySelector('a.title_link.item_link').href.replace('.html', '').split('/').pop();

    // print ad content
    console.log(mileage, cylinders, bike_year, brand, model, price, id);

    // build api request
    url = `http://localhost:8000/predict?mileage=${mileage}&cylinders=${cylinders}&bike_year=${bike_year}&brand=${brand}&model=${model}&price=${price}&id=${id}`;
    console.log(url);

    // retrieve prediction from api
    fetch(url).then(response => {

      // check whether request is ok
      if (response.ok === true) {
        return response.json();
      }

      // log request error
      console.log(response);
      throw new Error('Request failed!');
    }, networkError => {

      // log network error
      console.log(response);
      console.log(networkError.message);
    }).then(jsonResponse => {

      // inject content
      inject_content(e, jsonResponse);
    });
  });
}
