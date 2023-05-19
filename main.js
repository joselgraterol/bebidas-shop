let burger = document.querySelector("#burger");
let span = document.querySelector("#span");
let shoppingCartPopup = document.querySelector(".shopping-cart-popup")
let close = document.querySelector(".close");
let volver = document.querySelector("#volver");
let popupOpen = false;
// header
let header = document.querySelector("header");
let isScrolled = false;
// counter
const cartCounter = document.querySelector(".cart-count");
// form
let form =  document.getElementById("form");
let formContent = document.querySelector(".form-content");
let addressInputWrapper = document.getElementById("addressInputWrapper");
let pickupLocationsWrapper = document.getElementById("pickupLocationsWrapper");
let pickUpBtn = document.getElementById("pickUpBtn");
let deliveryBtn = document.getElementById("deliveryBtn");
let deliveryMethod = document.getElementById("deliveryMethod");


// header sticky

window.addEventListener("scroll", () => {
  if (!isScrolled) {
    header.classList.add("pegar", window.scrollY > 0);
    isScrolled = true;
  }
  
});

function closePopup() {
  //Add the closed class to initiate the close animation
  shoppingCartPopup.classList.add("closed");

  setTimeout(() => {
    shoppingCartPopup.style.display = "none";
    shoppingCartPopup.classList.remove("closed");
  }, 300);

  // remove stop scrolling
  document.body.classList.remove("stop-scrolling");
  popupOpen = false;
}

function closePopupOnBackButton(event) {
  if (popupOpen) {
    closePopup();
    event.preventDefault();
  } else {
    window.removeEventListener("popstate", closePopupOnBackButton);
    history.back();
  }
}

burger.addEventListener("click", function () {
  // Show the pop-up
  shoppingCartPopup.style.display = "block";
  // add stop scrolling
  document.body.classList.add("stop-scrolling");
  popupOpen = true;
  

  // Add state to the browser history
  window.history.pushState({ popupOpen: true }, "");

  window.addEventListener("popstate", closePopupOnBackButton);
});

close.addEventListener("click", closePopup);
volver.addEventListener("click", closePopup);

window.addEventListener("popstate", closePopupOnBackButton);



// shoppingCart



const products = [
    {
      name: "Lipton",
      price: 8.1,
      button: document.getElementById("product-btn-1"),
      imgSrc: "images/nestea.png",
    },

    {
      name: "Coca Cola",
      price: 12,
      button: document.getElementById("product-btn-2"),
      imgSrc: "images/cocacola.jpg",
    },

    {
      name: "Hit",
      price: 9.5,
      button: document.getElementById("product-btn-3"),
      imgSrc: "images/hit.png",
    },

    {
      name: "Frescolita",
      price: 22,
      button: document.getElementById("product-btn-4"),
      imgSrc: "images/frescolita.png",
    },

    {
      name: "Malta",
      price: 5,
      button: document.getElementById("product-btn-5"),
      imgSrc: "images/malta.png",
    },

    {
      name: "Pepsi",
      price: 1,
      button: document.getElementById("product-btn-6"),
      imgSrc: "images/pepsi.png",
    }

];



products.forEach((product) => {
    product.button.addEventListener("click", () => {
      addToCart({
        name: product.name,
        price: product.price,
        quantity: 1,
        imgSrc: product.imgSrc
      });
    });
});


let cart = {
    items: []
};


function addToCart(product) {
// check if size and color options are selected 

let itemIndex = cart.items.findIndex(item => item.name === product.name);
if (itemIndex !== -1) {
    if (cart.items[itemIndex].quantity >= 20) {
        showPopUpMessageRemove("solo puedes añadir 20 unidades")
        return;
    }
    cart.items[itemIndex].quantity += product.quantity;
    
} else {
    cart.items.push(product);
    
}

showPopUpMessageAdd("producto añadido");

//counter
updateCartCounter();

// display the cart
displayCart();
// display the total cost
updateTotalCost();
// local storage
saveCartToLocalStorage();
volverBtn();

}



// local storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}



function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCounter();
    if (cart.items.length === 0) {
        cartCounter.classList.remove('show');
    } else{
      displayCart();
      updateTotalCost();
      volverBtn();

    }
  }
}

loadCartFromLocalStorage();





// counter

function updateCartCounter() {
  cartCounter.classList.add('show');
  cartCounter.innerText = cart.items.length;

}




