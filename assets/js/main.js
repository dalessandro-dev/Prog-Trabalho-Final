 
 // main.js - Funções globais, gerenciamento de estado e utilitários
 

const App = {
  cart: [],
  user: null,

  init() {
    this.loadState();
    this.updateCartBadge();
    this.updateUserUI();
  },

  loadState() {
    const savedCart = localStorage.getItem('@PetCare:cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }
    
    const savedUser = localStorage.getItem('@PetCare:user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (e) {
        this.user = null;
      }
    }
  },

  saveCart() {
    localStorage.setItem('@PetCare:cart', JSON.stringify(this.cart));
    this.updateCartBadge();
  },

  async addToCart(service) {
    if (!this.user) {
      localStorage.setItem('@PetCare:pending_cart_item', JSON.stringify(service));
      this.showAuthModal();
      return;
    }

    try {
      // Busca os pets do usuário autenticado na API
      const pets = await ApiService.getPets();
      
      if (pets.length === 0) {
        this.showNoPetModal();
        return;
      }
      
      if (pets.length === 1) {
        // Apenas 1 pet, adiciona direto para ele
        this.finishAddToCart(service, pets[0]);
        return;
      }
      
      // Mais de 1 pet, abre o modal de seleção
      this.showPetSelectionModal(service, pets);

    } catch (error) {
      this.showToast('Erro ao buscar seus pets. Tente novamente.', 'error');
    }
  },

  finishAddToCart(service, selectedPet) {
    // Permite o mesmo serviço para pets diferentes
    const cartItemId = `${service.id}-${selectedPet.id}`;
    
    const exists = this.cart.find(item => item.cartItemId === cartItemId);
    if (!exists) {
      this.cart.push({ 
        ...service, 
        cartItemId, 
        petId: selectedPet.id, 
        petName: selectedPet.name, 
        quantity: 1 
      });
      this.saveCart();
      this.showToast(`Agendamento adicionado para ${selectedPet.name}!`, 'success');
    } else {
      this.showToast(`Este serviço já está agendado para ${selectedPet.name}.`, 'info');
    }
  },

  showAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auth-modal';
      Object.assign(modal.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
      });

      const isPagesDir = window.location.pathname.includes('/pages/');
      const loginPath = isPagesDir ? 'login.html' : 'pages/login.html';
      const registerPath = isPagesDir ? 'cadastro.html' : 'pages/cadastro.html';

      modal.innerHTML = `
        <div class="card" style="max-width: 400px; width: 90%; padding: var(--spacing-8); position: relative; text-align: center; transform: translateY(-20px); transition: transform 0.3s ease;">
          <button id="auth-modal-close" style="position: absolute; top: var(--spacing-4); right: var(--spacing-4); background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-gray-500);"><i class="ph ph-x"></i></button>
          <div style="font-size: 3.5rem; color: var(--color-primary-500); margin-bottom: var(--spacing-4);"><i class="ph-fill ph-lock-key"></i></div>
          <h3 class="h4 mb-2 text-gray-900">Acesso Restrito</h3>
          <p class="text-muted mb-6">Para adicionar serviços ao seu agendamento, você precisa estar logado na sua conta.</p>
          <div style="display: flex; gap: var(--spacing-3); flex-direction: column;">
            <a href="${loginPath}" class="btn btn-primary" style="width: 100%;">Fazer Login</a>
            <a href="${registerPath}" class="btn btn-secondary" style="width: 100%;">Criar Conta</a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('auth-modal-close').addEventListener('click', () => {
        this.closeModal(modal);
      });
    }

    this.openModal(modal);
  },

  showNoPetModal() {
    let modal = document.getElementById('nopet-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'nopet-modal';
      Object.assign(modal.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
      });

      const isPagesDir = window.location.pathname.includes('/pages/');
      const perfilPath = isPagesDir ? 'perfil.html' : 'pages/perfil.html';

      modal.innerHTML = `
        <div class="card" style="max-width: 400px; width: 90%; padding: var(--spacing-8); position: relative; text-align: center; transform: translateY(-20px); transition: transform 0.3s ease;">
          <button id="nopet-modal-close" style="position: absolute; top: var(--spacing-4); right: var(--spacing-4); background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-gray-500);"><i class="ph ph-x"></i></button>
          <div style="font-size: 3.5rem; color: var(--color-primary-500); margin-bottom: var(--spacing-4);"><i class="ph-fill ph-paw-print"></i></div>
          <h3 class="h4 mb-2 text-gray-900">Nenhum Pet Cadastrado</h3>
          <p class="text-muted mb-6">Você precisa cadastrar um pet antes de poder agendar este serviço.</p>
          <a href="${perfilPath}" class="btn btn-primary" style="width: 100%;">Cadastrar meu Pet</a>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('nopet-modal-close').addEventListener('click', () => {
        this.closeModal(modal);
      });
    }
    this.openModal(modal);
  },

  showPetSelectionModal(service, pets) {
    let modal = document.getElementById('pet-selection-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pet-selection-modal';
      Object.assign(modal.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
      });
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="card" style="max-width: 400px; width: 90%; padding: var(--spacing-8); position: relative; text-align: left; transform: translateY(-20px); transition: transform 0.3s ease;">
        <button id="pet-modal-close" style="position: absolute; top: var(--spacing-4); right: var(--spacing-4); background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-gray-500);"><i class="ph ph-x"></i></button>
        <h3 class="h4 mb-2 text-gray-900">Para qual pet?</h3>
        <p class="text-muted mb-6">Selecione o animal para o serviço: <strong>${service.title}</strong></p>
        
        <div style="display:flex; flex-direction: column; gap: var(--spacing-3);">
          ${pets.map(pet => `
            <button class="btn btn-secondary pet-select-btn" data-id="${pet.id}" data-name="${pet.name}" style="justify-content: flex-start; text-align: left;">
              <i class="ph-fill ph-${pet.species.toLowerCase() === 'gato' ? 'cat' : (pet.species.toLowerCase() === 'ave' ? 'bird' : 'dog')}"></i> 
              ${pet.name} <span style="font-weight: normal; color: var(--color-gray-500); margin-left: auto;">(${pet.species})</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('pet-modal-close').addEventListener('click', () => {
      this.closeModal(modal);
    });

    modal.querySelectorAll('.pet-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedId = e.currentTarget.getAttribute('data-id');
        const selectedName = e.currentTarget.getAttribute('data-name');
        
        const selectedPet = pets.find(p => p.id == selectedId);
        if (selectedPet) {
          this.finishAddToCart(service, selectedPet);
          this.closeModal(modal);
        }
      });
    });

    this.openModal(modal);
  },

  openModal(modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.children[0].style.transform = 'translateY(0)';
    }, 10);
  },

  closeModal(modal) {
    modal.style.opacity = '0';
    modal.children[0].style.transform = 'translateY(-20px)';
    setTimeout(() => modal.style.display = 'none', 300);
  },
  
  removeFromCart(id) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
  },
  
  clearCart() {
    this.cart = [];
    this.saveCart();
  },

  updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = this.cart.length;
      badge.style.display = this.cart.length > 0 ? 'flex' : 'none';
      
      // Animação de pulso
      if (this.cart.length > 0) {
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
      }
    }
  },
  
  updateUserUI() {
    const loginBtn = document.getElementById('header-login-btn');
    if (!loginBtn) return;
    
    if (this.user) {
      // Ajusta visual para usuário logado (pode ser um dropdown no futuro)
      loginBtn.innerHTML = `<i class="ph ph-user"></i> ${this.user.name.split(' ')[0]}`;
      const isPagesDir = window.location.pathname.includes('/pages/');
      loginBtn.href = isPagesDir ? 'perfil.html' : 'pages/perfil.html';
      loginBtn.onclick = null;
    }
  },
  
  login(userData) {
    this.user = userData;
    localStorage.setItem('@PetCare:user', JSON.stringify(userData));
    this.updateUserUI();
  },
  
  logout() {
    this.user = null;
    ApiService.logout();
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<i class="ph-fill ph-check-circle"></i>';
    if (type === 'error') icon = '<i class="ph-fill ph-x-circle"></i>';
    if (type === 'info') icon = '<i class="ph-fill ph-info"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    // Estilos dinâmicos do Toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: type === 'error' ? 'var(--color-error)' : (type === 'info' ? 'var(--color-info)' : 'var(--color-success)'),
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: '1000',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontWeight: '500',
      animation: 'fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOutDown 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Global CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeOutDown { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(30px); } }
`;
document.head.appendChild(style);

// Inicialização
document.addEventListener('DOMContentLoaded', () => App.init());
