// Tipos de rutas
export type PrivateRoute = 'inicio' | 'casos' | 'clientes';
export type PublicRoute = 'encuesta';
export type Route = PrivateRoute | PublicRoute;

export class Router {
  private currentRoute: Route = 'inicio';
  private listeners: Array<(route: Route) => void> = [];

  /**
   * Verifica si la ruta actual es pública (no requiere autenticación)
   */
  isPublicRoute(route: string): route is PublicRoute {
    return route === 'encuesta';
  }

  /**
   * Verifica si la ruta actual es privada (requiere autenticación)
   */
  isPrivateRoute(route: string): route is PrivateRoute {
    return ['inicio', 'casos', 'clientes'].includes(route);
  }

  /**
   * Navega a una ruta específica
   */
  navigate(route: Route) {
    this.currentRoute = route;
    this.listeners.forEach(listener => listener(route));
    
    // Actualizar URL sin recargar
    if (this.isPublicRoute(route)) {
      // Para rutas públicas, mantener los query params
      const urlParams = new URLSearchParams(window.location.search);
      const queryString = urlParams.toString();
      window.history.pushState({}, '', `/${route}${queryString ? '?' + queryString : ''}`);
    } else {
      // Para rutas privadas, usar hash routing
      window.history.pushState({}, '', `#${route}`);
    }
  }

  /**
   * Registra un listener para cambios de ruta
   */
  onRouteChange(listener: (route: Route) => void) {
    this.listeners.push(listener);
  }

  /**
   * Obtiene la ruta actual desde la URL
   */
  getCurrentRoute(): Route {
    const pathname = window.location.pathname;
    
    // Verificar si es una ruta pública (pathname-based)
    if (pathname === '/encuesta') {
      return 'encuesta';
    }
    
    // Si no es ruta pública, usar hash routing (rutas privadas)
    const hash = window.location.hash.slice(1) as Route;
    
    if (this.isPrivateRoute(hash)) {
      return hash;
    }
    
    return 'inicio';
  }

  /**
   * Verifica si hay parámetros de query en la URL
   */
  getQueryParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  /**
   * Inicializa el router
   */
  init() {
    // Cargar ruta inicial desde URL
    this.currentRoute = this.getCurrentRoute();
    
    console.log('🚀 Router inicializado:', {
      ruta: this.currentRoute,
      pathname: window.location.pathname,
      hash: window.location.hash,
      esPublica: this.isPublicRoute(this.currentRoute)
    });

    // Escuchar cambios en el navegador (back/forward)
    window.addEventListener('popstate', () => {
      const previousRoute = this.currentRoute;
      this.currentRoute = this.getCurrentRoute();
      
      console.log('↩️ Navegación del navegador:', {
        desde: previousRoute,
        hacia: this.currentRoute
      });
      
      this.listeners.forEach(listener => listener(this.currentRoute));
    });

    // Escuchar cambios de hash para rutas privadas
    window.addEventListener('hashchange', () => {
      if (!this.isPublicRoute(this.currentRoute)) {
        const newRoute = this.getCurrentRoute();
        if (newRoute !== this.currentRoute) {
          this.currentRoute = newRoute;
          this.listeners.forEach(listener => listener(this.currentRoute));
        }
      }
    });
  }

  /**
   * Obtiene información de contexto de la ruta actual
   */
  getRouteContext() {
    return {
      route: this.currentRoute,
      isPublic: this.isPublicRoute(this.currentRoute),
      isPrivate: this.isPrivateRoute(this.currentRoute),
      queryParams: Object.fromEntries(this.getQueryParams()),
      pathname: window.location.pathname,
      hash: window.location.hash
    };
  }
}

export const router = new Router();