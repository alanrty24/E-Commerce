const listCategories = document.querySelector("#listCategories");
const containerCards = document.querySelector("#containerCards");
const btnAll = document.querySelector("#all");
let products = {};
let categories = ["All"];
const urls = "https://dummyjson.com/products";
let posicitionCat = null;
// * Funciones

// * Crear elemento
const crearElemento = (element) => {
  return document.createElement(element);
};

// * Busca la data en la api
async function buscaData(url, callback) {
  try {
    const result = await fetch(url);
    const data = await result.json();
    await callback(data);
    // console.log(typeof(data));
  } catch (error) {
    console.error(error);
    alert(error);
    return;
  }
}

// * Procesa la data y busca las categorias para ordenar la información
async function processDataCategoria(data) {
  products = Object.entries(data.products);
  let i = 1;
  console.log(products);
  categories = await products.map(([key, product]) => {
    return product.category;
  });

  // * Set -> Crea un objeto de valores unicos, es decir toma un objeto
  categories = [...new Set(categories)];

  insertCategories(categories);
}

// * Procesa la data y manda todos los productos
async function processDataAll(data) {
  products = Object.entries(data.products);
  let i = 1;

  products.forEach(([key, product]) => {
    crearCard(product);
  });
}

// * Agg las categorias al dom
function insertCategories(categories) {
  console.log(categories);

  categories.forEach((categorie, index) => {
    const itemCategorie = crearElemento("li");
    itemCategorie.classList.add("item");
    itemCategorie.textContent = categorie;
    listCategories.insertAdjacentElement("beforeend", itemCategorie);
    itemCategorie.addEventListener("click", (e) => {
      borrarContenido(posicitionCat);
      posicitionCat = itemCategorie;
      itemCategorie.classList.add("select");
      buscarPorCategoria(e, index);
    });
  });
  //
}

// * Borramos el contenido de las cards
function borrarContenido(c) {
  const cards = document.querySelectorAll(".card");

  if (cards.length > 0) {
    c.classList.remove("select");
    cards.forEach((card) => {
      card.remove();
    });
  }
}

// *  busca por categoria
function buscarPorCategoria(e) {
  const categoria = e.target.textContent;
  products.forEach(([key, product]) => {
    if (product.category === categoria) {
      crearCard(product);
    } else if (categoria === "All") {
      crearCard(product);
    }
  });
}

// * Crear Card
function crearCard(product) {
  const card = crearElemento("div");
  card.classList.add("card");
  card.innerHTML = `
       <div class="contImg">
            <img
              src="${product.images[0]}"
              alt="${product.brand}"
              class="img"
            />
          </div>
          <h3 class="title">${product.brand}</h3>
          <h3 class="price">$${product.price}</h3>
        </div>
    `;
  containerCards.insertAdjacentElement("beforeend", card);
}

// * Seleccionar todos los elementos
btnAll.addEventListener("click", (e) => {
  borrarContenido(posicitionCat);
  posicitionCat = e.target;
  e.target.classList.add("select");
  buscaData(urls, processDataAll);
});

function iniciarComercio() {
  posicitionCat = btnAll; 
  btnAll.classList.add("select");
  buscaData(urls, processDataAll);
}

iniciarComercio(); 
buscaData(urls, processDataCategoria);
