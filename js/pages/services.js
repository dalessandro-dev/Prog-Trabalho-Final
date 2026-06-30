document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('services-grid');
  const filtersContainer = document.getElementById('categories-container');
  let currentCategory = 'todos';

  if (!container || !filtersContainer) return;

  const loadCategories = async () => {
    try {
      const categories = await PetcareAPI.getCategories();
      
      filtersContainer.innerHTML = categories.map(cat => `
        <button class="filter-btn ${cat.id === currentCategory ? 'active' : ''}" data-id="${cat.id}">
          ${cat.icon} ${cat.name}
        </button>
      `).join('');

      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          currentCategory = e.currentTarget.getAttribute('data-id');
          loadServices();
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const loadServices = async () => {
    container.innerHTML = `
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    `;
    try {
      const services = await PetcareAPI.getServices(currentCategory);
      
      if (services.length === 0) {
        container.innerHTML = `<p class="text-center" style="grid-column: 1/-1;">Nenhum serviço encontrado nesta categoria.</p>`;
        return;
      }

      container.innerHTML = services.map(service => `
        <div class="card service-card">
          <div class="service-image">
            <img src="${service.image}" alt="${service.title}" loading="lazy">
          </div>
          <div class="service-content">
            <span class="service-category">${service.category}</span>
            <h3 class="service-title">
              <a href="service-details.html?id=${service.id}">${service.title}</a>
            </h3>
            <p class="service-desc">${service.description}</p>
            <div class="service-footer">
              <span class="service-price">${App.formatCurrency(service.price)}</span>
              <button class="btn btn-primary add-to-cart-btn" data-id="${service.id}">
                <i class="ph ph-plus"></i> Agendar
              </button>
            </div>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.currentTarget.getAttribute('data-id'));
          const service = services.find(s => s.id === id);
          if (service) App.addToCart(service);
        });
      });
    } catch (error) {
      container.innerHTML = '<p class="text-center text-error">Erro ao carregar serviços.</p>';
    }
  };

  await loadCategories();
  await loadServices();
});