function removeFromCart(product) {
  let index = cart.items.indexOf(product);
  if (index !== -1) {
      cart.items.splice(index, 1);
      //message
      showPopUpMessageRemove("producto eliminado")

      //counter
      updateCartCounter();
      if (cart.items.length === 0) {
        cartCounter.classList.remove('show');
      }
      // remove from the cart list
      displayCart();
      // update the total cost
      updateTotalCost(); 

      saveCartToLocalStorage();  
      volverBtn();
   
      
  }
}


function displayCart() {
  let ul = document.getElementById("cart");
  let fragment = document.createDocumentFragment(); // create a document fragment
  for (let i = 0; i < cart.items.length; i++) {
      let item = cart.items[i];
      let li = document.createElement("li");
      let img = document.createElement('img');
      img.classList.add("imagen-card");
      img.src = item.imgSrc;
      img.alt = item.name;
      li.appendChild(img);
      let div = document.createElement("div");
      div.classList.add("product-information");
      let spanProductName = document.createElement('span');
      let spanProductPrice = document.createElement('span');
      let productName = document.createTextNode(`${item.name}`);
      let productPrice = document.createTextNode(`$ ${item.price}  x `);
      spanProductName.appendChild(productName)
      spanProductName.classList.add("product-name");
      div.appendChild(spanProductName);
      li.appendChild(div);
      spanProductPrice.appendChild(productPrice);
      spanProductPrice.classList.add("product-price");
      div.appendChild(spanProductPrice)

      let quantitySelect = document.createElement("select");
      quantitySelect.classList.add("quantity-select")
      quantitySelect.setAttribute("data-item-id", i);
      quantitySelect.setAttribute("name", "quantity-" + i);
      for (let j = 1; j <= 20; j++) {
          let option = document.createElement("option");
          option.value = j;
          option.text = j;
          quantitySelect.appendChild(option);
      }
      quantitySelect.value = item.quantity;
      quantitySelect.addEventListener("change", function(event) {
          let itemId = event.target.getAttribute("data-item-id");
          let newQuantity = parseInt(event.target.value);
          if (newQuantity > 0) {
              cart.items[itemId].quantity = newQuantity;
              updateTotalCost();
          } else {
              // remove the item from the cart if the quantity is set to 0 or less
              removeFromCart(cart.items[itemId]);
          }
      });
      div.appendChild(quantitySelect);  
	 

      let removeButton = document.createElement("button");
      removeButton.classList.add("remove-button", "fa-solid", "fa-minus")
      removeButton.setAttribute("data-item-id", i);
      removeButton.onclick = function(event) {
          let itemId = event.target.getAttribute("data-item-id");
          removeFromCart(cart.items[itemId]);
      };
      div.appendChild(removeButton);
      li.appendChild(div)
      fragment.appendChild(li); // add the li element to the fragment instead of the ul element
      saveCartToLocalStorage();
  }
  ul.innerHTML = ""; // clear the ul element before appending the fragment
  ul.appendChild(fragment); // append the entire fragment to the ul element at once
}



function updateTotalCost() {
  let totalCost = 0;
  (totalCost);
  for (let i = 0; i < cart.items.length; i++) {
      let item = cart.items[i];
      totalCost += item.price * item.quantity;
  }

  let totalCostElement = document.getElementById("totalCost");
  let noProductsMessage = document.getElementById("no-products-message");
  if (totalCost > 0) {
      totalCostElement.classList.add("show-cost");
      noProductsMessage.classList.add("hide-message");
      totalCostElement.innerHTML = "Total Cost: $" + Math.round(totalCost * 100) / 100;
      formContent.classList.add("display-form");
      
  } else {
      totalCostElement.classList.remove("show-cost");
      noProductsMessage.classList.remove("hide-message");
      formContent.classList.remove("display-form");
      totalCostElement.innerHTML = "Total Cost: $0";
  }

  saveCartToLocalStorage();
  volverBtn();


}




//pop up information

function showPopUpMessageAdd(message){
  const popUpAdd = document.createElement("div");
  popUpAdd.classList.add("pop-up-message-add");
  popUpAdd.textContent = message;
  document.body.appendChild(popUpAdd);

  setTimeout(() => {
    popUpAdd.classList.add("closed");
  }, 2000);
}

function showPopUpMessageRemove(message){
  const popUpRemove = document.createElement("div");
  popUpRemove.classList.add("pop-up-message-remove");
  popUpRemove.textContent = message;
  document.body.appendChild(popUpRemove);

  setTimeout(() => {
    popUpRemove.classList.add("closed");
  }, 2000);
}



