window.onload = function() {

  // inject css for the page
  inject_css_content();

  // run predictions for all of the ads
  console.log('👉 👉 👉 make predictions')
  make_prediction();
  console.log('👍 👍 👍 done')
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

        .card-product-infos {
            width: 100%;
        }

        .card-product-infos h2 .ltbc_brand {
            font-size: 20px;
        }

        .card-product-infos h2 .ltbc_model {
            font-size: 16px;
        }

        .card-product-infos .ltbc_desc {
            color: #111;
            font-size: 16px;
            font-family: helvetica,verdana,arial,sans-serif;
            text-align: left;
        }

        .card-product-infos .ltbc_desc.ltbc_desc_right {
            display: flex;
            text-align: right !important;
            justify-content: flex-end;
            color: #ccc;
            font-size: 14px;
        }

        /* le wagon card */

        .card-product {
          overflow: hidden;
          height: 120px;
          width: 400px;
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
  document.body.insertAdjacentHTML('beforeend', css);
}

function inject_html_content(e, site_name, jsonResponse, ad) {

  // retrieve response price
  const price = jsonResponse.price

  // building grade
  let grade = ''
  if (price < 25) {
    grade = '🥶 🥶 🥶';
  } else if (price < 50) {
    grade = '🥶';
  } else if (price < 75) {
    grade = '🔥';
  } else {
    grade = '🔥 🔥 🔥';
  }

  // create content
  const html = `
    <div class="ltbc_pred">
      <div class="ltbc_pred_hidden">
        <div class="card-product">
          <img src="${ad.image}" />
          <div class="card-product-infos">
            <h2>
                <span class="ltbc_brand">${ad.brand} </span>
                <span class="ltbc_model">${ad.model}</span>
            </h2>
            <p class="ltbc_desc">Predicted value: ${price}</p>
            <p class="ltbc_desc">Grade: ${grade}</p>
            <p class="ltbc_desc ltbc_desc_right">🏍 Le Très Bon Coin</p>
          </div>
        </div>
      </div>
      <span class="ltbc_grade">${grade}</span>
      <span class="ltbc_price">${jsonResponse.price}</span>
    </div>
  `;

  // inject content
  if (site_name == "moto_selection") {

    e.querySelector('.title_link').insertAdjacentHTML('afterbegin', html);

  } else if (site_name == "lbc") {

    e.querySelector('.sc-bdVaJa').insertAdjacentHTML('beforeend', html);

  } else if (site_name == "la_centrale") {

    e.querySelector('.searchCard__makeModel').insertAdjacentHTML('beforebegin', html);
  }
}

function call_api(e,site_name, mileage, cylinders, bike_year, brand, model, price, id, image) {

  // build ad object
  const ad = {
    mileage: mileage,
    cylinders: cylinders,
    bike_year: bike_year,
    brand: brand,
    model: model,
    price: price,
    id: id,
    image: image,
  };

  // print ad content
  console.log(mileage, cylinders, bike_year, brand, model, price, id, image);

  // build api request
  const url = `http://localhost:8000/predict?mileage=${mileage}&cylinders=${cylinders}&bike_year=${bike_year}&brand=${brand}&model=${model}&price=${price}&id=${id}&image=${image}`;
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
    inject_html_content(e, site_name, jsonResponse, ad);
  });
}

