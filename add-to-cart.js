const cartContainer = document.querySelectorAll("#desserts-cards");
const addedProductsDiv = document.querySelector("#selected-products");
const images = document.getElementById("img");
const finalTotal = document.querySelector("#total-sub");
const total = document.querySelector("#total");
const cTotal = document.querySelector("#c-total");
const cartTotalNumber = document.querySelector("#cart-number");
const addedConfirmation = document.querySelector("#confirm-order");
const confirm = document.querySelector("#confirm");
const popupBox = document.querySelector("#pop-up");
const overlay = document.querySelector("#overlay");
const resetBtn = document.querySelector("#reset");

const products = [
  {
    id: 1,
    src: "image-waffle-thumbnail.jpg",
    name: "waffle",
    category: "waffle with berries",
    price: 6.5,
  },
  {
    id: 2,
    src: "image-creme-brulee-thumbnail.jpg",
    name: "creme bruille",
    category: "vanilla bean creme brulee",
    price: 7.0,
  },
  {
    id: 3,
    src: "image-macaron-thumbnail.jpg",
    name: "macron",
    category: "macron mix of five",
    price: 8.0,
  },
  {
    id: 4,
    src: "image-tiramisu-thumbnail.jpg",
    name: "tiramisu",
    category: "classic tiramisu",
    price: 5.5,
  },
  {
    id: 5,
    src: "image-baklava-thumbnail.jpg",
    name: "baklava",
    category: "pistachio baklava",
    price: 4.0,
  },
  {
    id: 6,
    src: "image-meringue-thumbnail.jpg",
    name: "pie",
    category: "lemon meringue pie",
    price: 5.0,
  },
  {
    id: 7,
    src: "image-cake-thumbnail.jpg",
    name: "cake",
    category: "red velvet cake",
    price: 4.5,
  },
  {
    id: 8,
    src: "image-brownie-thumbnail.jpg",
    name: "brownie",
    category: "salted caremel brownie",
    price: 5.5,
  },
  {
    id: 9,
    src: "image-panna-cotta-thumbnail.jpg",
    name: "panna cotta",
    category: "vanilla panna cotta",
    price: 6.5,
  },
];

