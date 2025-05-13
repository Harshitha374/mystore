let products = [];
let orders = [];
let cart = {};
let users = [];
let user = {};
let total = 0;

const addToCart = (id) => {
  if (!cart[id]) cart[id] = 1;
  showCart();
};

const increment = (id) => {
  cart[id] += 1;
  showCart();
};

const decrement = (id) => {
  cart[id] -= 1;
  if (cart[id] < 1) delete cart[id];
  showCart();
};

const showTotal = () => {
  total = products.reduce((sum, value) => {
    return sum + value.price * (cart[value.id] || 0);
  }, 0);
  document.getElementById("divTotal").innerHTML = `Order Value: $${total}`;
};

const showOrders = () => {
  let str = "<div style='padding:30px'><h3>My Orders</h3>";
  orders.forEach((value) => {
    if (value.customer === user.email) {
      str += `
      <div>
        ${value.customer} - $${value.orderValue} - 
        ${Object.keys(value.items).length} items - 
        ${value.status}
      </div>`;
    }
  });
  document.getElementById("divProducts").innerHTML = str + "</div>";
};

const showMain = () => {
  let str = `
  <div class="container">
    <div class="header">
      <h1>My Store</h1>
      <div class='menu'>
        <li onclick='showProducts()'>Home</li>
        <li onclick='showOrders()'>Orders</li>
        <li onclick="displayCart()">Cart: <span id="items"></span></li>
        <li onclick='showLogin()'>Logout</li>
      </div>
    </div>
    <div class="productBlock">
      <div id="divProducts"></div>
    </div>
    <div id="divCartBlock" class="cartBlock" style="position: fixed; right: 0; top: 70px; width: 300px; background: #f1f1f1; padding: 10px; border: 1px solid #ccc; display: none;">
      <h3>My Cart</h3>
      <div id="divCart"></div>
      <div id="divTotal"></div>
      <button onclick="hideCart()">Close</button>
    </div>
    <hr>
    <h4 style="text-align: center;">@Copyright 2025. All rights reserved.</h4>
  </div>`;
  document.getElementById("root").innerHTML = str;
  showProducts();
};

const placeOrder = () => {
  orders.push({
    customer: user.email,
    items: cart,
    orderValue: total,
    status: "pending"
  });
  cart = {};
  hideCart();
  showOrders();
};

const showCart = () => {
  let str = "";
  products.forEach(value => {
    if (cart[value.id]) {
      str += `
      <li>${value.name} - $${value.price} 
      <button onclick='decrement(${value.id})'>-</button> 
      ${cart[value.id]} 
      <button onclick='increment(${value.id})'>+</button> 
      = $${value.price * cart[value.id]}</li>`;
    }
  });
  if (str) str += `<br><button onclick='placeOrder()'>Place Order</button>`;
  document.getElementById("divCart").innerHTML = str;
  document.getElementById("items").innerText = Object.keys(cart).length;
  showTotal();
};

const displayCart = () => {
  document.getElementById("divCartBlock").style.display = "block";
};

const hideCart = () => {
  document.getElementById("divCartBlock").style.display = "none";
};

function showLogin() {
  let str = `
  <div class='login'>
    <h2>Login Form</h2>
    <div id='msg' style='color:red;'></div>
    <p><input id="email" placeholder='Email Address' type="text"></p>
    <p><input id="password" placeholder='Password' type="password"></p>
    <button onclick='chkUser()'>Log In</button>
    <p><button onclick='showForm()'>Create Account</button></p>
  </div>`;
  document.getElementById("root").innerHTML = str;
}

function showForm() {
  let str = `<div class='registration'>
    <h2>Registration Form</h2>
    <p><input type="text" id="name" placeholder="Name"></p>
    <p><input type="text" id="email" placeholder="Email"></p>
    <p><input type="password" id="password" placeholder="Password"></p>
    <p><input type="date" id="dob"></p>
    <p><button onclick='addUser()'>Submit</button></p>
    <p>Already a member? <button onclick='showLogin()'>Login Here</button></p>
  </div>`;
  document.getElementById("root").innerHTML = str;
}

function chkUser() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let found = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      user = users[i];
      found = true;
      showMain();
      break;
    }
  }
  if (!found) document.getElementById("msg").innerHTML = "Access Denied";
}

function addUser() {
  let user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    dob: document.getElementById("dob").value,
    balance: 0
  };
  users.push(user);
  showLogin();
}

const showProducts = () => {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      let str = "<div class='row'>";
      products.forEach(product => {
        str += `
        <div class='box'>
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <h4>$${product.price}</h4>
          <button onclick='addToCart(${product.id})'>Add to Cart</button>
        </div>`;
      });
      str += "</div>";
      document.getElementById("divProducts").innerHTML = str;
    });
};
