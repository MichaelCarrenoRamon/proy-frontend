import { db } from '../services/database';
import type { Case } from '../types/Case';

let allClientsCache: Case[] = [];
let currentPage = 1;
let itemsPerPage = 20;
let currentLetter = 'todas';
let searchQuery = '';

export function renderClients(): string {
  const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  
  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-xl">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Directorio de Usuarios</h2>
        <p class="text-gray-600 text-sm">Lista completa de todos los usuarios registrados</p>
      </div>

      <!-- Buscador y filtros -->
      <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-xl space-y-4">
        <!-- Búsqueda -->
        <div class="relative">
          <input 
            type="text" 
            id="searchClients" 
            placeholder="Buscar por nombre o cédula..."
            class="w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- Filtro alfabético -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Filtrar por inicial</label>
          <div class="flex flex-wrap gap-2">
            <button 
              data-letter="todas" 
              class="letter-btn px-3 py-1.5 rounded-lg font-semibold text-sm transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            >
              Todas
            </button>
            ${alphabet.map(letter => `
              <button 
                data-letter="${letter}" 
                class="letter-btn px-3 py-1.5 bg-white/70 hover:bg-white text-gray-700 rounded-lg font-semibold text-sm transition hover:shadow-md"
              >
                ${letter}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Selector de items por página -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700">Mostrar:</label>
            <select id="itemsPerPage" class="px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-600">clientes por página</span>
          </div>
          <div id="clientStats" class="text-sm text-gray-600"></div>
        </div>
      </div>

      <!-- Grid de clientes -->
      <div id="clientsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Se llenará dinámicamente -->
      </div>

      <!-- Paginación -->
      <div id="pagination" class="backdrop-blur-md bg-white/30 rounded-2xl p-4 border border-white/40 shadow-xl">
        <!-- Se llenará dinámicamente -->
      </div>
    </div>
  `;
}

export async function loadClients() {
  try {
    allClientsCache = await db.getAllCases();
    
    // Configurar event listeners
    setupClientListeners();
    
    // Mostrar clientes
    applyClientFilters();
    
  } catch (error) {
    console.error('Error al cargar clientes:', error);
  }
}

function setupClientListeners() {
  const searchInput = document.getElementById('searchClients') as HTMLInputElement;
  const itemsSelect = document.getElementById('itemsPerPage') as HTMLSelectElement;
  const letterBtns = document.querySelectorAll('.letter-btn');

  // Búsqueda
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
    currentPage = 1;
    applyClientFilters();
  });

  // Items por página
  itemsSelect?.addEventListener('change', (e) => {
    itemsPerPage = parseInt((e.target as HTMLSelectElement).value);
    currentPage = 1;
    applyClientFilters();
  });

  // Filtro alfabético
  letterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const letter = (e.currentTarget as HTMLElement).dataset.letter!;
      currentLetter = letter;
      currentPage = 1;
      
      // Actualizar estilos de botones
      letterBtns.forEach(b => {
        b.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white/70', 'hover:bg-white', 'text-gray-700');
      });
      
      (e.currentTarget as HTMLElement).classList.remove('bg-white/70', 'hover:bg-white', 'text-gray-700');
      (e.currentTarget as HTMLElement).classList.add('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'shadow-md');
      
      applyClientFilters();
    });
  });
}

function applyClientFilters() {
  let filtered = [...allClientsCache];

  // Filtro por búsqueda
  if (searchQuery) {
    filtered = filtered.filter(c => 
      c.nombres_y_apellidos_de_usuario.toLowerCase().includes(searchQuery) ||
      c.nro_de_cedula_usuario.includes(searchQuery)
    );
  }

  // Filtro por letra
  if (currentLetter !== 'todas') {
    filtered = filtered.filter(c => {
      const firstLetter = c.nombres_y_apellidos_de_usuario.charAt(0).toUpperCase();
      return firstLetter === currentLetter;
    });
  }

  // Ordenar alfabéticamente
  filtered.sort((a, b) => 
    a.nombres_y_apellidos_de_usuario.localeCompare(b.nombres_y_apellidos_de_usuario)
  );

  // Calcular paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filtered.slice(startIndex, endIndex);

  // Actualizar estadísticas
  updateClientStats(filtered.length, startIndex + 1, Math.min(endIndex, filtered.length));

  // Renderizar
  displayClients(paginatedClients);
  renderPagination(totalPages, filtered.length);
}

function updateClientStats(total: number, start: number, end: number) {
  const statsDiv = document.getElementById('clientStats');
  if (statsDiv) {
    if (total === 0) {
      statsDiv.textContent = 'No se encontraron clientes';
    } else {
      statsDiv.textContent = `Mostrando ${start}-${end} de ${total} clientes`;
    }
  }
}

