import type { Case } from '../types/Case';
import { db } from '../services/database';
import { apiService } from '../services/apiService';

export function renderHome(): string {
  return `
    <div class="space-y-6 pb-6">
      <!-- Welcome Section (más compacta) -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-1">🏛️ Bienvenido al Sistema</h2>
            <p class="text-sm text-gray-600">Gestión integral de casos jurídicos UTMACH</p>
          </div>
          <div class="hidden md:block">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid - Casos (COMPACTOS) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Casos -->
        <div class="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 mb-1">Total Casos</div>
              <div id="totalCases" class="text-3xl font-bold text-gray-800">0</div>
            </div>
            <div class="bg-blue-500 p-3 rounded-lg shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Activos -->
        <div class="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 mb-1">Casos Activos</div>
              <div id="activeCases" class="text-3xl font-bold text-gray-800">0</div>
            </div>
            <div class="bg-green-500 p-3 rounded-lg shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Pendientes -->
        <div class="backdrop-blur-md bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 mb-1">Pendientes</div>
              <div id="pendingCases" class="text-3xl font-bold text-gray-800">0</div>
            </div>
            <div class="bg-yellow-500 p-3 rounded-lg shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Finalizados -->
        <div class="backdrop-blur-md bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-600 mb-1">Finalizados</div>
              <div id="closedCases" class="text-3xl font-bold text-gray-800">0</div>
            </div>
            <div class="bg-gray-500 p-3 rounded-lg shadow-lg flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas de Satisfacción (más compacta) -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/40 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Encuestas de Satisfacción
        </h3>

        <!-- Stats adicionales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-3 text-center border border-green-300">
            <div class="text-2xl font-bold text-green-700" id="totalEncuestas">0</div>
            <div class="text-xs text-gray-700 font-medium">Total Encuestas</div>
          </div>
          <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-3 text-center border border-blue-300">
            <div class="text-2xl font-bold text-blue-700" id="volveriaUsar">0%</div>
            <div class="text-xs text-gray-700 font-medium">Volvería a Usar</div>
          </div>
          <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-3 text-center border border-purple-300">
            <div class="text-2xl font-bold text-purple-700" id="medioMasComun">-</div>
            <div class="text-xs text-gray-700 font-medium">Medio Más Común</div>
          </div>
        </div>

        <!-- Gráficos de encuestas (altura fija) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <!-- Chart 1: Información Recibida -->
          <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <h4 class="text-xs font-semibold text-gray-700 mb-2 text-center">Información Recibida</h4>
            <div class="h-40 flex items-center justify-center">
              <canvas id="chartInformacion"></canvas>
            </div>
          </div>

          <!-- Chart 2: Orientación Brindada -->
          <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <h4 class="text-xs font-semibold text-gray-700 mb-2 text-center">Orientación Brindada</h4>
            <div class="h-40 flex items-center justify-center">
              <canvas id="chartOrientacion"></canvas>
            </div>
          </div>

          <!-- Chart 3: Nivel de Satisfacción -->
          <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <h4 class="text-xs font-semibold text-gray-700 mb-2 text-center">Nivel de Satisfacción</h4>
            <div class="h-40 flex items-center justify-center">
              <canvas id="chartSatisfaccion"></canvas>
            </div>
          </div>
        </div>

        <!-- Gráfico de Medios de Conocimiento (altura fija) -->
        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">¿Cómo se enteraron de nuestros servicios?</h4>
          <div class="h-56 flex items-center justify-center">
            <canvas id="chartMedios"></canvas>
          </div>
        </div>
      </div>

      <!-- Calendar Container -->
      <div id="calendarContainer">
        <!-- Se llenará con el componente Calendar.ts -->
      </div>
    </div>
  `;
}

export async function loadHomeData() {
  try {
    const cases = await db.getAllCases();
    
    // Actualizar estadísticas de casos
    updateStats(cases);
    
    // Cargar estadísticas de encuestas
    await loadSurveyStats();
    
    // Cargar calendario interactivo
    const { renderCalendar, initCalendar } = await import('./Calendar');
    const container = document.getElementById('calendarContainer');
    if (container) {
      container.innerHTML = renderCalendar();
      await initCalendar();
    }
    
  } catch (error) {
    console.error('Error cargando datos del inicio:', error);
  }
}

function updateStats(cases: Case[]) {
  const total = cases.length;
  const activos = cases.filter(c => c.estado_actual?.toLowerCase().includes('activo')).length;
  const pendientes = cases.filter(c => c.estado_actual?.toLowerCase().includes('pendiente')).length;
  const finalizados = cases.filter(c => 
    c.estado_actual?.toLowerCase().includes('finalizado') || 
    c.estado_actual?.toLowerCase().includes('cerrado')
  ).length;

  document.getElementById('totalCases')!.textContent = total.toString();
  document.getElementById('activeCases')!.textContent = activos.toString();
  document.getElementById('pendingCases')!.textContent = pendientes.toString();
  document.getElementById('closedCases')!.textContent = finalizados.toString();
}

