/**
 * Lógica de Autenticação (Login e Cadastro com Validações)
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // ==========================================
  // UTILS GERAIS DE VALIDAÇÃO VISUAL
  // ==========================================
  const setError = (id, message) => {
    const input = document.getElementById(id);
    if (!input) return;
    const errorDiv = document.getElementById(`error-${id}`);
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  };

  const clearError = (id) => {
    const input = document.getElementById(id);
    if (!input) return;
    const errorDiv = document.getElementById(`error-${id}`);
    input.classList.remove('is-invalid');
    if(input.value && input.value.trim() !== '') input.classList.add('is-valid'); 
    if (errorDiv) {
      errorDiv.textContent = '';
      errorDiv.style.display = 'none';
    }
  };

  const clearAllErrors = () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
    const registerErr = document.getElementById('form-general-error');
    if (registerErr) registerErr.style.display = 'none';
    const loginErr = document.getElementById('login-general-error');
    if (loginErr) loginErr.style.display = 'none';
  };

  // ==========================================
  // LÓGICA DE LOGIN AVANÇADA
  // ==========================================
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors();
      let hasError = false;

      const email = document.getElementById('login_email').value.trim();
      const password = document.getElementById('login_password').value;

      // 1. Validações Frontend
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setError('login_email', 'Por favor, insira um e-mail válido.');
        hasError = true;
      } else { clearError('login_email'); }

      if (!password) {
        setError('login_password', 'A senha é obrigatória.');
        hasError = true;
      } else { clearError('login_password'); }

      if (hasError) return;

      // 2. Preparação Visual e Fetch (Mockado)
      const btn = document.getElementById('login-submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Autenticando...';
      btn.disabled = true;

      // O payload que será enviado para a API
      const loginPayload = { email, password };

      try {
        // Chamada abstraída para a camada de serviço (POST /login)
        const response = await ApiService.login(loginPayload);

        // 3. Sucesso -> Salvar sessão e Redirecionar
        btn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Logado com Sucesso!';
        btn.classList.replace('btn-primary', 'btn-secondary');

        // Salva dados do usuário logado no localStorage
        localStorage.setItem('@PetCare:user', JSON.stringify(response.user));
        
        // Redirecionamento pós login exigido (para o agendamento/carrinho)
        setTimeout(() => {
          window.location.href = 'agendamento.html';
        }, 1000);

      } catch (error) {
        const errorContainer = document.getElementById('login-general-error');
        errorContainer.textContent = error.message || "Falha na comunicação com o servidor.";
        errorContainer.style.display = 'block';
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // ==========================================
  // LÓGICA DE CADASTRO AVANÇADO
  // ==========================================
  if (registerForm) {
    
    // Utilitários de Máscara Simples (opcional, melhora UX)
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', function() {
        let val = this.value.replace(/\D/g, ''); // Remove não números
        if (val.length > 11) val = val.slice(0, 11);
        // Aplica máscara visual
        val = val.replace(/(\d{3})(\d)/, '$1.$2');
        val = val.replace(/(\d{3})(\d)/, '$1.$2');
        val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = val;
      });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        let val = this.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        if (val.length > 0) {
          val = val.replace(/^(\d{2})(\d)/g, '($1) $2');
          val = val.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        this.value = val;
      });
    }

    // Utilitário para gerenciar estado de erro dos inputs (Removido daqui pois foram movidos globalmente para cima)

    // Submissão do Formulário
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Impede o recarregamento
      clearAllErrors();
      let hasError = false;

      // 1. Extração dos Dados
      const data = {
        name: document.getElementById('name').value.trim(),
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''), // Pega só números
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.replace(/\D/g, ''),
        city: document.getElementById('city').value.trim(),
        address: document.getElementById('address').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm_password').value
      };

      // 2. Regras de Validação Individuais

      if (!data.name || data.name.length < 3) {
        setError('name', 'Informe seu nome completo.');
        hasError = true;
      } else { clearError('name'); }

      if (!data.cpf || data.cpf.length !== 11) {
        setError('cpf', 'CPF inválido. Deve conter 11 dígitos.');
        hasError = true;
      } else { clearError('cpf'); }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email)) {
        setError('email', 'Forneça um e-mail válido.');
        hasError = true;
      } else { clearError('email'); }

      if (!data.phone || data.phone.length < 10) {
        setError('phone', 'Telefone inválido (mínimo 10 dígitos com DDD).');
        hasError = true;
      } else { clearError('phone'); }

      if (!data.city) {
        setError('city', 'A cidade é obrigatória.');
        hasError = true;
      } else { clearError('city'); }

      if (!data.address) {
        setError('address', 'O endereço é obrigatório.');
        hasError = true;
      } else { clearError('address'); }

      if (!data.password || data.password.length < 6) {
        setError('password', 'A senha deve ter no mínimo 6 caracteres.');
        hasError = true;
      } else { clearError('password'); }

      if (data.password !== data.confirmPassword) {
        setError('confirm_password', 'As senhas não coincidem.');
        hasError = true;
      } else { clearError('confirm_password'); }

      // Apenas dados do Tutor agora são validados na tela inicial

      // 3. Checagem Final
      if (hasError) {
        // Exibe mensagem geral
        document.getElementById('form-general-error').style.display = 'block';
        // Rola a página para o primeiro erro (Acessibilidade/UX)
        const firstErrorInput = document.querySelector('.is-invalid');
        if (firstErrorInput) {
          firstErrorInput.focus();
          firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // 4. Fluxo de Sucesso (Preparado para POST na API)
      const btn = document.getElementById('submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processando...';
      btn.disabled = true;

      try {
        const tutorPayload = {
          nome: data.name,
          cpf: data.cpf,
          email: data.email,
          telefone: data.phone,
          cidade: data.city,
          endereco: data.address,
          senha: data.password
        };
        const response = await ApiService.cadastrarUsuario(tutorPayload);
        
        btn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Conta criada com sucesso!';
        btn.classList.replace('btn-primary', 'btn-secondary'); // Feedback visual verde/secundário

        // Opcional: Salvar no localStorage que logou
        // localStorage.setItem('@PetCare:user', JSON.stringify({ name: data.name, email: data.email }));

        setTimeout(() => {
          window.location.href = '../index.html'; // Redireciona para home ou tela de login
        }, 2000);

      } catch (error) {
        document.getElementById('form-general-error').textContent = "Falha no servidor. Tente novamente mais tarde.";
        document.getElementById('form-general-error').style.display = 'block';
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }
});
