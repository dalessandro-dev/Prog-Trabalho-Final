document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('@PetCare:token');
  const user = App.user;

  if (!token || !user) {
    App.showToast('Você precisa estar logado para acessar o perfil.', 'error');
    window.location.href = 'login.html';
    return;
  }

  // Preencher nome
  document.getElementById('profile-user-name').textContent = user.name;

  // Logout
  document.getElementById('btn-logout').addEventListener('click', (e) => {
    e.preventDefault();
    if(confirm('Tem certeza que deseja sair?')) {
      App.logout();
    }
  });

  // Carregar Pets
  loadPets();

  // Formulário de Cadastro de Pets
  const petForm = document.getElementById('pet-form');
  const btnSave = document.getElementById('btn-save-pet');

  petForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    btnSave.classList.add('loading');
    
    const petData = {
      name: document.getElementById('pet_name').value,
      species: document.getElementById('pet_species').value,
      breed: document.getElementById('pet_breed').value,
      age: document.getElementById('pet_age').value,
      notes: document.getElementById('pet_notes').value,
    };

    try {
      await ApiService.cadastrarPet(petData);
      App.showToast('Pet cadastrado com sucesso!', 'success');
      petForm.reset();
      loadPets(); // Recarrega a lista
    } catch (error) {
      App.showToast(error.message, 'error');
    } finally {
      btnSave.classList.remove('loading');
    }
  });
});

async function loadPets() {
  const listContainer = document.getElementById('pets-list');
  try {
    const pets = await ApiService.getPets();
    
    if (pets.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; border: 1px dashed var(--color-gray-300); border-radius: var(--radius-md);">
          <i class="ph ph-paw-print" style="font-size: 3rem; color: var(--color-gray-400);"></i>
          <p class="mt-2 text-muted">Você ainda não tem pets cadastrados.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = pets.map(pet => `
      <div class="pet-card">
        <div class="pet-avatar">
          <i class="ph-fill ph-${pet.species.toLowerCase() === 'gato' ? 'cat' : (pet.species.toLowerCase() === 'ave' ? 'bird' : 'dog')}"></i>
        </div>
        <div style="flex: 1;">
          <h4 class="font-bold">${pet.name}</h4>
          <p class="text-small text-muted">${pet.species} ${pet.breed ? ' • ' + pet.breed : ''} • ${pet.age}</p>
        </div>
        <div class="text-small text-muted">
           ${pet.notes ? '<i class="ph ph-file-text"></i> Possui obs.' : ''}
        </div>
      </div>
    `).join('');

  } catch (error) {
    listContainer.innerHTML = `<p class="text-error">Erro ao carregar os pets.</p>`;
    console.error(error);
  }
}