function displayClients(cases: Case[]) {
  const grid = document.getElementById('clientsGrid');
  if (!grid) return;

  if (cases.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full backdrop-blur-md bg-white/30 rounded-xl p-12 text-center border border-white/40">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <p class="text-gray-600">No se encontraron clientes</p>
        <p class="text-sm text-gray-500 mt-2">Intenta cambiar los filtros de búsqueda</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = cases.map(caso => `
    <div class="backdrop-blur-md bg-white/40 rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
         data-cedula="${caso.nro_de_cedula_usuario}">
      <div class="flex items-start justify-between mb-4">
        <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caso.estado_actual)}">
          ${caso.estado_actual}
        </span>
      </div>

      <h3 class="text-lg font-bold text-gray-800 mb-3 line-clamp-2" title="${caso.nombres_y_apellidos_de_usuario}">
        ${caso.nombres_y_apellidos_de_usuario}
      </h3>
      
      <div class="space-y-2 text-sm text-gray-600">
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
          </svg>
          <span class="truncate">${caso.nro_de_cedula_usuario}</span>
        </div>
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <span class="truncate">${caso.telefono || 'N/A'}</span>
        </div>
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="truncate">${caso.nro_proceso_judicial_expediente}</span>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-white/40">
        <div class="text-xs text-gray-500 mb-1">Materia</div>
        <div class="text-sm font-medium text-gray-700 truncate" title="${caso.materia}">${caso.materia}</div>
      </div>
      
      <!-- Indicador de doble clic -->
      <div class="mt-3 text-center">
        <p class="text-xs text-gray-500 italic">
          <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Doble clic para editar
        </p>
      </div>
    </div>
  `).join('');
  
  // ✅ Agregar event listeners de doble clic
  setupClientCardListeners(cases);
}

// ✅ Nueva función: Configurar eventos de doble clic
function setupClientCardListeners(cases: Case[]) {
  const cards = document.querySelectorAll('#clientsGrid > div[data-cedula]');
  
  cards.forEach(card => {
    card.addEventListener('dblclick', (e) => {
      const cedula = (card as HTMLElement).dataset.cedula;
      const client = cases.find(c => c.nro_de_cedula_usuario === cedula);
      
      if (client && cedula) {
        console.log('✏️ Abriendo formulario de edición para:', client.nombres_y_apellidos_de_usuario);
        openEditForm(cedula);
      }
    });
  });
}

// ✅ Nueva función: Abrir formulario de edición
function openEditForm(cedula: string) {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'editUserFormModal';
  document.body.appendChild(modalContainer);
  
  import('./EditUserForm').then(({ renderEditUserForm, initEditUserForm }) => {
    modalContainer.innerHTML = renderEditUserForm(cedula);
    initEditUserForm(cedula);
  }).catch(error => {
    console.error('Error al cargar el formulario de edición:', error);
    alert('Error al abrir el formulario de edición');
    modalContainer.remove();
  });
}

function renderPagination(totalPages: number, totalItems: number) {
  const paginationDiv = document.getElementById('pagination');
  if (!paginationDiv || totalPages <= 1) {
    if (paginationDiv) paginationDiv.innerHTML = '';
    return;
  }

  let html = '<div class="flex items-center justify-between">';
  
  // Botón anterior
  html += `
    <button 
      id="prevPage" 
      ${currentPage === 1 ? 'disabled' : ''}
      class="px-4 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      <span>Anterior</span>
    </button>
  `;

  // Números de página
  html += '<div class="flex items-center space-x-2">';
  
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    html += `<button class="page-btn px-3 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-lg font-semibold text-sm transition" data-page="1">1</button>`;
    if (startPage > 2) {
      html += '<span class="text-gray-500">...</span>';
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    html += `
      <button 
        class="page-btn px-3 py-2 rounded-lg font-semibold text-sm transition ${
          isActive 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
            : 'bg-white/70 hover:bg-white text-gray-700'
        }" 
        data-page="${i}"
      >
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += '<span class="text-gray-500">...</span>';
    }
    html += `<button class="page-btn px-3 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-lg font-semibold text-sm transition" data-page="${totalPages}">${totalPages}</button>`;
  }

  html += '</div>';

  // Botón siguiente
  html += `
    <button 
      id="nextPage" 
      ${currentPage === totalPages ? 'disabled' : ''}
      class="px-4 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
    >
      <span>Siguiente</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  `;

  html += '</div>';
  paginationDiv.innerHTML = html;

  // Event listeners para paginación
  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      applyClientFilters();
    }
  });

  document.getElementById('nextPage')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyClientFilters();
    }
  });

  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentPage = parseInt((e.currentTarget as HTMLElement).dataset.page!);
      applyClientFilters();
    });
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