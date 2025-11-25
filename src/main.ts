import './style.css'
import { db } from './services/database';
import { authService } from './services/auth';
import { router } from './router/Router';
import { renderNavbar, initNavbar } from './components/Navbar';
import { renderHome, loadHomeData } from './components/Home';
import { renderCasesList, loadCasesList } from './components/caseList';
import { renderClients, loadClients } from './components/Clients';
import { renderLogin, initLogin } from './components/Login';
import { renderResetPassword, initResetPassword } from './components/ResetPassword';
import { renderPublicSurvey, initPublicSurvey } from './components/PublicSurvey';
import { toast } from './components/toast';

async function init() {
  const app = document.querySelector<HTMLDivElement>('#app')!;

  // ============================================
  // 1. DETECTAR RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
  // ============================================
  const fullHash = window.location.hash;
  const hashRoute = fullHash.split('?')[0];
  
  console.log('🔍 Inicializando app - Ruta detectada:', hashRoute);
  
  // RUTA PÚBLICA: Encuesta de Satisfacción
  if (hashRoute === '#encuesta') {
    console.log('✅ Ruta pública de encuesta - Cargando sin autenticación');
    
    // Renderizar encuesta pública
    app.innerHTML = renderPublicSurvey();
    initPublicSurvey();
    
    // ⚠️ IMPORTANTE: Salir aquí para NO ejecutar código de autenticación
    return;
  }

  // RUTA PÚBLICA: Recuperación de Contraseña
  if (hashRoute === '#recovery' || fullHash.startsWith('#recovery')) {
    console.log('✅ Ruta de recuperación - Cargando sin autenticación');
    app.innerHTML = renderResetPassword();
    initResetPassword();
    return;
  }

  // ============================================
  // 2. RUTAS PRIVADAS - VERIFICAR AUTENTICACIÓN
  // ============================================
  console.log('🔐 Verificando autenticación para rutas privadas...');
  
  const isAuthenticated = authService.isAuthenticated();
  const isTokenValid = isAuthenticated ? await authService.verifyToken() : false;

  if (!isAuthenticated || !isTokenValid) {
    console.log('❌ No autenticado - Redirigiendo a login');
    
    if (isAuthenticated && !isTokenValid) {
      authService.logout();
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    // Si no está en login, redirigir
    if (hashRoute !== '#login' && hashRoute !== '') {
      window.location.hash = '#login';
    }
    
    app.innerHTML = renderLogin();
    initLogin();
    return;
  }

  console.log('✅ Usuario autenticado - Cargando aplicación principal');

  // ============================================
  // 3. USUARIO AUTENTICADO - CARGAR APP PRINCIPAL
  // ============================================
  await db.init();
  
  const user = authService.getUser();
  
  app.innerHTML = `
    ${renderNavbar()}
    <main class="pt-24 pb-12 px-4 min-h-screen">
      <div class="container mx-auto max-w-7xl mb-4">
        <div class="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40 shadow-lg flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm">${user?.nombre_completo.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">${user?.nombre_completo}</p>
              <p class="text-xs text-gray-600">${user?.email}</p>
            </div>
          </div>
          <button id="logoutBtn" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
      
      <div id="content" class="container mx-auto max-w-7xl"></div>
    </main>
  `;

  // ============================================
  // 4. MODAL DE OPCIONES DE CASO
  // ============================================
  function showCaseOptions() {
    document.getElementById('caseOptionsModal')?.remove();
    
    const modal = document.createElement('div');
    modal.id = 'caseOptionsModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    `;
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" style="position: relative; z-index: 10000;" onclick="event.stopPropagation()">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Agregar Caso</h2>
        
        <div class="space-y-4">
          <button type="button" id="newClientBtn" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 cursor-pointer">
            <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <span class="pointer-events-none">Nuevo Cliente</span>
          </button>
  
          <button type="button" id="existingClientBtn" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 cursor-pointer">
            <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="pointer-events-none">Cliente Existente</span>
          </button>
  
          <button type="button" id="cancelOptions" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    setTimeout(() => {
      const newClientBtn = document.getElementById('newClientBtn');
      if (newClientBtn) {
        newClientBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          modal.remove();
          
          setTimeout(() => {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'caseFormModal';
            document.body.appendChild(modalContainer);
            
            import('./components/CaseForm').then(({ renderCaseForm, initCaseForm }) => {
              modalContainer.innerHTML = renderCaseForm();
              initCaseForm();
            });
          }, 200);
        };
      }
  
      const existingClientBtn = document.getElementById('existingClientBtn');
      if (existingClientBtn) {
        existingClientBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          modal.remove();
          
          setTimeout(() => {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'existingClientModal';
            document.body.appendChild(modalContainer);
            
            import('./components/ExistingClientForm').then(({ renderExistingClientSearch, initExistingClientSearch }) => {
              modalContainer.innerHTML = renderExistingClientSearch();
              initExistingClientSearch();
            });
          }, 200);
        };
      }
  
      const cancelBtn = document.getElementById('cancelOptions');
      if (cancelBtn) {
        cancelBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          modal.remove();
        };
      }
  
      modal.onclick = function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      };
    }, 50);
  }

  // ============================================
  // 5. LOGOUT
  // ============================================
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    const confirmed = await toast.confirm(
      '¿Estás seguro de cerrar sesión?',
      'Cerrar Sesión'
    );
    
    if (confirmed) {
      toast.info('Cerrando sesión...');
      authService.logout();
      
      app.innerHTML = '';
      
      setTimeout(() => {
        window.location.hash = '#login';
        window.location.reload();
      }, 100);
    }
  });

  // ============================================
  // 6. INICIALIZAR ROUTER
  // ============================================
  initNavbar();
  router.init();
  
  router.onRouteChange(async (route) => {
    const content = document.getElementById('content')!;
    
    switch(route) {
      case 'inicio':
        content.innerHTML = renderHome();
        await loadHomeData();
        break;
      
      case 'casos':
        content.innerHTML = renderCasesList();
        await loadCasesList();
          
        document.getElementById('btnNewCase')?.addEventListener('click', () => {
          showCaseOptions();
        });
        break;
      
      case 'clientes':
        content.innerHTML = renderClients();
        await loadClients();
        break;
    }
  });
  
  // Cargar ruta inicial
  const currentRoute = router.getCurrentRoute();
  const content = document.getElementById('content')!;
  
  if (currentRoute === 'inicio') {
    content.innerHTML = renderHome();
    await loadHomeData();
  } else if (currentRoute === 'casos') {
    content.innerHTML = renderCasesList();
    await loadCasesList();
  } else if (currentRoute === 'clientes') {
    content.innerHTML = renderClients();
    await loadClients();
  }
}

// ============================================
// INICIALIZAR APLICACIÓN
// ============================================
init();