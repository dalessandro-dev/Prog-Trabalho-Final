/**
 * Lógica da Página Home
 * Consome os dados da API e renderiza os componentes dinamicamente.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Referências do DOM
  const categoriesContainer = document.getElementById('categories-container');
  const servicesContainer = document.getElementById('popular-services-container');
  const testimonialsContainer = document.getElementById('testimonials-container');
  const promoContainer = document.getElementById('promo-container');

  try {
    // 1. Fazendo Fetch da API (Mock) através da camada de serviço
    const homeData = await ApiService.getHomeData();

    // 2. Renderizar Categorias
    categoriesContainer.innerHTML = homeData.categories.map(cat => `
      <a href="#" class="card category-card" style="--cat-bg: ${cat.color}; --cat-color: ${cat.textColor}">
        <div class="category-icon">
          <i class="ph-fill ${cat.icon}"></i>
        </div>
        <h3 class="h4 mt-4">${cat.title}</h3>
        <p class="text-small mt-2">${cat.description}</p>
      </a>
    `).join('');

    // 3. Renderizar Serviços Mais Procurados
    servicesContainer.innerHTML = homeData.popularServices.map(service => `
      <div class="card service-card">
        <div class="service-image">
          <img src="${service.image}" alt="${service.title}" loading="lazy">
          <span class="badge badge-primary badge-floating">${service.category}</span>
        </div>
        <div class="service-content">
          <h3 class="h4">${service.title}</h3>
          <div class="service-rating mt-2 mb-4">
            <i class="ph-fill ph-star"></i>
            <span class="font-medium">${service.rating}</span>
            <span class="text-muted">(${service.reviews})</span>
          </div>
          <div class="service-footer">
            <span class="service-price">${Utils.formatCurrency(service.price)}</span>
            <button class="btn btn-primary" aria-label="Agendar ${service.title}">
              <i class="ph ph-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // 4. Renderizar Depoimentos
    testimonialsContainer.innerHTML = homeData.testimonials.map(test => `
      <div class="card testimonial-card">
        <div class="testimonial-stars mb-4">
          ${Array(5).fill(0).map((_, i) => `<i class="ph-fill ph-star ${i < test.stars ? 'active' : ''}"></i>`).join('')}
        </div>
        <p class="testimonial-text">"${test.text}"</p>
        <div class="testimonial-author mt-6">
          <img src="${test.avatar}" alt="${test.author}" class="avatar">
          <div>
            <div class="font-bold text-gray-900">${test.author}</div>
            <div class="text-small text-muted">${test.pet}</div>
          </div>
        </div>
      </div>
    `).join('');

    // 5. Renderizar Banner Promocional
    const promo = homeData.promotion;
    promoContainer.innerHTML = `
      <div class="promo-banner card">
        <div class="promo-content">
          <span class="badge badge-warning mb-4">Oferta Especial</span>
          <h2 class="h2">${promo.title}</h2>
          <p class="mt-4 text-lg text-gray-800">${promo.subtitle}</p>
          <div class="promo-code mt-6">
            <span class="text-small text-muted block mb-2">Use o cupom:</span>
            <div class="code-box">
              <strong>${promo.code}</strong>
              <button class="btn btn-secondary btn-sm copy-btn" onclick="navigator.clipboard.writeText('${promo.code}')">Copiar</button>
            </div>
          </div>
        </div>
        <div class="promo-image">
          <img src="${promo.image}" alt="Promocional">
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Erro ao carregar os dados da Home", error);
    // Renderização de Estado de Erro
    categoriesContainer.innerHTML = `<p class="text-error">Erro ao carregar dados.</p>`;
    servicesContainer.innerHTML = `<p class="text-error">Erro ao carregar serviços.</p>`;
    testimonialsContainer.innerHTML = `<p class="text-error">Erro ao carregar depoimentos.</p>`;
    promoContainer.innerHTML = `<p class="text-error">Promoção indisponível.</p>`;
  }
});
