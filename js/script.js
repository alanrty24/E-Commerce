const listCategories = document.querySelector("#listCategories");
const containerCards = document.querySelector("#containerCards");
let products = [];
let categories = ["All"];
const urls = "https://fakestoreapi.com/products";

// * Funciones

// * Crear elemento
const crearElemento = (element) => {
  return document.createElement(element);
};

// * Busca la data en la api
async function buscaData(url) {
  const result = await fetch(url);
  const data = await result.json();
  await processData(data);
}

// * Procesa la data y busca las categorias para ordenar la información
async function processData(data) {
  products = await data.map((inf) => inf);
  let i = 1;

  categories = await products.map((product) => {
    return product.category;
  });

  categories = new Set(categories);

  insertCategories(categories);
}

// * Agg las categorias al dom
function insertCategories(categories) {
  categories.forEach((categorie) => {
    const itemCategorie = crearElemento("li");
    itemCategorie.classList.add("item");
    itemCategorie.textContent = categorie;
    listCategories.insertAdjacentElement("beforeend", itemCategorie);
    itemCategorie.addEventListener("click", (e) => {
      borrarContenido();
      buscarPorCategoria(e);
    });
  });
  //
}

// * Borramos el contenido de las cards
function borrarContenido() {
  const cards = document.querySelectorAll(".card");

  if (cards) {
    cards.forEach((card) => {
      card.remove();
    });
  }
}

// *  busca por categoria
function buscarPorCategoria(e) {
  const categoria = e.target.textContent;
  products.forEach((product) => {
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
              src="${product.image}"
              alt="${product.title}"
              class="img"
            />
          </div>
          <h3 class="title">${product.title}</h3>
          <h3 class="price">$${product.price}</h3>
        </div>
    `;
  containerCards.insertAdjacentElement("beforeend", card);
}

buscaData(urls);
