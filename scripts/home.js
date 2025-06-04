// Inicialização do carrinho (mantenha estas variáveis globais)
let cartItems = [];
let cartTotal = 0;

// Adicionar ao array de compras salvas
let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

let inventory = {
    camera: 10,
    fireAlarm: 8,
    alarm: 5
};

// Carregar estoque do localStorage se existir
const savedInventory = localStorage.getItem('inventory');
if (savedInventory) {
    inventory = JSON.parse(savedInventory);
}

document.addEventListener('DOMContentLoaded', () => {
    // Remova estas linhas que estão duplicando as variáveis
    // let cartItems = [];
    // let cartTotal = 0;

    // Seleção dos elementos do carrinho
    const cartIcon = document.querySelector('.cart-icon');
    const cartDialog = document.getElementById('cartDialog');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Primeiro, adicione os campos necessários ao formulário de checkout
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm.querySelector('#fullName')) {
        checkoutForm.insertAdjacentHTML('afterbegin', `
            
        `);
    }

    // Event listener para abrir o carrinho
    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Clique no carrinho detectado');
        cartDialog.classList.add('active');
        updateCartDisplay();
    });

    // Event listener para fechar o carrinho
    closeCart.addEventListener('click', () => {
        cartDialog.classList.remove('active');
    });

    // Fechar carrinho quando clicar fora
    document.addEventListener('click', (e) => {
        if (cartDialog.classList.contains('active') && 
            !cartDialog.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            cartDialog.classList.remove('active');
        }
    });

    // Prevenir fechamento quando clicar dentro do carrinho
    cartDialog.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Event listener para o botão de finalizar compra
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showNotification('Seu carrinho está vazio!');
                return;
            }
            document.getElementById('checkoutFormContainer').style.display = 'flex';
            document.getElementById('cartDialog').classList.remove('active');
        });
    }

    // Event listener para o formulário de checkout
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleCheckout();
    });

    // Event listener para o botão de cancelar
    const cancelCheckoutBtn = document.getElementById('cancelCheckout');
    if (cancelCheckoutBtn) {
        cancelCheckoutBtn.addEventListener('click', () => {
            document.getElementById('checkoutFormContainer').style.display = 'none';
            document.getElementById('cartDialog').classList.add('active');
        });
    }

    // Adicionar event listeners para os botões de compra
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', handleBuyButtonClick);
    });

    // Carregar carrinho salvo
    loadCartFromLocalStorage();
});

// Atualizar a função handleBuyButtonClick
function handleBuyButtonClick(e) {
    e.preventDefault();
    const container = e.target.closest('.camera-container, .fire-container, .alarm-container');
    let productType, price;
    
    if (container.classList.contains('camera-container')) {
        if (inventory.camera <= 0) {
            showNotification('Produto fora de estoque!');
            return;
        }
        productType = 'Câmera de Segurança';
        price = 150.00;
        inventory.camera--;
    } else if (container.classList.contains('fire-container')) {
        if (inventory.fireAlarm <= 0) {
            showNotification('Produto fora de estoque!');
            return;
        }
        productType = 'Alarme de Incêndio';
        price = 175.00;
        inventory.fireAlarm--;
    } else {
        if (inventory.alarm <= 0) {
            showNotification('Produto fora de estoque!');
            return;
        }
        productType = 'Sistema de Alarme';
        price = 200.00;
        inventory.alarm--;
    }

    const image = container.querySelector('img').src;
    addToCart(productType, price, image);
    
    // Atualizar o estoque no localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Atualizar a exibição das unidades disponíveis
    updateInventoryDisplay();
    
    showNotification('Produto adicionado ao carrinho!');
}

function addToCart(productType, price, image) {
    cartItems.push({ productType, price, image });
    cartTotal += price;
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cartItems.length;
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.cart-total-value');
    
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
    } else {
        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.productType}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.productType}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                </div>
                <button onclick="removeFromCart(${index})" class="remove-item">&times;</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    totalElement.textContent = `R$ ${cartTotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cartTotal -= cartItems[index].price;
    cartItems.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification('Item removido do carrinho!');
}

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotal', cartTotal.toString());
}

function loadCartFromLocalStorage() {
    const savedItems = localStorage.getItem('cartItems');
    const savedTotal = localStorage.getItem('cartTotal');
    
    if (savedItems) {
        cartItems = JSON.parse(savedItems);
        cartTotal = parseFloat(savedTotal);
        updateCartCount();
        updateCartDisplay();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Função para processar o checkout
function handleCheckout() {
    const fullName = document.getElementById('fullName').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!fullName || !address || !paymentMethod) {
        showNotification('Por favor, preencha todos os campos!');
        return;
    }

    if (cartItems.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }

    try {
        // Criar objeto da compra
        const purchase = {
            items: [...cartItems],
            total: cartTotal,
            customer: {
                name: fullName,
                address: address,
                paymentMethod: paymentMethod
            },
            date: new Date().toLocaleString()
        };

        // Salvar no histórico
        purchaseHistory.push(purchase);
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

        // Limpar o carrinho
        cartItems = [];
        cartTotal = 0;
        
        // Atualizar exibições
        updateCartDisplay();
        updateCartCount();
        saveCartToLocalStorage();

        // Fechar formulário e carrinho
        document.getElementById('checkoutFormContainer').style.display = 'none';
        document.getElementById('cartDialog').classList.remove('active');

        // Limpar formulário
        document.getElementById('checkoutForm').reset();

        showNotification('Compra finalizada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao processar a compra:', error);
        showNotification('Erro ao processar a compra. Tente novamente.');
    }
}

// Função para recuperar histórico de compras
function getPurchaseHistory() {
    return JSON.parse(localStorage.getItem('purchaseHistory')) || [];
}

// Função para limpar histórico de compras
function clearPurchaseHistory() {
    localStorage.removeItem('purchaseHistory');
    purchaseHistory = [];
}

// Carrega o carrinho salvo quando a página é carregada
document.addEventListener('DOMContentLoaded', loadCartFromLocalStorage);

const historico = getPurchaseHistory();
console.log(historico); // Mostra todas as compras salvas

clearPurchaseHistory();

// Adicionar função para atualizar a exibição do estoque
function updateInventoryDisplay() {
    const availableButtons = document.querySelectorAll('.units-available-btn');
    availableButtons.forEach(button => {
        const container = button.closest('.camera-container, .fire-container, .alarm-container');
        if (container.classList.contains('camera-container')) {
            button.textContent = `${inventory.camera} Unidades Disponíveis`;
        } else if (container.classList.contains('fire-container')) {
            button.textContent = `${inventory.fireAlarm} Unidades Disponíveis`;
        } else {
            button.textContent = `${inventory.alarm} Unidades Disponíveis`;
        }
    });
}