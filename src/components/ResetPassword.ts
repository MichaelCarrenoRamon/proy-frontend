import { authService } from '../services/auth';

export function renderResetPassword(): string {
  return `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="backdrop-blur-md bg-white/40 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/60">
        <div class="text-center mb-8">
          <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Restablecer Contraseña</h1>
          <p class="text-gray-600 text-sm">Ingresa tu nueva contraseña</p>
        </div>

        <form id="resetForm" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
            <input 
              type="password" 
              id="newPassword"
              required 
              minlength="6"
              placeholder="Mínimo 6 caracteres"
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword"
              required 
              minlength="6"
              placeholder="Repite la contraseña"
              class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div id="resetMessage" class="hidden"></div>

          <button 
            type="submit" 
            id="resetButton"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition"
          >
            Restablecer Contraseña
          </button>

          <div class="text-center">
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initResetPassword() {
  const form = document.getElementById('resetForm') as HTMLFormElement;
  const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
  const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
  const messageDiv = document.getElementById('resetMessage')!;
  const resetButton = document.getElementById('resetButton') as HTMLButtonElement;

  // Obtener token de la URL
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const token = urlParams.get('token');

  if (!token) {
    messageDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm';
    messageDiv.textContent = 'Token no válido. Solicita un nuevo enlace de recuperación.';
    messageDiv.classList.remove('hidden');
    resetButton.disabled = true;
    return;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
      messageDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm';
      messageDiv.textContent = 'Las contraseñas no coinciden';
      messageDiv.classList.remove('hidden');
      return;
    }

    resetButton.disabled = true;
    resetButton.textContent = 'Restableciendo...';

    try {
      await authService.resetPassword(token, newPassword);

      messageDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm';
      messageDiv.textContent = 'Contraseña actualizada exitosamente. Redirigiendo...';
      messageDiv.classList.remove('hidden');

      setTimeout(() => {
        window.location.hash = '#';
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      messageDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm';
      messageDiv.textContent = error.message;
      messageDiv.classList.remove('hidden');
      resetButton.disabled = false;
      resetButton.textContent = 'Restablecer Contraseña';
    }
  });
}