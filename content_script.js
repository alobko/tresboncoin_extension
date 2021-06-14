
window.onload = function() {

  // inject css for the page
  inject_css_content();

  // run predictions for all of the ads
  console.log("👉 👉 👉 make predictions")
  make_prediction();
  console.log("👍 👍 👍 done")
}

function inject_css_content() {

  // create content
  css = `
    <style>
        .ltbc_price {
            color: #333;
        }
    </style>
  `;

  // inject content
  document.body.insertAdjacentHTML("afterbegin", css);
}

function inject_html_content(e, jsonResponse) {

  // retrieve response price
  price = jsonResponse.price

  // building grade
  if (price < 25) {
    grade = "🥶 🥶 🥶";
  } else if (price < 50) {
    grade = "🥶";
  } else if (price < 75) {
    grade = "🔥";
  } else {
    grade = "🔥 🔥 🔥";
  }

  // create content
  html = `
    <div class="ltbc_pred">
        <span class="ltbc_grade">${grade}</span>
        <span class="ltbc_price">${jsonResponse.price}</span>
    </div>
  `;

  // inject content
  e.querySelector(".item_price").insertAdjacentHTML("beforeend", html);
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
      inject_html_content(e, jsonResponse);
    });
  });
}