function make_prediction() {

  // check website
  if (location.hostname == "www.moto-selection.com") {

    console.log("☘️ moto selection");
    site_name = "moto_selection";

    // select all of the ads
    document.querySelectorAll('.announces_list_item').forEach(e => {

      // retrieve the elements of the ad
      const mileage = e.getElementsByClassName('item_desc_km')[0].innerText.replace(' Km', '').replace(' ', '');
      const cylinders = e.getElementsByClassName('item_desc_cylindre')[0].innerText.replace(' cm3', '');
      const bike_year = e.getElementsByClassName('item_desc_millesime')[0].innerText.replace('Année ', '');
      const brand = e.querySelector('span[itemprop="brand"]').innerText.toLowerCase();
      const model = e.querySelector('span[itemprop="name"]').innerText.toLowerCase();
      const price = e.querySelector('span[itemprop="price"]').innerText.replace(' ', '');
      const id = e.querySelector('a.title_link.item_link').href.replace('.html', '').split('/').pop();
      const image_element = e.querySelector('.img_content img');
      const image = image_element ? image_element.src : '';

      // call the api then inject the card
      call_api(e, site_name, mileage, cylinders, bike_year, brand, model, price, id, image)

    });

  } else if (location.hostname == "www.lacentrale.fr") {

    console.log("☘️ la centrale");
    site_name = "la_centrale";

    // la_centrale
    document.querySelectorAll('.adLineContainer').forEach(e => {

      setTimeout(function() {

        // retrieve the elements of the ad
        const mileageElt = e.getElementsByClassName('searchCard__mileage')[0];
        const mileage = mileageElt ? mileageElt.innerText.replace('km', '').replace(' ', '') : "";
        const cylinders = "";
        const bike_yearElt = e.getElementsByClassName('searchCard__year')[0];
        const bike_year = bike_yearElt ? bike_yearElt.innerText.replace(' ', '') : "";
        const brandElt = e.querySelector('span[class="searchCard__makeModel"]');
        const brand = brandElt ? brandElt.innerText.toLowerCase() : "";
        const model = "";
        const priceElt = e.querySelector('.searchCard__fieldPrice span');
        const price = priceElt ? priceElt.innerText : '';
        const idElt = e.querySelector('a');
        const id = idElt ? idElt.id : '';
        const image_element = e.querySelector('.searchCard__leftContainer img');
        const image = image_element && image_element != "" ? image_element.src : '';

        console.log(`❤️ ❤️ ❤️ mileage ${mileage} cylinders ${cylinders} bike_year ${bike_year} brand ${brand} model ${model} price ${price} id ${id} image ${image}`)

        // call the api then inject the card
        call_api(e, site_name, mileage, cylinders, bike_year, brand, model, price, id, image)

      }, 3000);

    });

  } else if (location.hostname == "www.leboncoin.fr") {

    console.log("☘️ le bon coin");
    site_name = "lbc";

    // lbc
    document.querySelectorAll('.sc-bdVaJa').forEach(e => {

      // retrieve the elements of the ad
      const mileage = e.getElementsByClassName('AdParams__LightParams-sc-2j22za-1 fyMqhY').querySelector('span[class=Roh2X _137P- P4PEa _3j0OU]')[1].replace('km', '').replace(' ', '');
      const cylinders = "";
      const bike_year = e.getElementsByClassName('AdParams__LightParams-sc-2j22za-1 fyMqhY').querySelector('span[class=Roh2X _137P- P4PEa _3j0OU]')[0].replace(' ','');
      const brand = e.getElementsByClassName('AdCardTitle-e546g7-0 igWjvr').innerText.toLowerCase();
      const model = e.getElementsByClassName('AdCardTitle-e546g7-0 igWjvr').innerText;
      const price = e.querySelector('span[class="_1hnil _1-TTU _35DXM"]').innerText.replace(' ','').replace('€','');
      const id = e.querySelector('a.AdCard__AdCardLink-sc-1h74x40-0.XFxsO').href.replace('.htm*', '').split('/').pop();      
      const image_element = e.querySelector('.indexstyles__WithLayoutCondition-teq0ic-0.jtKicE img');
      const image = image_element ? image_element.src : '';

      console.log(`❤️ ❤️ ❤️ prix ${price}`)

      // call the api then inject the card
      call_api(e, site_name, mileage, cylinders, bike_year, brand, model, price, id, image)

    });

  } else {

    console.log("🚨 erreur de site");

    return;
  }

}