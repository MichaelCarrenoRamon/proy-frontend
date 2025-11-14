import { db } from '../services/database';
import type { Case } from '../types/Case';

let allCasesCache: Case[] = [];
let currentFilters = {
  estado: 'todos',
  materia: 'todas',
  busqueda: ''
};

export function renderCasesList(): string {
  return `
    <div class="space-y-6 pb-6">
      <!-- Header con botones -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">📁 Gestión de Casos</h2>
            <p class="text-gray-600 text-sm">Administra todos los casos judiciales</p>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button id="btnNewClient" 
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 
                   text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 
                   transform hover:scale-105 flex items-center justify-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <span>Nuevo Usuario</span>
          </button>

          <button id="btnExistingClient" 
            class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 
                   text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 
                   transform hover:scale-105 flex items-center justify-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>Usuario Existente</span>
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Búsqueda -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div class="relative">
              <input 
                type="text" 
                id="searchInput"
                placeholder="Buscar por nombre, cédula o expediente..."
                class="w-full px-4 py-2 pl-10 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Filtro por Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select id="filterEstado" class="w-full px-4 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="pendiente">Pendientes</option>
              <option value="finalizado">Finalizados</option>
              <option value="cerrado">Cerrados</option>
            </select>
          </div>

          <!-- Filtro por Materia -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Materia</label>
            <select id="filterMateria" class="w-full px-4 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="todas">Todas</option>
            </select>
          </div>
        </div>

        <!-- Botón limpiar filtros -->
        <div class="mt-4 flex items-center justify-between">
          <div id="filterStats" class="text-sm text-gray-600"></div>
          <button id="clearFilters" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Tabla de casos -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cédula</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nro. Proceso</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Materia</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody id="casesTableBody" class="divide-y divide-white/20">
              <tr>
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <span class="ml-3 text-gray-600">Cargando casos...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export async function loadCasesList() {
  try {
    allCasesCache = await db.getAllCases();
    
    // Llenar select de materias
    populateMateriaFilter();
    
    // Aplicar filtros iniciales
    applyFilters();
    
    // Configurar event listeners
    setupFilterListeners();
    
    // ✅ Event listeners para botones de acción
    setupActionButtons();
    
  } catch (error) {
    console.error('Error al cargar casos:', error);
    const tbody = document.getElementById('casesTableBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-12 text-center text-red-500">
            Error al cargar los casos. Verifica la conexión con el backend.
          </td>
        </tr>
      `;
    }
  }
}

// ✅ NUEVA FUNCIÓN: Configurar botones de acción
function setupActionButtons() {
  const btnNewClient = document.getElementById('btnNewClient');
  const btnExistingClient = document.getElementById('btnExistingClient');

  if (btnNewClient) {
    btnNewClient.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('✅ Click en Nuevo Cliente');
      
      const modalContainer = document.createElement('div');
      modalContainer.id = 'caseFormModal';
      document.body.appendChild(modalContainer);
      
      import('./CaseForm').then(({ renderCaseForm, initCaseForm }) => {
        modalContainer.innerHTML = renderCaseForm();
        initCaseForm();
      });
    };
  }

  if (btnExistingClient) {
    btnExistingClient.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('✅ Click en Cliente Existente');
      
      const modalContainer = document.createElement('div');
      modalContainer.id = 'existingClientModal';
      document.body.appendChild(modalContainer);
      
      import('./ExistingClientForm').then(({ renderExistingClientSearch, initExistingClientSearch }) => {
        modalContainer.innerHTML = renderExistingClientSearch();
        initExistingClientSearch();
      });
    };
  }
}

function populateMateriaFilter() {
  const materiaSelect = document.getElementById('filterMateria') as HTMLSelectElement;
  if (!materiaSelect) return;

  // Obtener materias únicas
  const materias = [...new Set(allCasesCache.map(c => c.materia).filter(m => m))];
  materias.sort();

  materiaSelect.innerHTML = '<option value="todas">Todas</option>';
  materias.forEach(materia => {
    const option = document.createElement('option');
    option.value = materia;
    option.textContent = materia;
    materiaSelect.appendChild(option);
  });
}

function setupFilterListeners() {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const filterEstado = document.getElementById('filterEstado') as HTMLSelectElement;
  const filterMateria = document.getElementById('filterMateria') as HTMLSelectElement;
  const clearBtn = document.getElementById('clearFilters');

  searchInput?.addEventListener('input', (e) => {
    currentFilters.busqueda = (e.target as HTMLInputElement).value.toLowerCase();
    applyFilters();
  });

  filterEstado?.addEventListener('change', (e) => {
    currentFilters.estado = (e.target as HTMLSelectElement).value;
    applyFilters();
  });

  filterMateria?.addEventListener('change', (e) => {
    currentFilters.materia = (e.target as HTMLSelectElement).value;
    applyFilters();
  });

  clearBtn?.addEventListener('click', () => {
    currentFilters = { estado: 'todos', materia: 'todas', busqueda: '' };
    searchInput.value = '';
    filterEstado.value = 'todos';
    filterMateria.value = 'todas';
    applyFilters();
  });
}

