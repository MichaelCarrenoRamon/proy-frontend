import { db } from '../services/database';
import type { Case } from '../types/Case';

export function renderCasesList(): string {
  return `
    <div class="space-y-6 pb-6">
      <!-- Header -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-xl">
        <h2 class="text-2xl font-bold text-gray-800">📊 Dashboard</h2>
        <p class="text-gray-600 text-sm">Vista general del Consultorio Jurídico Gratuito UTMACH</p>
      </div>

      <!-- Cards de estadísticas (compactas) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Casos -->
        <div class="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Casos</p>
              <p id="totalCases" class="text-3xl font-bold text-gray-800 mt-1">0</p>
              <p class="text-xs text-gray-500 mt-1">Todos los registros</p>
            </div>
            <div class="p-3 bg-blue-500 rounded-lg shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Casos Activos -->
        <div class="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Casos Activos</p>
              <p id="activeCases" class="text-3xl font-bold text-gray-800 mt-1">0</p>
              <p class="text-xs text-gray-500 mt-1">En proceso</p>
            </div>
            <div class="p-3 bg-green-500 rounded-lg shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Pendientes -->
        <div class="backdrop-blur-md bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pendientes</p>
              <p id="pendingCases" class="text-3xl font-bold text-gray-800 mt-1">0</p>
              <p class="text-xs text-gray-500 mt-1">Por atender</p>
            </div>
            <div class="p-3 bg-yellow-500 rounded-lg shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Finalizados -->
        <div class="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Finalizados</p>
              <p id="closedCases" class="text-3xl font-bold text-gray-800 mt-1">0</p>
              <p class="text-xs text-gray-500 mt-1">Completados</p>
            </div>
            <div class="p-3 bg-purple-500 rounded-lg shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Visualizaciones con barras de progreso -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Casos por Materia -->
        <div class="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/40 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">Casos por Materia</h3>
            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              Distribución
            </span>
          </div>
          <div id="materiasList" class="space-y-3 max-h-64 overflow-y-auto pr-2">
            <div class="text-center py-8 text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <span class="text-sm">Cargando datos...</span>
            </div>
          </div>
        </div>

        <!-- Estado de Casos -->
        <div class="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/40 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">Estado de Casos</h3>
            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Estado actual
            </span>
          </div>
          <div id="estadosList" class="space-y-3 max-h-64 overflow-y-auto pr-2">
            <div class="text-center py-8 text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <span class="text-sm">Cargando datos...</span>
            </div>
          </div>
        </div>

        <!-- Casos por Mes -->
        <div class="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/40 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">Casos por Mes (2025)</h3>
            <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              Tendencia
            </span>
          </div>
          <div id="mesesList" class="space-y-2 max-h-64 overflow-y-auto pr-2">
            <div class="text-center py-8 text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <span class="text-sm">Cargando datos...</span>
            </div>
          </div>
        </div>

        <!-- Estadísticas Generales -->
        <div class="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/40 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">Estadísticas</h3>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
              Resumen
            </span>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition">
              <span class="text-sm font-medium text-gray-700">Casos este mes</span>
              <span id="casesThisMonth" class="text-2xl font-bold text-blue-600">0</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition">
              <span class="text-sm font-medium text-gray-700">Promedio mensual</span>
              <span id="avgCasesPerMonth" class="text-2xl font-bold text-green-600">0</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition">
              <span class="text-sm font-medium text-gray-700">Satisfacción</span>
              <span id="satisfactionRate" class="text-2xl font-bold text-purple-600">95%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/40 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800">📝 Actividad Reciente</h3>
          <button id="refreshActivity" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Actualizar</span>
          </button>
        </div>
        <div id="actividadReciente" class="space-y-3 max-h-80 overflow-y-auto pr-2">
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Cargando actividad...</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function loadCasesList() {
  try {
    console.log('📊 Cargando dashboard...');
    
    // Cargar datos
    const cases = await db.getAllCases();
    console.log(`✅ ${cases.length} casos cargados`);
    
    // Actualizar estadísticas
    updateStats(cases);
    
    // Crear visualizaciones sin Chart.js
    createVisualizationsWithoutCharts(cases);
    
    // Cargar actividad reciente
    loadRecentActivity(cases);
    
    // Event listener para actualizar actividad
    document.getElementById('refreshActivity')?.addEventListener('click', () => {
      loadRecentActivity(cases);
    });
    
  } catch (error) {
    console.error('❌ Error al cargar dashboard:', error);
    showError();
  }
}

function updateStats(cases: Case[]) {
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.estado_actual?.toLowerCase().includes('activo')).length;
  const pendingCases = cases.filter(c => c.estado_actual?.toLowerCase().includes('pendiente')).length;
  const closedCases = cases.filter(c => 
    c.estado_actual?.toLowerCase().includes('finalizado') || 
    c.estado_actual?.toLowerCase().includes('cerrado')
  ).length;

  // Casos este mes
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const casesThisMonth = cases.filter(c => {
    if (!c.fecha) return false;
    const caseDate = new Date(c.fecha);
    return caseDate.getMonth() === currentMonth && caseDate.getFullYear() === currentYear;
  }).length;

  // Promedio mensual
  const monthsWithCases = new Set(cases.map(c => {
    if (!c.fecha) return null;
    const d = new Date(c.fecha);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }).filter(Boolean)).size;
  const avgPerMonth = monthsWithCases > 0 ? Math.round(totalCases / monthsWithCases) : 0;

  // Actualizar DOM
  document.getElementById('totalCases')!.textContent = totalCases.toString();
  document.getElementById('activeCases')!.textContent = activeCases.toString();
  document.getElementById('pendingCases')!.textContent = pendingCases.toString();
  document.getElementById('closedCases')!.textContent = closedCases.toString();
  document.getElementById('casesThisMonth')!.textContent = casesThisMonth.toString();
  document.getElementById('avgCasesPerMonth')!.textContent = avgPerMonth.toString();
}

function createVisualizationsWithoutCharts(cases: Case[]) {
  // Casos por Materia
  const materias = cases.reduce((acc, c) => {
    const materia = c.materia || 'Sin materia';
    acc[materia] = (acc[materia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const materiasContainer = document.getElementById('materiasList');
  if (materiasContainer) {
    if (Object.keys(materias).length === 0) {
      materiasContainer.innerHTML = '<p class="text-center py-8 text-gray-400 text-sm">No hay datos disponibles</p>';
    } else {
      const maxCases = Math.max(...Object.values(materias));
      materiasContainer.innerHTML = Object.entries(materias)
        .sort((a, b) => b[1] - a[1])
        .map(([materia, count]) => {
          const percentage = (count / maxCases) * 100;
          return `
            <div class="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">${materia}</span>
                <span class="text-sm font-bold text-blue-600">${count} caso${count !== 1 ? 's' : ''}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
              </div>
            </div>
          `;
        }).join('');
    }
  }

  // Estado de Casos
  const estados = cases.reduce((acc, c) => {
    const estado = c.estado_actual || 'Sin estado';
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const estadosContainer = document.getElementById('estadosList');
  if (estadosContainer) {
    if (Object.keys(estados).length === 0) {
      estadosContainer.innerHTML = '<p class="text-center py-8 text-gray-400 text-sm">No hay datos disponibles</p>';
    } else {
      const maxCases = Math.max(...Object.values(estados));
      estadosContainer.innerHTML = Object.entries(estados)
        .sort((a, b) => b[1] - a[1])
        .map(([estado, count]) => {
          const percentage = (count / maxCases) * 100;
          const color = getStatusBarColor(estado);
          return `
            <div class="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">${estado}</span>
                <span class="text-sm font-bold ${color.text}">${count} caso${count !== 1 ? 's' : ''}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div class="${color.bg} h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
              </div>
            </div>
          `;
        }).join('');
    }
  }

  // Casos por Mes
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const casosPorMes = new Array(12).fill(0);
  const currentYear = new Date().getFullYear();

  cases.forEach(c => {
    if (c.fecha) {
      const date = new Date(c.fecha);
      if (date.getFullYear() === currentYear) {
        const mes = date.getMonth();
        casosPorMes[mes]++;
      }
    }
  });

  const mesesContainer = document.getElementById('mesesList');
  if (mesesContainer) {
    const maxCases = Math.max(...casosPorMes);
    const hasData = maxCases > 0;
    
    if (!hasData) {
      mesesContainer.innerHTML = '<p class="text-center py-8 text-gray-400 text-sm">No hay casos registrados en 2025</p>';
    } else {
      mesesContainer.innerHTML = meses
        .map((mes, index) => {
          const count = casosPorMes[index];
          const percentage = (count / maxCases) * 100;
          return `
            <div class="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition ${count === 0 ? 'opacity-50' : ''}">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-700">${mes}</span>
                <span class="text-xs font-bold text-green-600">${count}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
              </div>
            </div>
          `;
        }).join('');
    }
  }
}

function getStatusBarColor(estado: string): { bg: string, text: string } {
  if (!estado) return { bg: 'bg-gray-500', text: 'text-gray-600' };
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('activo')) return { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-600' };
  if (estadoLower.includes('pendiente')) return { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'text-yellow-600' };
  if (estadoLower.includes('finalizado') || estadoLower.includes('cerrado')) return { bg: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'text-gray-600' };
  if (estadoLower.includes('proceso')) return { bg: 'bg-gradient-to-r from-blue-500 to-indigo-500', text: 'text-blue-600' };
  return { bg: 'bg-gradient-to-r from-indigo-500 to-purple-500', text: 'text-indigo-600' };
}

function loadRecentActivity(cases: Case[]) {
  const container = document.getElementById('actividadReciente');
  if (!container) return;

  // Ordenar por fecha más reciente
  const sortedCases = [...cases].sort((a, b) => {
    const dateA = new Date(a.fecha || 0).getTime();
    const dateB = new Date(b.fecha || 0).getTime();
    return dateB - dateA;
  });

  const recent = sortedCases.slice(0, 8);
  
  if (recent.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="text-gray-500 text-sm">No hay actividad reciente</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recent.map(c => `
    <div class="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200 cursor-pointer group">
      <div class="flex items-center space-x-3 flex-1">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
          ${c.nombres_y_apellidos_de_usuario.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-800 text-sm truncate group-hover:text-blue-600 transition">${c.nombres_y_apellidos_de_usuario}</p>
          <div class="flex items-center space-x-2 text-xs text-gray-600 mt-0.5">
            <span class="truncate">${c.materia || 'Sin materia'}</span>
            <span>•</span>
            <span>${formatDate(c.fecha)}</span>
          </div>
        </div>
      </div>
      <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.estado_actual)} whitespace-nowrap ml-2">
        ${c.estado_actual || 'Sin estado'}
      </span>
    </div>
  `).join('');
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatusColor(estado: string): string {
  if (!estado) return 'bg-gray-100 text-gray-700';
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('activo')) return 'bg-green-100 text-green-700';
  if (estadoLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-700';
  if (estadoLower.includes('finalizado') || estadoLower.includes('cerrado')) return 'bg-gray-100 text-gray-700';
  if (estadoLower.includes('proceso')) return 'bg-blue-100 text-blue-700';
  return 'bg-indigo-100 text-indigo-700';
}

function showError() {
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = `
      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <svg class="w-20 h-20 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Error al cargar el dashboard</h3>
          <p class="text-gray-600 mb-4">No se pudo conectar con el servidor</p>
          <button onclick="window.location.reload()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Reintentar
          </button>
        </div>
      </div>
    `;
  }
}