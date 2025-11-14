import { router, Route } from '../router/Router';

export function renderNavbar(): string {
  return `
    <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Consultorio Jurídico</h1>
              <p class="text-xs text-gray-600">UTMACH</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-1">
            <button data-route="inicio" class="nav-link px-6 py-2.5 rounded-lg font-medium transition-all duration-300">
              <span class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Inicio</span>
              </span>
            </button>
            <button data-route="casos" class="nav-link px-6 py-2.5 rounded-lg font-medium transition-all duration-300">
              <span class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Casos</span>
              </span>
            </button>
            <button data-route="clientes" class="nav-link px-6 py-2.5 rounded-lg font-medium transition-all duration-300">
              <span class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Usuarios</span>
              </span>
            </button>
          </nav>

          <!-- Mobile Menu Button -->
          <button id="mobileMenuBtn" class="md:hidden p-2 rounded-lg hover:bg-white/20 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function initNavbar() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Actualizar enlaces activos
  const updateActiveLink = (route: Route) => {
    navLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'shadow-lg');
        link.classList.remove('text-gray-700', 'hover:bg-white/20');
      } else {
        link.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'shadow-lg');
        link.classList.add('text-gray-700', 'hover:bg-white/20');
      }
    });
  };

  // Event listeners
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const route = link.getAttribute('data-route') as Route;
      router.navigate(route);
    });
  });

  // Actualizar en cambio de ruta
  router.onRouteChange(updateActiveLink);
  
  // Inicializar estado actual
  updateActiveLink(router.getCurrentRoute());
}