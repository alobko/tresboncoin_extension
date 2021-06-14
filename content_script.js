
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
  const css = `
    <style>

        /* le très bon coin hover */

        .ltbc_pred_hidden {
          display: none;
        }

        .ltbc_pred:hover .ltbc_pred_hidden {
          display: block;
          position: absolute;
        }

        /* le wagon card */

        .card-product {
          overflow: hidden;
          height: 120px;
          background: white;
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
        }

        .card-product img {
          height: 100%;
          width: 120px;
          object-fit: cover;
        }

        .card-product h2 {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }

        .card-product p {
          font-size: 12px;
          line-height: 1.4;
          opacity: .7;
          margin-bottom: 0;
          margin-top: 8px;
        }

        .card-product .card-product-infos {
          padding: 16px;
        }
    </style>
  `;

  // inject content
  document.body.insertAdjacentHTML("beforeend", css);
}

function inject_html_content(e, jsonResponse, ad) {

  // retrieve response price
  const price = jsonResponse.price

  // building grade
  let grade = ""
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
  const html = `
    <div class="ltbc_pred">
      <div class="ltbc_pred_hidden">
        <div class="card-product">
          <img src="https://raw.githubusercontent.com/lewagon/fullstack-images/master/uikit/skateboard.jpg" />
          <div class="card-product-infos">
            <h2>${ad.brand} ${ad.model}</h2>
            <p>Predicted value: <strong>${price}</strong>.</p>
          </div>
        </div>
      </div>
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
    const mileage = e.getElementsByClassName("item_desc_km")[0].innerText.replace(' Km', '').replace(' ', '');
    const cylinders = e.getElementsByClassName("item_desc_cylindre")[0].innerText.replace(' cm3', '');
    const bike_year = e.getElementsByClassName("item_desc_millesime")[0].innerText.replace('Année ', '');
    const brand = e.querySelector('span[itemprop="brand"]').innerText.toLowerCase();
    const model = e.querySelector('span[itemprop="name"]').innerText.toLowerCase();
    const price = e.querySelector('span[itemprop="price"]').innerText.replace(' ', '');
    const id = e.querySelector('a.title_link.item_link').href.replace('.html', '').split('/').pop();

    // build ad object
    const ad = {
      mileage: mileage,
      cylinders: cylinders,
      bike_year: bike_year,
      brand: brand,
      model: model,
      price: price,
      id: id,
    };

    // print ad content
    console.log(mileage, cylinders, bike_year, brand, model, price, id);

    // build api request
    const url = `http://localhost:8000/predict?mileage=${mileage}&cylinders=${cylinders}&bike_year=${bike_year}&brand=${brand}&model=${model}&price=${price}&id=${id}`;
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
      inject_html_content(e, jsonResponse, ad);
    });
  });
}
