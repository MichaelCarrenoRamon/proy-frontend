import { db } from '../services/database';
import type { Case } from '../types/Case';
import { apiService } from '../services/apiService';

export function renderExistingClientSearch(): string {
  return `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">Buscar Cliente Existente</h2>
              <p class="text-purple-100 text-sm">Agregar nueva actividad a expediente existente</p>
            </div>
            <button id="closeSearchForm" class="p-2 hover:bg-white/20 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Search Section -->
        <div class="p-6 space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Buscar por Cédula o Nombre del Cliente
            </label>
            <div class="relative">
              <input 
                type="text" 
                id="searchClientInput"
                placeholder="Ingresa cédula o nombre completo..."
                class="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg"
              />
              <svg class="absolute left-4 top-3.5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Results -->
          <div id="searchResults" class="space-y-3 max-h-96 overflow-y-auto">
            <div class="text-center text-gray-500 py-8">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p>Ingresa una cédula o nombre para buscar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initExistingClientSearch() {
  const searchInput = document.getElementById('searchClientInput') as HTMLInputElement;
  const resultsDiv = document.getElementById('searchResults');
  
  let searchTimeout: NodeJS.Timeout;

  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length < 3) {
      if (resultsDiv) {
        resultsDiv.innerHTML = `
          <div class="text-center text-gray-500 py-8">
            <p>Ingresa al menos 3 caracteres para buscar</p>
          </div>
        `;
      }
      return;
    }
    
    searchTimeout = setTimeout(async () => {
      await searchClients(query);
    }, 500);
  });

  document.getElementById('closeSearchForm')?.addEventListener('click', () => {
    document.getElementById('existingClientModal')?.remove();
  });
}

async function searchClients(query: string) {
  const resultsDiv = document.getElementById('searchResults');
  if (!resultsDiv) return;

  try {
    resultsDiv.innerHTML = `
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
        <p class="text-gray-600 mt-3">Buscando...</p>
      </div>
    `;

    const allCases = await db.getAllCases();
    const filtered = allCases.filter(c => 
      c.nro_de_cedula_usuario.includes(query) ||
      c.nombres_y_apellidos_de_usuario.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      resultsDiv.innerHTML = `
        <div class="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <svg class="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-gray-700 font-medium">No se encontró ningún cliente</p>
          <p class="text-sm text-gray-600 mt-2">Intenta con otra búsqueda o crea un nuevo caso</p>
        </div>
      `;
      return;
    }

    resultsDiv.innerHTML = filtered.map(client => `
      <div class="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl p-4 hover:shadow-lg transition cursor-pointer" data-cedula="${client.nro_de_cedula_usuario}">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800">${client.nombres_y_apellidos_de_usuario}</h3>
            <div class="grid grid-cols-2 gap-3 mt-2 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                </svg>
                <span class="font-medium">${client.nro_de_cedula_usuario}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>${client.telefono || 'N/A'}</span>
              </div>
              <div class="flex items-center col-span-2">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="truncate">${client.nro_proceso_judicial_expediente}</span>
              </div>
            </div>
            <div class="mt-3 flex items-center space-x-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.estado_actual)}">
                ${client.estado_actual}
              </span>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                ${client.materia}
              </span>
            </div>
          </div>
          <button class="select-client-btn ml-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Agregar Actividad</span>
          </button>
        </div>
      </div>
    `).join('');

    // Event listeners para seleccionar cliente
    document.querySelectorAll('.select-client-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = (e.currentTarget as HTMLElement).closest('[data-cedula]') as HTMLElement;
        const cedula = card.dataset.cedula!;
        const client = filtered.find(c => c.nro_de_cedula_usuario === cedula);
        if (client) {
          showAddActivityForm(client);
        }
      });
    });

  } catch (error) {
    console.error('Error al buscar clientes:', error);
    resultsDiv.innerHTML = `
      <div class="text-center py-8 bg-red-50 rounded-lg border border-red-200">
        <p class="text-red-700">Error al buscar clientes</p>
      </div>
    `;
  }
}

export function showAddActivityForm(client: Case) {
  document.getElementById('existingClientModal')?.remove();
  
  const modal = document.createElement('div');
  modal.id = 'addActivityModal';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto';
  modal.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-2xl max-w-3xl w-full shadow-2xl my-8 max-h-[90vh] flex flex-col">
      <!-- Header (fijo) -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl flex-shrink-0">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Agregar Nueva Actividad</h2>
            <p class="text-green-100 text-sm">${client.nombres_y_apellidos_de_usuario} - ${client.nro_de_cedula_usuario}</p>
          </div>
          <button id="closeActivityForm" class="p-2 hover:bg-white/20 rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Formulario (scrollable) -->
      <form id="activityForm" class="p-6 space-y-6 overflow-y-auto flex-1">
        <!-- Resumen del cliente -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 class="font-bold text-blue-900 mb-3">Información del Expediente</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600">Expediente:</span>
              <span class="font-semibold ml-2">${client.nro_proceso_judicial_expediente}</span>
            </div>
            <div>
              <span class="text-gray-600">Materia:</span>
              <span class="font-semibold ml-2">${client.materia}</span>
            </div>
            <div>
              <span class="text-gray-600">Estado:</span>
              <span class="font-semibold ml-2">${client.estado_actual}</span>
            </div>
            <div>
              <span class="text-gray-600">Tipo:</span>
              <span class="font-semibold ml-2">${client.tipo_de_proceso}</span>
            </div>
          </div>
        </div>

        <!-- Actividades anteriores -->
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto">
          <h3 class="font-bold text-gray-900 mb-2">Actividades Previas</h3>
          <div class="text-sm text-gray-700 whitespace-pre-line">
            ${client.actividades_realizadas || 'Sin actividades registradas'}
          </div>
        </div>

        <!-- Nueva actividad -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nueva Actividad *</label>
            <textarea 
              id="nuevaActividad" 
              required 
              rows="4" 
              placeholder="Describe la actividad realizada..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Actualizar Estado del Caso</label>
            <select id="nuevoEstado" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="${client.estado_actual}">${client.estado_actual} (Mantener)</option>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Próxima Actividad</label>
            <input 
              type="date" 
              id="proximaFecha"
              value="${client.fecha_de_proxima_actividad || ''}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </form>

      <!-- Footer con botones (fijo en la parte inferior) -->
      <div class="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 flex-shrink-0 bg-white rounded-b-2xl">
        <button 
          type="submit" 
          id="submitActivityBtn"
          class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
        >
          Guardar Actividad
        </button>
        <button 
          type="button" 
          id="cancelActivity"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  document.getElementById('closeActivityForm')?.addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('cancelActivity')?.addEventListener('click', () => {
    modal.remove();
  });

  // Cambié el event listener del formulario para usar el botón directamente
  document.getElementById('submitActivityBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = document.getElementById('activityForm') as HTMLFormElement;
    if (form.checkValidity()) {
      await saveNewActivity(client);
    } else {
      form.reportValidity();
    }
  });

  // Cerrar al hacer clic en el fondo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (confirm('¿Estás seguro de cancelar?')) {
        modal.remove();
      }
    }
  });
}

async function saveNewActivity(client: Case) {
  const nuevaActividad = (document.getElementById('nuevaActividad') as HTMLTextAreaElement).value;
  const nuevoEstado = (document.getElementById('nuevoEstado') as HTMLSelectElement).value;
  const proximaFecha = (document.getElementById('proximaFecha') as HTMLInputElement).value;

  if (!nuevaActividad.trim()) {
    alert('Por favor describe la actividad realizada');
    return;
  }

  const submitBtn = document.getElementById('submitActivityBtn') as HTMLButtonElement;
  
  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Guardando...';
    }

    const timestamp = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const actividadConFecha = `[${timestamp}] ${nuevaActividad}`;
    const actividadesActualizadas = client.actividades_realizadas 
      ? `${client.actividades_realizadas}\n\n${actividadConFecha}`
      : actividadConFecha;

    console.log('📤 Actualizando caso:', client.nro_de_cedula_usuario);

    // ✅ Usar apiService en lugar de fetch
    await apiService.put(`/api/cases/${client.nro_de_cedula_usuario}`, {
      actividades_realizadas: actividadesActualizadas,
      estado_actual: nuevoEstado,
      fecha_de_proxima_actividad: proximaFecha || client.fecha_de_proxima_actividad || new Date().toISOString().split('T')[0]
    });

    console.log('✅ Caso actualizado exitosamente');

    // ✅ Crear actividad en el calendario si hay próxima fecha
    if (proximaFecha) {
      try {
        console.log('📅 Creando actividad en calendario...');
        
        await apiService.post('/api/activities', {
          titulo: `Seguimiento: ${client.nombres_y_apellidos_de_usuario}`,
          descripcion: nuevaActividad,
          fecha_actividad: proximaFecha,
          tipo: 'cliente',
          completada: false,
          cedula_cliente: client.nro_de_cedula_usuario
        });

        console.log('✅ Actividad agregada al calendario');
      } catch (activityError) {
        console.warn('⚠️ Error al agregar actividad:', activityError);
      }
    } else {
      console.log('ℹ️ No se especificó próxima fecha');
    }

    // Mostrar modal de encuesta
    showSurveyModalAfterUpdate(client.nro_de_cedula_usuario, client.nombres_y_apellidos_de_usuario);

  } catch (error: any) {
    console.error('❌ Error completo:', error);
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar Actividad';
    }
    
    alert(`Error al guardar la actividad:\n\n${error.message}`);
  }
}

function showSurveyModalAfterUpdate(cedula: string, nombre: string) {
  // Cerrar el modal de actividad
  document.getElementById('addActivityModal')?.remove();
  
  const modal = document.createElement('div');
  modal.id = 'surveyModal';
  modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto';
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
        <h2 class="text-2xl font-bold">✅ Actividad Registrada Exitosamente</h2>
        <p class="text-green-100 text-sm">Cliente: ${nombre}</p>
      </div>
      
      <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-bold text-blue-900 mb-3 text-center">📱 Encuesta de Satisfacción</h3>
          <p class="text-sm text-gray-700 mb-4 text-center">
            El cliente debe escanear este código QR con su tablet para completar la encuesta
          </p>
          
          <!-- QR Code Container -->
          <div class="bg-white rounded-lg p-6 border-2 border-dashed border-blue-300 text-center">
            <div id="qrCodeContainer" class="flex justify-center mb-3">
              <div class="animate-pulse text-blue-600">Generando código QR...</div>
            </div>
            <p class="text-xs text-gray-500 mt-2">Cédula: ${cedula}</p>
            <p class="text-xs text-gray-600 mt-1 font-medium">
              Escanee este código para acceder a la encuesta
            </p>
          </div>
        </div>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-bold mb-1">Instrucciones:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Entregue la tablet al cliente</li>
                <li>El cliente debe escanear el código QR</li>
                <li>Completar la encuesta en la tablet</li>
                <li>Firmar digitalmente en la tablet</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
        
      <div class="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 bg-gray-50 rounded-b-2xl">
        <button 
          id="openSurveyBtn" 
          class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Abrir Encuesta Directamente
        </button>
        <button 
          id="closeSurveyModal" 
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
        >
          Finalizar sin Encuesta
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Generar QR Code
  generateQRForSurveyUpdate(cedula, nombre);
  
  document.getElementById('openSurveyBtn')?.addEventListener('click', () => {
    modal.remove();
    
    import('./SurveyForm').then(({ showSurveyForm }) => {
      showSurveyForm(cedula, nombre);
    });
  });
  
  document.getElementById('closeSurveyModal')?.addEventListener('click', () => {
    modal.remove();
    window.location.reload();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      window.location.reload();
    }
  });
}

async function generateQRForSurveyUpdate(cedula: string, nombre: string) {
  try {
    const QRCode = (await import('qrcode')).default;
    const surveyUrl = `${window.location.origin}/#/encuesta/${cedula}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(surveyUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      }
    });
    
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
      qrContainer.innerHTML = `
        <img src="${qrCodeDataURL}" alt="QR Code" class="border-4 border-blue-500 rounded-lg shadow-lg" />
      `;
    }
    
    console.log('✅ QR generado correctamente');
    
  } catch (error) {
    console.error('❌ Error al generar QR:', error);
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
      qrContainer.innerHTML = `
        <div class="text-red-600 text-sm">
          <p>Error al generar QR</p>
          <p class="text-xs mt-1">URL: ${window.location.origin}/#/encuesta/${cedula}</p>
        </div>
      `;
    }
  }
}

function getStatusColor(estado: string): string {
  if (!estado) return 'bg-gray-100 text-gray-800';
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('activo')) return 'bg-green-100 text-green-800';
  if (estadoLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
  if (estadoLower.includes('finalizado') || estadoLower.includes('cerrado')) return 'bg-gray-100 text-gray-800';
  return 'bg-blue-100 text-blue-800';
}