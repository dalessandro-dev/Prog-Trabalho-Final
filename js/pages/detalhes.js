/**
 * Lógica da Página de Detalhes
 * Lê o ID da URL (?id=x), faz o fetch via API Mockada e injeta os dados detalhados no DOM.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('details-container');

  // 1. Captura do parâmetro ID via URL (Query String)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  // Validação imediata caso acessem a página sem o ID
  if (!id) {
    container.innerHTML = `
      <div class="error-container">
        <h2>Serviço não especificado!</h2>
        <p>Por favor, volte ao catálogo e selecione um serviço válido.</p>
        <a href="servicos.html" class="btn btn-secondary mt-4">Ir para Catálogo</a>
      </div>
    `;
    return;
  }

  try {
    // 2. Requisição GET simulada passando o parâmetro através da Service Layer
    const service = await ApiService.getServiceById(id);

    // 3. Renderização Dinâmica (Remoção dos Skeletons e injeção dos dados)
    container.innerHTML = `
      <div class="details-layout">
        
        <!-- Imagem -->
        <div class="details-image">
          <img src="${service.image}" alt="${service.title}">
        </div>

        <!-- Conteúdo Textual -->
        <div class="details-content">
          
          <div class="details-header">
            <span class="badge badge-primary">${service.categoryName}</span>
            <h1 class="mt-4">${service.title}</h1>
            
            <div class="details-meta">
              <div class="meta-item">
                <i class="ph-fill ph-star"></i>
                <span><strong>${service.rating}</strong> (${service.reviews} avaliações)</span>
              </div>
              <div class="meta-item">
                <i class="ph ph-clock"></i>
                <span><strong>Tempo médio:</strong> ${service.duration}</span>
              </div>
              <div class="meta-item">
                <i class="ph ph-user-circle"></i>
                <span><strong>Responsável:</strong> ${service.professional}</span>
              </div>
            </div>
          </div>

          <!-- Descrição Principal -->
          <div class="details-info-section">
            <h3>Sobre o Serviço</h3>
            <p>${service.description}</p>
          </div>

          <!-- Cuidados -->
          <div class="details-info-section">
            <h3>Cuidados Importantes</h3>
            <ul class="details-list">
              ${service.cares.map(care => `
                <li><i class="ph-fill ph-warning-circle"></i> <span>${care}</span></li>
              `).join('')}
            </ul>
          </div>

          <!-- Benefícios -->
          <div class="details-info-section">
            <h3>Benefícios</h3>
            <ul class="details-list">
              ${service.benefits.map(benefit => `
                <li><i class="ph-fill ph-check-circle"></i> <span>${benefit}</span></li>
              `).join('')}
            </ul>
          </div>

          <!-- Ação (Adicionar) -->
          <div class="details-actions">
            <div class="price-block">
              <span class="price-label">Valor do Investimento</span>
              <span class="price-value">${Utils.formatCurrency(service.price)}</span>
            </div>
            
            <button class="btn btn-primary btn-large" id="add-to-cart-btn">
              <i class="ph ph-calendar-plus"></i> Adicionar ao Agendamento
            </button>
          </div>

        </div>
      </div>
    `;

    // 4. Lógica de clique do botão
    const addBtn = document.getElementById('add-to-cart-btn');
    addBtn.addEventListener('click', () => {
      // Aqui integraria com a funcionalidade de carrinho do state global
      const originalText = addBtn.innerHTML;
      addBtn.innerHTML = '<i class="ph ph-check"></i> Adicionado com sucesso!';
      addBtn.classList.add('btn-secondary');
      addBtn.classList.remove('btn-primary');
      
      // Voltar ao normal após feedback visual
      setTimeout(() => {
        addBtn.innerHTML = originalText;
        addBtn.classList.remove('btn-secondary');
        addBtn.classList.add('btn-primary');
      }, 2000);
    });

  } catch (error) {
    // 5. Estado de erro (ex: Serviço ID não existe)
    console.error(error);
    container.innerHTML = `
      <div class="error-container">
        <h2>Serviço não encontrado.</h2>
        <p>O serviço que você está procurando pode ter sido removido ou está indisponível no momento.</p>
        <a href="servicos.html" class="btn btn-secondary mt-4">Ver Todos os Serviços</a>
      </div>
    `;
  }
});
