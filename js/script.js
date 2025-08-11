const listCategories = document.querySelector("#listCategories");
const containerCards = document.querySelector("#containerCards");
let products = {};
let categories = ["All"];
const urls = 'https://dummyjson.com/products';

// * Funciones

// * Crear elemento
const crearElemento = (element) => {
  return document.createElement(element);
};

// * Busca la data en la api
async function buscaData(url) {
  try {
    const result = await fetch(url);
    const data = await result.json();
    await processData(data);
    // console.log(typeof(data));
    
  } catch (error) {
    console.error(error);
    alert(error);
    return
  }
}

// * Procesa la data y busca las categorias para ordenar la información
async function processData(data) {
  products = Object.entries(data.products);
  let i = 1;
  console.log(products);
  categories = await products.map(([key, product]) => {
    return product.category;
  });
  
  categories = new Set(categories);
  
  console.log(typeof(categories));
  
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
  products.forEach(([key,product]) => {
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

buscaData(urls);
