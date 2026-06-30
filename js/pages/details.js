document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('details-container');
  
  // Extrai o ID da URL (?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    container.innerHTML = `<div class="text-center p-8"><p>Serviço não encontrado.</p></div>`;
    return;
  }

  try {
    const service = await PetcareAPI.getServiceById(id);
    
    container.innerHTML = `
      <div class="details-layout">
        <div class="details-image">
          <img src="${service.image}" alt="${service.title}">
        </div>
        <div class="details-content">
          <span class="d-category">${service.category}</span>
          <h1>${service.title}</h1>
          <div class="d-meta">
            <span class="d-rating"><i class="ph-fill ph-star"></i> ${service.rating} (${service.reviews} avaliações)</span>
            <span><i class="ph ph-clock"></i> Duração: ${service.duration}</span>
          </div>
          <p class="d-desc">${service.description}</p>
          
          <div class="d-footer">
            <div class="d-price">${App.formatCurrency(service.price)}</div>
            <button class="btn btn-primary btn-lg" id="add-btn">
              <i class="ph ph-calendar-plus"></i> Agendar Serviço
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('add-btn').addEventListener('click', () => {
      App.addToCart(service);
    });

  } catch (error) {
    container.innerHTML = `<div class="text-center p-8"><p class="text-error">${error.message}</p></div>`;
  }
});
