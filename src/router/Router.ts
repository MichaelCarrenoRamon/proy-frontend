// Exportar el tipo Route
export type Route = 'inicio' | 'casos' | 'clientes';

export class Router {
  private currentRoute: Route = 'inicio';
  private listeners: Array<(route: Route) => void> = [];

  navigate(route: Route) {
    this.currentRoute = route;
    this.listeners.forEach(listener => listener(route));
    
    // Actualizar URL sin recargar
    window.history.pushState({}, '', `#${route}`);
  }

  onRouteChange(listener: (route: Route) => void) {
    this.listeners.push(listener);
  }

  getCurrentRoute(): Route {
    const hash = window.location.hash.slice(1) as Route;
    return ['inicio', 'casos', 'clientes'].includes(hash) ? hash : 'inicio';
  }

  init() {
    // Cargar ruta inicial desde URL
    this.currentRoute = this.getCurrentRoute();
    
    // Escuchar cambios en el navegador (back/forward)
    window.addEventListener('popstate', () => {
      this.currentRoute = this.getCurrentRoute();
      this.listeners.forEach(listener => listener(this.currentRoute));
    });
  }
}

export const router = new Router();