async function loadSurveyStats() {
  try {
    // ✅ Usar apiService en lugar de fetch
    const stats = await apiService.get('/api/encuestas/stats');
    
    console.log('📊 Estadísticas recibidas:', stats);
    
    if (stats.length === 0) {
      // No hay encuestas aún
      document.getElementById('totalEncuestas')!.textContent = '0';
      document.getElementById('volveriaUsar')!.textContent = '0%';
      document.getElementById('medioMasComun')!.textContent = 'N/A';
      return;
    }
    
    // El primer elemento tiene los totales
    const firstRow = stats[0];
    const total = parseInt(firstRow.total) || 0;
    const volveriaUsar = parseInt(firstRow.volveria_usar) || 0;
    const porcentajeVolveria = total > 0 ? Math.round((volveriaUsar / total) * 100) : 0;
    
    document.getElementById('totalEncuestas')!.textContent = total.toString();
    document.getElementById('volveriaUsar')!.textContent = `${porcentajeVolveria}%`;
    
    // Medio más común
    const medios = stats.filter((s: any) => s.medio_conocimiento);
    if (medios.length > 0) {
      const medioMasComun = medios.reduce((prev: any, current: any) => 
        (parseInt(current.count_medio) > parseInt(prev.count_medio)) ? current : prev
      );
      document.getElementById('medioMasComun')!.textContent = traducirMedio(medioMasComun.medio_conocimiento);
    } else {
      document.getElementById('medioMasComun')!.textContent = 'N/A';
    }
    
    // Renderizar gráficos
    renderCharts(stats);
    
  } catch (error) {
    console.error('❌ Error al cargar estadísticas de encuestas:', error);
    document.getElementById('totalEncuestas')!.textContent = '0';
    document.getElementById('volveriaUsar')!.textContent = '0%';
    document.getElementById('medioMasComun')!.textContent = 'Error';
  }
}

function traducirMedio(medio: string): string {
  const traducciones: any = {
    'familiar': 'Familiar',
    'amigo': 'Amigo',
    'periodico': 'Periódico',
    'radio': 'Radio',
    'pagina_web': 'Página Web',
    'redes_sociales': 'Redes Sociales'
  };
  return traducciones[medio] || medio;
}

function renderCharts(stats: any[]) {
  const firstRow = stats[0];
  
  // Configuración común para gráficos más compactos
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'bottom' as const, 
        labels: { 
          font: { size: 10 },
          boxWidth: 10,
          padding: 8
        } 
      }
    }
  };
  
  // Chart 1: Información Recibida
  const ctxInfo = (document.getElementById('chartInformacion') as HTMLCanvasElement)?.getContext('2d');
  if (ctxInfo) {
    new (window as any).Chart(ctxInfo, {
      type: 'doughnut',
      data: {
        labels: ['Excelente', 'Buena', 'Deficiente'],
        datasets: [{
          data: [
            parseInt(firstRow.info_excelente) || 0,
            parseInt(firstRow.info_buena) || 0,
            parseInt(firstRow.info_deficiente) || 0
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        ...commonOptions,
        cutout: '60%'
      }
    });
  }
  
  // Chart 2: Orientación Brindada
  const ctxOrient = (document.getElementById('chartOrientacion') as HTMLCanvasElement)?.getContext('2d');
  if (ctxOrient) {
    new (window as any).Chart(ctxOrient, {
      type: 'doughnut',
      data: {
        labels: ['Excelente', 'Buena', 'Deficiente'],
        datasets: [{
          data: [
            parseInt(firstRow.orient_excelente) || 0,
            parseInt(firstRow.orient_buena) || 0,
            parseInt(firstRow.orient_deficiente) || 0
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        ...commonOptions,
        cutout: '60%'
      }
    });
  }
  
  // Chart 3: Nivel de Satisfacción
  const ctxSatisf = (document.getElementById('chartSatisfaccion') as HTMLCanvasElement)?.getContext('2d');
  if (ctxSatisf) {
    new (window as any).Chart(ctxSatisf, {
      type: 'doughnut',
      data: {
        labels: ['Excelente', 'Buena', 'Deficiente'],
        datasets: [{
          data: [
            parseInt(firstRow.satisf_excelente) || 0,
            parseInt(firstRow.satisf_buena) || 0,
            parseInt(firstRow.satisf_deficiente) || 0
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        ...commonOptions,
        cutout: '60%'
      }
    });
  }
  
  // Chart 4: Medios de Conocimiento
  const medios = stats.filter(s => s.medio_conocimiento);
  const ctxMedios = (document.getElementById('chartMedios') as HTMLCanvasElement)?.getContext('2d');
  if (ctxMedios && medios.length > 0) {
    new (window as any).Chart(ctxMedios, {
      type: 'bar',
      data: {
        labels: medios.map((m: any) => traducirMedio(m.medio_conocimiento)),
        datasets: [{
          label: 'Cantidad',
          data: medios.map((m: any) => parseInt(m.count_medio)),
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#ec4899',
            '#f59e0b',
            '#10b981',
            '#06b6d4'
          ],
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              stepSize: 1,
              font: { size: 10 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 10 }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}