function applyFilters() {
  let filtered = [...allCasesCache];

  // Filtro por búsqueda
  if (currentFilters.busqueda) {
    filtered = filtered.filter(c => 
      c.nombres_y_apellidos_de_usuario.toLowerCase().includes(currentFilters.busqueda) ||
      c.nro_de_cedula_usuario.includes(currentFilters.busqueda) ||
      c.nro_proceso_judicial_expediente.toLowerCase().includes(currentFilters.busqueda)
    );
  }

  // Filtro por estado
  if (currentFilters.estado !== 'todos') {
    filtered = filtered.filter(c => 
      c.estado_actual?.toLowerCase().includes(currentFilters.estado)
    );
  }

  // Filtro por materia
  if (currentFilters.materia !== 'todas') {
    filtered = filtered.filter(c => c.materia === currentFilters.materia);
  }

  // Actualizar estadísticas
  updateFilterStats(filtered.length, allCasesCache.length);

  // Renderizar tabla
  renderTable(filtered);
}

function updateFilterStats(filtered: number, total: number) {
  const statsDiv = document.getElementById('filterStats');
  if (statsDiv) {
    statsDiv.textContent = `Mostrando ${filtered} de ${total} casos`;
  }
}

function renderTable(cases: Case[]) {
  const tbody = document.getElementById('casesTableBody');
  if (!tbody) return;

  if (cases.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-12 text-center text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg font-medium">No se encontraron casos</p>
          <p class="text-sm">Intenta cambiar los filtros de búsqueda</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = cases.map(caso => `
    <tr class="hover:bg-white/20 transition-colors duration-200 cursor-pointer" data-cedula="${caso.nro_de_cedula_usuario}">
      <td class="px-6 py-4">
        <div class="font-medium text-gray-800">${caso.nombres_y_apellidos_de_usuario}</div>
        <div class="text-sm text-gray-600">${caso.telefono || 'N/A'}</div>
      </td>
      <td class="px-6 py-4 text-gray-700">${caso.nro_de_cedula_usuario}</td>
      <td class="px-6 py-4 text-gray-700">${caso.nro_proceso_judicial_expediente}</td>
      <td class="px-6 py-4">
        <span class="text-sm text-gray-700">${caso.materia}</span>
      </td>
      <td class="px-6 py-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caso.estado_actual)}">
          ${caso.estado_actual}
        </span>
      </td>
    </tr>
  `).join('');

  // ✅ AGREGAR EVENT LISTENERS A LAS FILAS
  setupRowClickListeners(cases);
}

// ✅ NUEVA FUNCIÓN: Configurar clicks en las filas
function setupRowClickListeners(cases: Case[]) {
  const rows = document.querySelectorAll('#casesTableBody tr[data-cedula]');
  
  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      const cedula = (row as HTMLElement).dataset.cedula;
      const client = cases.find(c => c.nro_de_cedula_usuario === cedula);
      
      if (client) {
        openActivityForm(client);
      }
    });
  });
}

// ✅ NUEVA FUNCIÓN: Abrir formulario de actividad
function openActivityForm(client: Case) {
  console.log('✅ Abriendo formulario para cliente:', client.nombres_y_apellidos_de_usuario);
  
  // Importar dinámicamente el módulo de actividades
  import('./ExistingClientForm').then(({ showAddActivityForm }) => {
    showAddActivityForm(client);
  }).catch(error => {
    console.error('Error al cargar el formulario:', error);
    alert('Error al abrir el formulario de actividades');
  });
}

function getStatusColor(estado: string): string {
  if (!estado) return 'bg-gray-100 text-gray-800';
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('activo')) return 'bg-green-100 text-green-800';
  if (estadoLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
  if (estadoLower.includes('finalizado') || estadoLower.includes('cerrado')) return 'bg-gray-100 text-gray-800';
  return 'bg-blue-100 text-blue-800';
}

(window as any).editCase = async (cedula: string) => {
  alert(`Editar caso Cédula: ${cedula}`);
};

(window as any).deleteCase = async (cedula: string) => {
  if (!confirm('¿Estás seguro de eliminar este caso?')) return;
  
  try {
    await db.deleteCase(cedula);
    alert('Caso eliminado exitosamente');
    loadCasesList();
  } catch (error) {
    alert('Error al eliminar el caso');
  }
};