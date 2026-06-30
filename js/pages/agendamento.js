/**
 * Lógica do Carrinho / Agendamento
 */

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('cart-tbody');
  const tableWrapper = document.getElementById('cart-table-wrapper');
  const emptyState = document.getElementById('cart-empty-state');
  const cartFooter = document.getElementById('cart-footer');
  const totalPriceEl = document.getElementById('cart-total-value');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  // Elementos do Modal de Confirmação (Sem usar Alert/Confirm nativo)
  const modal = document.getElementById('confirm-modal');
  const btnCancel = document.getElementById('modal-cancel');
  const btnConfirm = document.getElementById('modal-confirm');
  let itemPendingRemovalId = null;

  // 1. DADOS (Array simulando state global / carrinho)
  // Estruturado para consumir LocalStorage ou API no futuro.
  let cartData = [];

  // Tenta carregar do localStorage (Integração Futura/Atual)
  try {
    const saved = localStorage.getItem('@PetCare:cart');
    if (saved) cartData = JSON.parse(saved);
  } catch(e) {}

  // MOCK DE FALLBACK: Se estiver vazio, insere itens de teste para você validar visualmente a tabela
  if (cartData.length === 0) {
    cartData = [
      {
        id: 1,
        title: "Check-up Completo",
        image: "https://images.unsplash.com/photo-1628009368231-7bb7cb131649?auto=format&fit=crop&q=80&w=200",
        price: 150.00,
        quantity: 1
      },
      {
        id: 6,
        title: "Banho Terapêutico",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=200",
        price: 80.00,
        quantity: 2
      }
    ];
    // Salva o Mock no LocalStorage para que o usuário sinta o fluxo funcionando
    saveCart();
  }

  // 2. FUNÇÃO DE SALVAMENTO E SINCRONIZAÇÃO
  function saveCart() {
    localStorage.setItem('@PetCare:cart', JSON.stringify(cartData));
    renderTable();
  }

  // 3. ATUALIZA QUANTIDADE DE UM ITEM (Com lógica de zerar)
  window.updateQty = function(id, delta) {
    const index = cartData.findIndex(item => item.id === id);
    if (index === -1) return;

    let newQty = cartData[index].quantity + delta;

    if (newQty <= 0) {
      // Abre o Modal customizado em vez do 'confirm()' nativo
      itemPendingRemovalId = id;
      modal.classList.add('active');
    } else {
      cartData[index].quantity = newQty;
      saveCart();
    }
  };

  // 4. REMOVE ITEM DIRETAMENTE
  window.removeItem = function(id) {
    cartData = cartData.filter(item => item.id !== id);
    saveCart();
  };

  // 5. RENDERIZAÇÃO DINÂMICA DA TABELA E TOTAIS
  function renderTable() {
    if (cartData.length === 0) {
      tableWrapper.style.display = 'none';
      cartFooter.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    tableWrapper.style.display = 'block';
    cartFooter.style.display = 'flex';
    emptyState.style.display = 'none';

    let totalGeral = 0;

    tbody.innerHTML = cartData.map(item => {
      const subtotal = item.price * item.quantity;
      totalGeral += subtotal;

      return `
        <tr>
          <td>
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          </td>
          <td class="service-name">${item.title}</td>
          <td class="price-col">${Utils.formatCurrency(item.price)}</td>
          <td>
            <div class="qty-control">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Diminuir quantidade de ${item.title}">
                <i class="ph ph-minus"></i>
              </button>
              <span class="qty-value" aria-live="polite">${item.quantity}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Aumentar quantidade de ${item.title}">
                <i class="ph ph-plus"></i>
              </button>
            </div>
          </td>
          <td class="subtotal-col">${Utils.formatCurrency(subtotal)}</td>
          <td class="text-center">
            <button class="remove-btn" onclick="removeItem(${item.id})" aria-label="Remover ${item.title}">
              <i class="ph ph-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    totalPriceEl.textContent = Utils.formatCurrency(totalGeral);
  }

  // 6. EVENTOS DO MODAL DE CONFIRMAÇÃO (Lógica ZERAR quantidade)
  btnCancel.addEventListener('click', () => {
    modal.classList.remove('active');
    itemPendingRemovalId = null;
    // Nenhuma alteração é feita no array, o item continua com quantidade 1.
  });

  btnConfirm.addEventListener('click', () => {
    if (itemPendingRemovalId !== null) {
      removeItem(itemPendingRemovalId);
      itemPendingRemovalId = null;
    }
    modal.classList.remove('active');
  });

  // 7. EVENTO DE CHECKOUT
  checkoutBtn.addEventListener('click', async () => {
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processando...';
    checkoutBtn.disabled = true;

    try {
      // Integração abstraída com a Service Layer (POST /agendamento)
      const response = await ApiService.checkout(cartData);

      checkoutBtn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Sucesso!';
      checkoutBtn.classList.replace('btn-primary', 'btn-secondary');

      // Limpa o carrinho
      cartData = [];
      localStorage.removeItem('@PetCare:cart');
      
      // Feedback visual e Redirecionamento
      setTimeout(() => {
        window.location.href = '../index.html'; // Volta pra home após finalizar
      }, 1500);

    } catch (error) {
      checkoutBtn.innerHTML = originalText;
      checkoutBtn.disabled = false;
      console.error(error);
    }
  });

  // 8. Inicializa a view
  renderTable();
});
