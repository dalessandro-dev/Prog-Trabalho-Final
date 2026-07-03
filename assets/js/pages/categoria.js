
 // Lógica da Página de Serviços
 // Consome os dados e gera os cards e filtros a partir da Mock API.
 

document.addEventListener('DOMContentLoaded', async () => {
  const gridContainer = document.getElementById('services-grid');
  const filtersContainer = document.getElementById('filters-container');
  const emptyState = document.getElementById('empty-state');

  // Variável de estado local — lê categoria da URL se existir (ex: ?categoria=clinica)
  const urlParams = new URLSearchParams(window.location.search);
  let currentCategory = urlParams.get('categoria') || 'todos';
  let allServices = [];

  try {
    // 1. Busca os dados simultaneamente (Promise.all)
    const [categoriesData, servicesData] = await Promise.all([
      ApiService.getCategorias(),
      ApiService.getServicos()
    ]);
    allServices = servicesData;

    // 2. Renderiza Filtros de Categorias (inclui "Todos" manualmente)
    const todoBtn = `<button class="filter-btn ${currentCategory === 'todos' ? 'active' : ''}" data-id="todos"><i class="ph-fill ph-list"></i> Todos</button>`;
    filtersContainer.innerHTML = todoBtn + categoriesData.map(cat => `
      <button class="filter-btn ${cat.id === currentCategory ? 'active' : ''}" data-id="${cat.id}">
        <i class="${cat.icon}"></i> ${cat.title}
      </button>
    `).join('');

    // Adiciona evento de clique aos botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove a classe 'active' de todos
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        // Adiciona 'active' no clicado
        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');
        
        // Atualiza o estado
        currentCategory = targetBtn.getAttribute('data-id');
        
        // Renderiza novamente a grade
        renderGrid();
      });
    });

    // 3. Função central para renderizar a grade de serviços com base no estado
    function renderGrid() {
      // Filtragem
      let filteredServices = allServices;
      if (currentCategory !== 'todos') {
        filteredServices = allServices.filter(s => s.categoryId === currentCategory);
      }

      // Trata estado vazio
      if (filteredServices.length === 0) {
        gridContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';

      // Gera os cards HTML e injeta no DOM
      gridContainer.innerHTML = filteredServices.map(service => `
        <article class="card service-card">
          <div class="service-image">
            <img src="${service.image}" alt="${service.title}" loading="lazy">
            <span class="badge badge-floating">${service.categoryName}</span>
          </div>
          
          <div class="service-content">
            <h3 class="service-title">${service.title}</h3>
            <p class="service-desc">${service.description}</p>
            
            <div class="service-footer">
              <span class="service-price">${Utils.formatCurrency(service.price)}</span>
              <!-- Redirecionamento obrigatório via Query String ?id=X -->
              <a href="detalhes.html?id=${service.id}" class="btn btn-primary service-btn">
                Ver Detalhes
              </a>
            </div>
          </div>
        </article>
      `).join('');
    }

    // Chamada inicial
    renderGrid();

  } catch (error) {
    console.error("Falha na comunicação com a API", error);
    gridContainer.innerHTML = `<p class="text-error" style="grid-column: 1/-1; text-align: center;">Ocorreu um problema ao carregar os serviços. Tente novamente.</p>`;
  }
});
