import { authService } from '../services/auth';

export function renderLogin(): string {
  return `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="backdrop-blur-md bg-white/40 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/60">
        <!-- Logo y título -->
        <div class="text-center mb-8">
          <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Consultorio Jurídico</h1>
          <p class="text-gray-600">UTMACH - Sistema de Gestión</p>
        </div>

        <!-- Formulario -->
        <form id="loginForm" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Correo Institucional</label>
            <input 
              type="email" 
              id="email"
              required 
              placeholder="correo@utmachala.edu.ec"
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div class="relative">
              <input 
                type="password" 
                id="password"
                required 
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button 
                type="button" 
                id="togglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div id="errorMessage" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <p class="text-sm"></p>
          </div>

          <!-- Botón de login -->
          <button 
            type="submit" 
            id="loginButton"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Iniciar Sesión
          </button>

          <!-- Link recuperación -->
          <div class="text-center">
            <button 
              type="button" 
              id="forgotPassword"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center text-xs text-gray-500">
          <p>Sistema de uso exclusivo para personal autorizado</p>
          <p class="mt-1">© 2025 Universidad Técnica de Machala</p>
        </div>
      </div>
    </div>
  `;
}

export function initLogin() {
  const form = document.getElementById('loginForm') as HTMLFormElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const togglePasswordBtn = document.getElementById('togglePassword');
  const forgotPasswordBtn = document.getElementById('forgotPassword');
  const errorMessage = document.getElementById('errorMessage');
  const loginButton = document.getElementById('loginButton') as HTMLButtonElement;

  // Toggle mostrar/ocultar contraseña
  togglePasswordBtn?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
  });

  // Mostrar modal de recuperación
  forgotPasswordBtn?.addEventListener('click', () => {
    showRecoveryModal();
  });

  // Submit del formulario
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validación básica de email (sin restricción de dominio)
    if (!email || !password) {
      showError('Por favor ingresa tu correo y contraseña');
      return;
    }

    // Deshabilitar botón
    loginButton.disabled = true;
    loginButton.textContent = 'Iniciando sesión...';
    hideError();

    try {
      await authService.login({ email, password });
      
      // Redirigir al home
      window.location.hash = '#inicio';
      window.location.reload();
      
    } catch (error: any) {
      showError(error.message);
      loginButton.disabled = false;
      loginButton.textContent = 'Iniciar Sesión';
    }
  });

  function showError(message: string) {
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
      errorMessage.querySelector('p')!.textContent = message;
    }
  }

  function hideError() {
    errorMessage?.classList.add('hidden');
  }
}

function showRecoveryModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800">Recuperar Contraseña</h3>
        <button id="closeRecoveryModal" class="p-2 hover:bg-gray-200 rounded-lg transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <p class="text-sm text-gray-600 mb-4">
        Ingresa tu correo institucional y te enviaremos instrucciones para recuperar tu contraseña.
      </p>

      <form id="recoveryForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Correo Institucional</label>
          <input 
            type="email" 
            id="recoveryEmail"
            required 
            placeholder="correo@utmach.edu.ec"
            class="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div id="recoveryMessage" class="hidden"></div>

        <div class="flex space-x-3">
          <button 
            type="submit" 
            class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Enviar
          </button>
          <button 
            type="button" 
            id="cancelRecovery"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  
  document.getElementById('closeRecoveryModal')?.addEventListener('click', closeModal);
  document.getElementById('cancelRecovery')?.addEventListener('click', closeModal);
  
  document.getElementById('recoveryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('recoveryEmail') as HTMLInputElement;
    const email = emailInput.value.trim();
    const messageDiv = document.getElementById('recoveryMessage')!;

    // Sin validación de dominio específico
    if (!email) {
      messageDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm';
      messageDiv.textContent = 'Por favor ingresa tu correo';
      messageDiv.classList.remove('hidden');
      return;
    }

    try {
      const result = await authService.requestPasswordRecovery(email);
      
      messageDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm';
      messageDiv.textContent = result.message;
      messageDiv.classList.remove('hidden');

      // SOLO PARA DESARROLLO - mostrar token
      if (result.devToken) {
        messageDiv.innerHTML += `<br><br><strong>Token de recuperación (solo desarrollo):</strong><br>
          <code class="bg-white px-2 py-1 rounded text-xs">${result.devToken}</code><br>
          <a href="#recovery?token=${result.devToken}" class="text-blue-600 underline text-xs">Ir a restablecer contraseña</a>`;
      }

      emailInput.disabled = true;
      
    } catch (error: any) {
      messageDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm';
      messageDiv.textContent = error.message;
      messageDiv.classList.remove('hidden');
    }
  });
}