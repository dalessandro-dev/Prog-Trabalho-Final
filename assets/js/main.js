/**
 * main.js - Funções globais, gerenciamento de estado e utilitários
 */

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

  addToCart(service) {
    const exists = this.cart.find(item => item.id === service.id);
    if (!exists) {
      this.cart.push({ ...service, quantity: 1 });
      this.saveCart();
      this.showToast('Serviço adicionado ao agendamento!', 'success');
    } else {
      this.showToast('Este serviço já está no seu agendamento.', 'info');
    }
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
      loginBtn.href = "#"; // Em uma app real, iria para o perfil
      loginBtn.onclick = (e) => {
        e.preventDefault();
        if(confirm("Deseja sair?")) {
          this.logout();
        }
      }
    }
  },
  
  login(userData) {
    this.user = userData;
    localStorage.setItem('@PetCare:user', JSON.stringify(userData));
    this.updateUserUI();
  },
  
  logout() {
    this.user = null;
    localStorage.removeItem('@PetCare:user');
    window.location.reload();
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
      backgroundColor: type === 'error' ? '#EF4444' : (type === 'info' ? '#3B82F6' : 'var(--primary-dark)'),
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