function displayCartBtns() {
  products.forEach((product, index) => {
    const { id, name, image, price, category } = product;
    const container = cartContainer[index];
    container.innerHTML += `
  <div class=" relative -mt-3 md:-ml-16">
            <img
              src="images/icon-add-to-cart.svg"
              alt=""
              class="absolute left-14 top-1 px-2  md:left-20 lg:left-28 lg:px-2"
            />
            <button
              class="btn ml-14 -mt-[5px] bg-white text-black rounded-full w-[64%] p-2 shadow-md border border-gray-400 sm:w-[10%] sm:ml-[0%]  md:ml-20 md:w-[60%] md:p-1 md:text-center lg:w-[48%] lg:ml-28"
              id="${id}"
            >
              add to cart
            </button>
          </div>
          <p class="text-gray-400 font-light text-lg capitalize">${name}</p>
          <span class="font-semibold capitalize text-lg"
            >${category}</span
          >
          <p class="text-orange-700 font-bold">$${price.toFixed(2)}</p>
        </div>`;

    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn")) {
        container.innerHTML = "";
        container.innerHTML = `
         <div class="bg-orange-900 text-white max-w-32 p-1 rounded-full flex gap-7 justify-center relative -top-3  mx-auto md:-my-1 md:gap-6  lg:mx-auto" id="quantitty-manipulator">
          <button class="quantity" id="increment">&plus;</button>
          <label for="" id='q-number'></label>
           <button class="quantity" id="decrement">&minus;</button>
        </div>
        <p class="text-gray-400 font-light text-lg capitalize">${name}</p>
          <span class="font-semibold capitalize text-lg"
            >${category}</span
          >
          <p class="text-orange-700 font-bold">$${price}</p>
      `;
      }
    });
  });
}
displayCartBtns();
class ShopingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.quantity = 0;
  }
  addItems(id, products) {
    // Find the product object from the products list
    const product = products.find((pro) => pro.id === id);
    this.items.push({ ...product, quantity: 1 });

    this.total = this.items.reduce((acc, item) => {
      acc + item.price * item.quantity, 0;
    });

    // Update total price
    this.total = this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    // displayed images and clearing out existing contents
    images.classList.add("hidden");
    this.update();
  }

  globalEvnts(type, selector, callback, parent) {
    parent.addEventListener(type, (e) => {
      if (e.target.classList.contains(selector)) {
        callback(e);
      }
    });
  }

  update() {
    addedProductsDiv.innerHTML = "";
    this.items.forEach((item) => {
      const cartsContainer = document.createElement("div");
      cartsContainer.innerHTML += `
      <h2 class="font-semibold capitalize text-sm">${item.name}</h2>
       <div class="flex gap-2">
          <p class="text-orange-600 font-bold">${item.quantity}x</p>
          <p class="text-gray-400">$${item.price.toFixed(2)}</p>
          <p class="text-orange-800">$${(item.price * item.quantity).toFixed(
            2
          )}</p>
        </div>
     <img src="images/icon-remove-item.svg" alt="" class="remove border-2
        text-gray-400 font-bold text-center border-gray-500 size-5 p-px
        rounded-full cursor-pointer text-sm relative left-44 -top-6 md:left-32 lg:left-40"
        data-id='${item.id}'" />`;
      this.globalEvnts(
        "click",
        "remove",
        (e) => {
          if (e.target.classList.contains("remove")) {
            this.removeItem(e.target.dataset.id);
          }
        },
        cartsContainer
      );
      addedProductsDiv.appendChild(cartsContainer);
    });
  }
  removeItem(dataset) {
    const dataId = parseInt(dataset);
    const productIndex = this.items.findIndex((item) => item.id === dataId);
    const removedProductId = this.items.find((item) => item.id === dataId);
    this.total -= removedProductId.price * removedProductId.quantity;
    if (productIndex !== -1) {
      this.items.splice(productIndex, 1);
      this.addExtra();
      this.update();
    }
    if (this.items.length === 0 || this.total === 0) {
      this.reset();
    }
  }
  addExtra() {
    total.textContent = `$${this.total.toFixed(2)}`;
    finalTotal.classList.remove("hidden");
    cartTotalNumber.textContent = `Your cart(${this.items.length})`;
  }

  orderConfirmation() {
    cTotal.textContent = `$${this.total.toFixed(2)}`;
    addedConfirmation.innerHTML = "";
    this.items.map((item) => {
      const imagesIcon = document.createElement("img");
      imagesIcon.src = `images/${item.src}`;
      imagesIcon.alt = `nothing here`;
      imagesIcon.style.width = "3.5rem";
      imagesIcon.style.height = "3.5rem";
      imagesIcon.style.marginBottom = "1rem";
      addedConfirmation.appendChild(imagesIcon);
      addedConfirmation.innerHTML += `
        <div class="leading-8 -mt-16 ml-16">
          <h2 class="font-semibold capitalize text-lg text-black">${
            item.name
          }</h2>
          <p class="flex flex-row gap-3 text-orange-500">${
            item.quantity
          }&times;<span class="text-gray-400">$${item.price}</span></p>
          <p class="float-right -mt-8 font-light text-black">$${(
            item.price * item.quantity
          ).toFixed(2)}</p>
        </div>
      `;
    });
  }
  reset() {
    this.items = [];
    this.total = 0;
    cartTotalNumber.textContent = `Your cart(${this.items.length})`;
    addedProductsDiv.innerHTML = "";
    finalTotal.classList.toggle("hidden");
    images.classList.toggle("hidden");
    addedConfirmation.innerHTML = ``;
  }
}

const cart = new ShopingCart();
const btns = document.getElementsByTagName("button");
[...btns].forEach((btn) => {
  btn.addEventListener("click", (event) => {
    cart.addItems(Number(event.target.id), products);
    cart.addExtra();
  });
});

confirm.addEventListener("click", () => {
  popUp();
  cart.orderConfirmation();
});

overlay.addEventListener("click", () => {
  removePopUp();
  overlay.style.pointerEvents = "auto";
});
function popUp() {
  popupBox.classList.toggle("scale-0");
  overlay.classList.toggle("hidden");
}

function removePopUp() {
  popupBox.classList.toggle("scale-0");
  overlay.classList.add("hidden");
}
resetBtn.addEventListener("click", () => {
  cart.reset();
  removePopUp();
});