// boton volver
function volverBtn(){
  let shoCart = document.getElementById("cart");
  if (cart.items.length <= 0) {
      volver.classList.add("acti");
      volver.classList.remove("actiPc");
      shoCart.classList.add("activarse")
      
  }
  else{
    volver.classList.remove("acti");
    volver.classList.add("actiPc");
    shoCart.classList.remove("activarse")
  }
}

volverBtn();

// ver carrito texto
let verCarrito = document.querySelector(".ver-carrito");

verCarrito.innerHTML = "ver carrito";
verCarrito.classList.add("carrito");


  





// form

deliveryMethod.value = "";

pickUpBtn.addEventListener("click", () => {
  setDeliveryMethod("pickUp");
});

deliveryBtn.addEventListener("click", () => {
  setDeliveryMethod("delivery");
});


pickUpBtn.classList.remove("active-method");
deliveryBtn.classList.remove("active-method");

function setDeliveryMethod(method) {
  deliveryMethod.value = method;

  if (method === "delivery") {
    addressInputWrapper.style.display = "block";
    pickupLocationsWrapper.style.display = "none";
    pickUpBtn.classList.remove("active-method");
    deliveryBtn.classList.add("active-method");
    address.required = true;
  } else if (method === "pickUp") {
    addressInputWrapper.style.display = "none";
    pickupLocationsWrapper.style.display = "block";
    pickUpBtn.classList.add("active-method");
    deliveryBtn.classList.remove("active-method");
    address.required = false;
  }
  else{
    addressInputWrapper.style.display = "none";
    pickupLocationsWrapper.style.display = "none";
    pickUpBtn.classList.remove("active-method");
    deliveryBtn.classList.remove("active-method");
    address.required = false;

  }
}






function generateCartMessage(cart) {
    let message = "Shopping Cart:\n";
    let totalCost = 0;
    for (let i = 0; i < cart.items.length; i++) {
        let item = cart.items[i];
        message += item.name + " - $" + item.price + " x " + item.quantity;
        if (item.color) {
            message += " - Color: " + item.color;
        }
        if (item.size) {
            message += " - Size: " + item.size;
        }
        message += "\n";
        totalCost += item.price * item.quantity;
    }
    message += "Total Cost: $" + totalCost + "\n";
    return message;
}


// function toggleAddressInput() {

//     let deliveryMethod = document.getElementById("deliveryMethod").value;
//     let address = document.querySelector("#address");

//     if (deliveryMethod === "delivery") {
//       addressInputWrapper.style.display = "block";
//       pickupLocationsWrapper.style.display = "none";
//       address.required = true;
//     } else if (deliveryMethod === "pickUp") {
//       addressInputWrapper.style.display = "none";
//       pickupLocationsWrapper.style.display = "block";
//       address.required = false;
//     } 
// }




function sendOrderToWhatsApp() {
  let message = generateCartMessage(cart);

    message += "\n\nOrder Information:\n";
    message += "Name: " + document.getElementById("name").value + "\n";
    message += "Phone Number: " + document.getElementById("number").value + "\n";
    message += "Payment Method: " + document.getElementById("paymentMethod").value + "\n";
    message += "Receive Product: " + document.getElementById("deliveryMethod").value + "\n";

    
    if (document.getElementById("deliveryMethod").value === "delivery") {
      message += "Address: " + document.getElementById("address").value + "\n";
    } else if (document.getElementById("deliveryMethod").value === "pickUp") {
      message += "Pickup Location: " + document.getElementById("pickupLocation").value + "\n";
    }

    
   
    let phoneNumber = "+584246603768";
    let link = "https://api.whatsapp.com/send?phone=" + phoneNumber + "&text=" + encodeURIComponent(message);
    window.location.href = link;
    
    
      // clear the form
  form.reset();

  // clear the shopping cart
  resetCart()
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  if(!document.getElementById("deliveryMethod").value){
    showPopUpMessageRemove("seleccione un tipo de entrega")
    return
  }
  sendOrderToWhatsApp();
  resetCart();
  volverBtn();

 })


function resetCart(){
  cart = {
    items: []
  };

  updateCartCounter();
  displayCart();
  updateTotalCost();
  saveCartToLocalStorage();
  localStorage.removeItem("cart");
  cartCounter.innerText = 0;
  cartCounter.classList.remove("show");
  addressInputWrapper.style.display = "none";
  pickupLocationsWrapper.style.display = "none";
  pickUpBtn.classList.remove("active-method");
  deliveryBtn.classList.remove("active-method");
  volverBtn();


}






