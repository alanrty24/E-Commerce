const main = document.querySelector("main");
const like = document.querySelector("#like");
const inputSearch = document.querySelector("#inputSearch");
const listCategories = document.querySelector("#listCategories");
const containerCards = document.querySelector("#containerCards");
const btnAll = document.querySelector("#all");
const cart = document.querySelector("#cart");
let products = {};
let categories = [];
const urls = "https://dummyjson.com/products";
let posicitionCat = null;
let listCar = [];
let listLike = [];
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
function processDataAll(data) {
  products = Object.entries(data.products);
  let i = 1;

  products.forEach(([key, product]) => {
    crearCard(product);
  });

  verListBotonos();
  verLike();
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
      verListBotonos();
      verLike();
    });
  });
  //
}

// * Borramos el contenido de las cards
function borrarContenido(c) {
  const cards = document.querySelectorAll(".card");

  if (cards.length > 0) {
    c.classList.remove("select");
    containerCards.innerHTML = "";
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
  let classLike = "";
  card.classList.add("card");
  card.setAttribute("id", product.id);
  if (listLike.includes(product.id)) {
    classLike = "selectLike";
  }
  card.innerHTML = `
       <div class="contImg"">
            <img
              src="${product.images[0]}"
              alt="${product.brand}"
              class="img"
            />
          </div>
          <h3 class="title">${product.brand}</h3>
          <h3 class="price">$${product.price}</h3>
          <div class="infValor">
            <i class="fa-solid fa-heart icon-heart ${classLike}"></i>
            <button class="add-car">Add to Card</button>
          </div>
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

// * Ver todos los botones Add To Cart
function verListBotonos() {
  const listButtons = document.querySelectorAll(".add-car");

  listButtons.forEach((btn, i) => {
    btn.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        saveCar(e);
        updDisplayCart();
      }
    });
  });
}

// * Guarda en el carrito
function saveCar(e) {
  const idProduct = e.target.parentNode.parentNode.getAttribute("id");
  products.forEach(([key, product]) => {
    if (product.id === Number(idProduct)) {
      listCar.push(product.id);
      console.log(listCar);
    }
  });
}

// * Actualiza el display del carrito de compra
function updDisplayCart() {
  const countCart = document.querySelector("#countCart");
  if (!countCart) {
    const newCart = crearElemento("span");
    newCart.textContent = listCar.length;
    newCart.setAttribute("id", "countCart");
    cart.insertAdjacentElement("beforeend", newCart);
  } else {
    countCart.textContent = listCar.length;
  }
}

// * Ver todos los botones Like
function verLike() {
  const listBottonsLikes = document.querySelectorAll(".icon-heart");

  listBottonsLikes.forEach((hearth) => {
    hearth.addEventListener("click", (e) => {
      if (e.target.tagName === "I") {
        saveLike(e);
      }
    });
  });
}

// * Guarda todos los productos que le gusta al cliente
function saveLike(e) {
  const idProduct = e.target.parentNode.parentNode.getAttribute("id");

  products.forEach(([key, product]) => {
    if (product.id === Number(idProduct)) {
      if (!listLike.includes(product.id)) {
        listLike.push(product.id);
      } else {
        listLike = listLike.filter((like) => like !== Number(idProduct));
      }
      e.target.classList.toggle("selectLike");
    }
  });
}

// * Ver todos los productos que le dio like
like.addEventListener("click", (e) => {
  clearMain();
  products.forEach(([key, product]) => {
    if (listLike.includes(Number(product.id))) {
      crearCard(product);
    }
  });
  verListBotonos();
  verLike();
});

// * Buscar producto
inputSearch.addEventListener("keyup", (e) => {
  const string = e.target.value;
  if (/\s/.test(string) || string === "") {
    displayAllProducts();
    return;
  }

  clearMain();

  products.forEach(([key, product]) => {
    let title = product.brand;
    if (title) {
      if (title.toUpperCase().includes(string.toUpperCase())) {
        crearCard(product);
      }
    }
  });

  verListBotonos();
  verLike();
});

// * Limpiar el main
function clearMain() {
  containerCards.innerHTML = "";
}

// * Ver todos los productos procesados
function displayAllProducts() {
  clearMain();

  products.forEach(([key,product]) => {
    crearCard(product);
  })

  verListBotonos();
  verLike();
}

// * Inicializar
async function init() {
  await iniciarComercio();
  await buscaData(urls, processDataCategoria);
}

init();
