const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartButton = document.getElementById('cart-button');
const cartPopup = document.getElementById('cart-popup');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const confirmation = document.getElementById('add-confirmation');

const formatCurrency = value => new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN'
}).format(value);

function showConfirmation() {
  confirmation.classList.remove('hidden');
  setTimeout(() => confirmation.classList.add('hidden'), 2000);
}

cartButton.addEventListener('click', () => {
  cartPopup.classList.toggle('hidden');
});

function addToCart(name, price, image) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity += 1;
  else cart.push({ name, price, quantity: 1, image });

  saveCart();
  updateCart();
  showConfirmation();
}

function increaseQuantity(name) {
  const item = cart.find(p => p.name === name);
  if (item) item.quantity += 1;
  saveCart();
  updateCart();
}

function decreaseQuantity(name) {
  const item = cart.find(p => p.name === name);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) removeFromCart(name);
    saveCart();
    updateCart();
  }
}

function removeFromCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index > -1) cart.splice(index, 1);
  saveCart();
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0, count = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex items-center mb-2';
    li.innerHTML = `
      <img src="${item.image}" class="w-12 h-12 object-contain mr-3" />
      <div class="flex-1">
        <strong>${item.name}</strong><br>
        <div class="flex items-center gap-2 mt-1">
          <button type="button" onclick="decreaseQuantity('${item.name}')" class="px-2 py-1 bg-gray-200 rounded">-</button>
          <span>${item.quantity}</span>
          <button type="button" onclick="increaseQuantity('${item.name}')" class="px-2 py-1 bg-gray-200 rounded">+</button>
        </div>
        <button type="button" onclick="removeFromCart('${item.name}')" class="text-red-600 text-xs underline mt-1 inline-block">Remover</button>
      </div>
      <span class="ml-2">${formatCurrency(item.price * item.quantity)}</span>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
    count += item.quantity;
  });

  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = count;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function checkout() {
  if (cart.length === 0) return alert("Carrinho vazio.");

  const nome = document.getElementById('cliente-nome').value.trim();
  const endereco = document.getElementById('cliente-endereco').value.trim();
  const pagamento = document.getElementById('cliente-pagamento').value;

  if (!nome || !endereco || !pagamento) return alert("Preencha todas as informações de entrega.");

  const numero = "258879903962";
  let msg = `*Pedido Jueldin Shop*%0A%0A`;
  cart.forEach(item => msg += `• ${item.name} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}%0A`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  msg += `%0A*Total:* ${formatCurrency(total)}%0A*Nome:* ${nome}%0A*Endereço:* ${endereco}%0A*Pagamento:* ${pagamento}`;

  window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');

  cart.length = 0;
  saveCart();
  updateCart();
  cartPopup.classList.add('hidden');
}

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-banner").style.display = "none";
}

window.onload = () => {
  if (localStorage.getItem("cookiesAccepted") === "true") {
    document.getElementById("cookie-banner").style.display = "none";
  }
  updateCart();
};
