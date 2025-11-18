import { db } from '../services/database';
import { showSurveyForm } from './SurveyForm';
import { apiService } from '../services/apiService';

let currentStep = 1;
const totalSteps = 3;
let formData: any = {};

export function renderCaseForm(): string {
  return `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl">
        <!-- Header (fijo) -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">Nuevo Caso - Asesoría Inicial</h2>
              <p class="text-blue-100 text-sm">Consultorio Jurídico Gratuito UTMACH</p>
            </div>
            <button id="closeCaseForm" class="p-2 hover:bg-white/20 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress bar (fijo) -->
        <div class="px-6 pt-6 pb-4 flex-shrink-0 bg-white/95">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Paso ${currentStep} de ${totalSteps}</span>
            <span class="text-sm text-gray-500" id="stepTitle">Datos Personales</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div id="progressBar" class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${(currentStep / totalSteps) * 100}%"></div>
          </div>
        </div>

        <!-- Form Container (scrollable) -->
        <div id="formSteps" class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Se llenará dinámicamente -->
        </div>

        <!-- Navigation Buttons (fijo) -->
        <div class="p-6 border-t border-gray-200 flex justify-between flex-shrink-0 bg-white/95 rounded-b-2xl">
          <button id="prevBtn" class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition ${currentStep === 1 ? 'invisible' : ''}">
            ← Anterior
          </button>
          <button id="nextBtn" class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-lg transition">
            ${currentStep === totalSteps ? 'Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initCaseForm() {
  currentStep = 1;
  formData = {};
  
  renderStep();
  setupNavigation();
  
  // Cerrar modal
  document.getElementById('closeCaseForm')?.addEventListener('click', () => {
    if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
      document.getElementById('caseFormModal')?.remove();
    }
  });
}

function renderStep() {
  const container = document.getElementById('formSteps');
  const stepTitle = document.getElementById('stepTitle');
  const progressBar = document.getElementById('progressBar');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
  if (!container) return;

  // Actualizar barra de progreso
  if (progressBar) {
    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
  }

  // Actualizar botones
  if (prevBtn) {
    prevBtn.classList.toggle('invisible', currentStep === 1);
  }
  if (nextBtn) {
    nextBtn.textContent = currentStep === totalSteps ? 'Finalizar' : 'Siguiente →';
  }

  switch(currentStep) {
    case 1:
      if (stepTitle) stepTitle.textContent = 'Datos Personales y del Usuario';
      container.innerHTML = renderStep1();
      populateStep1();
      break;
    case 2:
      if (stepTitle) stepTitle.textContent = 'Ficha Socioeconómica';
      container.innerHTML = renderStep2();
      populateStep2();
      break;
    case 3:
      if (stepTitle) stepTitle.textContent = 'Información del Proceso';
      container.innerHTML = renderStep3();
      populateStep3();
      break;
  }
}

function renderStep1(): string {
  return `
    <div class="space-y-6">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-blue-900 mb-3">DATOS DEL USUARIO</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Asesoría *</label>
            <input type="date" id="fecha" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cédula de Usuario *</label>
            <input type="text" id="cedula" required pattern="[0-9]{10}" maxlength="10" placeholder="1234567890" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombres y Apellidos *</label>
            <input type="text" id="nombres" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
            <input type="date" id="fechaNacimiento" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" placeholder="correo@ejemplo.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono 1 *</label>
            <input type="tel" id="telefono" required pattern="[0-9]{10}" maxlength="10" placeholder="0987654321" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono Fijo</label>
            <input type="tel" id="telefonoFijo" pattern="[0-9]{7,9}" placeholder="072345678" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
            <input type="text" id="direccion" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
            <input type="text" id="ocupacion" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Instrucción</label>
            <select id="instruccion" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar...</option>
              <option value="Ninguna">Ninguna</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Tercer Nivel">Tercer Nivel</option>
              <option value="Cuarto Nivel">Cuarto Nivel</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Etnia</label>
            <select id="etnia" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar...</option>
              <option value="Mestizo">Mestizo</option>
              <option value="Indígena">Indígena</option>
              <option value="Afroecuatoriano">Afroecuatoriano</option>
              <option value="Montubio">Montubio</option>
              <option value="Blanco">Blanco</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Género *</label>
            <select id="genero" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado Civil *</label>
            <select id="estadoCivil" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar...</option>
              <option value="Soltero/a">Soltero/a</option>
              <option value="Casado/a">Casado/a</option>
              <option value="Divorciado/a">Divorciado/a</option>
              <option value="Viudo/a">Viudo/a</option>
              <option value="Unión Libre">Unión Libre</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número de Hijos</label>
            <input type="number" id="nroHijos" min="0" max="20" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discapacidad</label>
            <select id="discapacidad" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="NO">NO</option>
              <option value="Física">Física</option>
              <option value="Visual">Visual</option>
              <option value="Auditiva">Auditiva</option>
              <option value="Intelectual">Intelectual</option>
              <option value="Psicosocial">Psicosocial</option>
              <option value="Múltiple">Múltiple</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
            <input type="text" id="tipoUsuario" placeholder="Ej: Regular, Prioritario" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 class="font-bold text-purple-900 mb-3">DATOS DEL CONSULTORIO</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante Asignado</label>
            <input type="text" id="estudiante" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asesor Legal</label>
            <input type="text" id="asesorLegal" value="Leonardo Falconi Romero" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStep2(): string {
  return `
    <div class="space-y-6">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="font-bold text-green-900 mb-3">CONDICIÓN ECONÓMICA (Personas que laboran en la familia)</h3>
        
        <div class="grid grid-cols-3 gap-4 mb-4">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="padreTrabaja" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Padre</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="madreTrabaja" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Madre</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="otrosTrabajan" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Otros</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ingresos Totales ($)</label>
            <input type="number" id="ingresosTotales" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Egresos Totales ($)</label>
            <input type="number" id="egresosTotales" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 class="font-bold text-yellow-900 mb-3">BIENES DEL GRUPO FAMILIAR</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="tieneVehiculo" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Vehículo</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="tieneNegocio" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Negocio Propio</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="tieneCasa" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Casa</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="tieneDepartamento" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Departamento</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" id="tieneTerreno" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Terreno</span>
          </label>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Otros Bienes</label>
          <input type="text" id="otrosBienes" placeholder="Especificar otros bienes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500">
        </div>
      </div>

      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 class="font-bold text-orange-900 mb-3">GASTOS DE VIVIENDA</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Arriendo ($)</label>
            <input type="number" id="gastoArriendo" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Luz Eléctrica ($)</label>
            <input type="number" id="gastoLuz" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Agua ($)</label>
            <input type="number" id="gastoAgua" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono ($)</label>
            <input type="number" id="gastoTelefono" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Internet ($)</label>
            <input type="number" id="gastoInternet" min="0" step="0.01" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStep3(): string {
  return `
    <div class="space-y-6">
      <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 class="font-bold text-indigo-900 mb-3">INFORMACIÓN DEL PROCESO JUDICIAL</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nro. Proceso Judicial/Expediente *</label>
            <input type="text" id="nroProceso" required placeholder="Ej: 12345-2024-00001" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Línea de Servicio / Materia *</label>
            <select id="materia" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">Seleccionar...</option>
              <option value="Civil">Civil</option>
              <option value="Penal">Penal</option>
              <option value="Laboral">Laboral</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Familia, Niñez y Adolescencia">Familia, Niñez y Adolescencia</option>
              <option value="Constitucional">Constitucional</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <!-- ✅ IMPORTANTE: Contenedor para subdivisiones -->
          <div id="subdivisionesContainer" class="md:col-span-2" style="display: none;">
            <!-- Se llenará dinámicamente -->
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tema / Descripción *</label>
            <textarea id="tema" required rows="3" placeholder="Describe brevemente el caso..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Proceso *</label>
            <select id="tipoProceso" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">Seleccionar...</option>
              <option value="Asesoría">Asesoría</option>
              <option value="Patrocinio">Patrocinio</option>
              <option value="Audiencia">Audiencia</option>
              <option value="Seguimiento">Seguimiento</option>
              <option value="Gestión">Gestión</option>
              <option value="Reconocimiento de Firma">Reconocimiento de Firma</option>
              <option value="Diligencia">Diligencia</option>
              <option value="Notificación">Notificación</option>
              <option value="Retiro de Demanda">Retiro de Demanda</option>
              <option value="Aclaración">Aclaración</option>
              <option value="Demanda">Demanda</option>
              <option value="Denuncia">Denuncia</option>
              <option value="Acción">Acción</option>
              <option value="Recurso">Recurso</option>
              <option value="Consulta">Consulta</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parte *</label>
            <select id="parte" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">Seleccionar...</option>
              <option value="ACTOR">Actor/Demandante</option>
              <option value="DEMANDADO">Demandado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Juez/Fiscal</label>
            <input type="text" id="juezFiscal" placeholder="Nombre del Juez o Fiscal" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraparte</label>
            <input type="text" id="contraparte" placeholder="Nombre de la contraparte" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado Actual *</label>
            <select id="estadoActual" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">Seleccionar...</option>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Próxima Actividad</label>
            <input type="date" id="fechaProximaActividad" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gestión/Año *</label>
            <input type="text" id="gestion" required value="${new Date().getFullYear()}" placeholder="2025" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Actividades Realizadas</label>
            <textarea id="actividadesRealizadas" rows="3" placeholder="Describe las actividades realizadas..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="font-bold text-green-900 mb-1">Revisión Final</h4>
            <p class="text-sm text-green-700">Por favor revisa toda la información antes de finalizar. Una vez guardado el caso, se generará un código QR para que el usuario complete la encuesta de satisfacción.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Definición de subdivisiones por materia
const subdivisionesPorMateria: { [key: string]: any } = {
  "Administrativo": {
    tipo: "radio",
    opciones: ["Administrativo Interno", "Administrativo Externo"]
  },
  "Familia, Niñez y Adolescencia": {
    tipo: "categorias",
    categorias: {
      "Alimentos": [
        "Incidente de Alza de Pensión Alimenticia",
        "Incidente de Disminución de Pensión Alimenticia",
        "Alimentos para Mujer Embarazada",
        "Alimentos con Presunción de Paternidad",
        "Alimentos Congruos",
        "Caducidad",
        "Alimentos - Alza y Rebaja"
      ],
      "Divorcio": [
        "Divorcio Voluntario - Con Hijos Dependientes",
        "Divorcio Voluntario - Sin Hijos Dependientes",
        "Divorcio Controvertido - Con Hijos Dependientes",
        "Divorcio Controvertido - Sin Hijos Dependientes"
      ],
      "Violencia Intrafamiliar": [
        "Medida de Protección",
        "Boleta de Auxilio",
        "Violencia Psicológica",
        "Violencia Física"
      ],
      "Tenencia": [
        "Tenencia",
        "Modificación de Tenencia"
      ],
      "Régimen de Visitas": [
        "Régimen de Visitas",
        "Modificación de Régimen de Visitas"
      ],
      "Patria Potestad": [
        "Conflicto de Patria Potestad",
        "Suspensión de Patria Potestad",
        "Privación de Patria Potestad"
      ],
      "Curadurías": [
        "Curadurías - Nuevas Nuxias",
        "Curadurías Especial"
      ],
      "Interdicción": [
        "Interdicción Judicial"
      ],
      "Medidas de Protección": [
        "Acogida Institucional",
        "Medida de Protección Judicial"
      ],
      "Adopción": [
        "Adopción Nacional",
        "Adopción Internacional"
      ]
    }
  }
};

// Función para renderizar subdivisiones
function renderSubdivisiones(materia: string) {
  const container = document.getElementById('subdivisionesContainer');
  if (!container) return;

  const subdivisiones = subdivisionesPorMateria[materia];
  
  if (!subdivisiones) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  if (subdivisiones.tipo === 'radio') {
    // Subdivisión simple con radio buttons
    container.innerHTML = `
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">Subdivisión de ${materia} *</label>
        <div class="space-y-2">
          ${subdivisiones.opciones.map((opcion: string) => `
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
              <input type="radio" name="subdivision" value="${opcion}" required class="w-4 h-4 text-purple-600 focus:ring-purple-500">
              <span class="text-sm font-medium text-gray-700">${opcion}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  } else if (subdivisiones.tipo === 'categorias') {
    // Subdivisión por categorías
    container.innerHTML = `
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">Subdivisión de ${materia} *</label>
        <div class="space-y-4">
          ${Object.entries(subdivisiones.categorias).map(([categoria, opciones]: [string, any]) => `
            <div class="bg-white border border-purple-200 rounded-lg p-3">
              <h4 class="font-bold text-purple-900 mb-2 text-sm">${categoria}</h4>
              <div class="space-y-1.5 pl-2">
                ${opciones.map((opcion: string) => `
                  <label class="flex items-center space-x-2 cursor-pointer hover:bg-purple-50 p-1.5 rounded transition">
                    <input type="radio" name="subdivision" value="${opcion}" required class="w-4 h-4 text-purple-600 focus:ring-purple-500">
                    <span class="text-sm text-gray-700">${opcion}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

function populateStep1() {
  // Cargar datos guardados si existen
  if (formData.fecha) (document.getElementById('fecha') as HTMLInputElement).value = formData.fecha;
  if (formData.cedula) (document.getElementById('cedula') as HTMLInputElement).value = formData.cedula;
  if (formData.nombres) (document.getElementById('nombres') as HTMLInputElement).value = formData.nombres;
  if (formData.fechaNacimiento) (document.getElementById('fechaNacimiento') as HTMLInputElement).value = formData.fechaNacimiento;
  if (formData.email) (document.getElementById('email') as HTMLInputElement).value = formData.email;
  if (formData.telefono) (document.getElementById('telefono') as HTMLInputElement).value = formData.telefono;
  if (formData.telefonoFijo) (document.getElementById('telefonoFijo') as HTMLInputElement).value = formData.telefonoFijo;
  if (formData.direccion) (document.getElementById('direccion') as HTMLInputElement).value = formData.direccion;
  if (formData.ocupacion) (document.getElementById('ocupacion') as HTMLInputElement).value = formData.ocupacion;
  if (formData.instruccion) (document.getElementById('instruccion') as HTMLSelectElement).value = formData.instruccion;
  if (formData.etnia) (document.getElementById('etnia') as HTMLSelectElement).value = formData.etnia;
  if (formData.genero) (document.getElementById('genero') as HTMLSelectElement).value = formData.genero;
  if (formData.estadoCivil) (document.getElementById('estadoCivil') as HTMLSelectElement).value = formData.estadoCivil;
  if (formData.nroHijos !== undefined) (document.getElementById('nroHijos') as HTMLInputElement).value = formData.nroHijos.toString();
  if (formData.discapacidad) (document.getElementById('discapacidad') as HTMLSelectElement).value = formData.discapacidad;
  if (formData.tipoUsuario) (document.getElementById('tipoUsuario') as HTMLInputElement).value = formData.tipoUsuario;
  if (formData.estudiante) (document.getElementById('estudiante') as HTMLInputElement).value = formData.estudiante;
  if (formData.asesorLegal) (document.getElementById('asesorLegal') as HTMLInputElement).value = formData.asesorLegal;
}

function populateStep2() {
  // Cargar datos guardados
  if (formData.padreTrabaja !== undefined) (document.getElementById('padreTrabaja') as HTMLInputElement).checked = formData.padreTrabaja;
  if (formData.madreTrabaja !== undefined) (document.getElementById('madreTrabaja') as HTMLInputElement).checked = formData.madreTrabaja;
  if (formData.otrosTrabajan !== undefined) (document.getElementById('otrosTrabajan') as HTMLInputElement).checked = formData.otrosTrabajan;
  if (formData.ingresosTotales !== undefined) (document.getElementById('ingresosTotales') as HTMLInputElement).value = formData.ingresosTotales.toString();
  if (formData.egresosTotales !== undefined) (document.getElementById('egresosTotales') as HTMLInputElement).value = formData.egresosTotales.toString();
  if (formData.tieneVehiculo !== undefined) (document.getElementById('tieneVehiculo') as HTMLInputElement).checked = formData.tieneVehiculo;
  if (formData.tieneNegocio !== undefined) (document.getElementById('tieneNegocio') as HTMLInputElement).checked = formData.tieneNegocio;
  if (formData.tieneCasa !== undefined) (document.getElementById('tieneCasa') as HTMLInputElement).checked = formData.tieneCasa;
  if (formData.tieneDepartamento !== undefined) (document.getElementById('tieneDepartamento') as HTMLInputElement).checked = formData.tieneDepartamento;
  if (formData.tieneTerreno !== undefined) (document.getElementById('tieneTerreno') as HTMLInputElement).checked = formData.tieneTerreno;
  if (formData.otrosBienes) (document.getElementById('otrosBienes') as HTMLInputElement).value = formData.otrosBienes;
  if (formData.gastoArriendo !== undefined) (document.getElementById('gastoArriendo') as HTMLInputElement).value = formData.gastoArriendo.toString();
  if (formData.gastoLuz !== undefined) (document.getElementById('gastoLuz') as HTMLInputElement).value = formData.gastoLuz.toString();
  if (formData.gastoAgua !== undefined) (document.getElementById('gastoAgua') as HTMLInputElement).value = formData.gastoAgua.toString();
  if (formData.gastoTelefono !== undefined) (document.getElementById('gastoTelefono') as HTMLInputElement).value = formData.gastoTelefono.toString();
  if (formData.gastoInternet !== undefined) (document.getElementById('gastoInternet') as HTMLInputElement).value = formData.gastoInternet.toString();
}

function populateStep3() {
  // Cargar datos guardados
  if (formData.nroProceso) (document.getElementById('nroProceso') as HTMLInputElement).value = formData.nroProceso;
  
  // ✅ Detectar si la materia guardada es una subdivisión
  if (formData.materia) {
    // Buscar en qué categoría principal está la subdivisión
    let materiaEncontrada = formData.materia;
    let subdivisionEncontrada = null;
    
    // Verificar si es una subdivisión
    for (const [materiaPrincipal, config] of Object.entries(subdivisionesPorMateria)) {
      if (config.tipo === 'radio' && config.opciones.includes(formData.materia)) {
        materiaEncontrada = materiaPrincipal;
        subdivisionEncontrada = formData.materia;
        break;
      } else if (config.tipo === 'categorias') {
        for (const opciones of Object.values(config.categorias)) {
          if ((opciones as string[]).includes(formData.materia)) {
            materiaEncontrada = materiaPrincipal;
            subdivisionEncontrada = formData.materia;
            break;
          }
        }
        if (subdivisionEncontrada) break;
      }
    }
    
    // Establecer la materia principal en el select
    (document.getElementById('materia') as HTMLSelectElement).value = materiaEncontrada;
    
    // Renderizar subdivisiones si existen
    renderSubdivisiones(materiaEncontrada);
    
    // Si había subdivisión, marcarla
    if (subdivisionEncontrada) {
      setTimeout(() => {
        const radioBtn = document.querySelector(`input[name="subdivision"][value="${subdivisionEncontrada}"]`) as HTMLInputElement;
        if (radioBtn) radioBtn.checked = true;
      }, 100);
    }
  }
  
  if (formData.tema) (document.getElementById('tema') as HTMLTextAreaElement).value = formData.tema;
  if (formData.tipoProceso) (document.getElementById('tipoProceso') as HTMLSelectElement).value = formData.tipoProceso;
  if (formData.parte) (document.getElementById('parte') as HTMLSelectElement).value = formData.parte;
  if (formData.juezFiscal) (document.getElementById('juezFiscal') as HTMLInputElement).value = formData.juezFiscal;
  if (formData.contraparte) (document.getElementById('contraparte') as HTMLInputElement).value = formData.contraparte;
  if (formData.estadoActual) (document.getElementById('estadoActual') as HTMLSelectElement).value = formData.estadoActual;
  if (formData.fechaProximaActividad) (document.getElementById('fechaProximaActividad') as HTMLInputElement).value = formData.fechaProximaActividad;
  if (formData.gestion) (document.getElementById('gestion') as HTMLInputElement).value = formData.gestion;
  if (formData.actividadesRealizadas) (document.getElementById('actividadesRealizadas') as HTMLTextAreaElement).value = formData.actividadesRealizadas;

  const materiaSelect = document.getElementById('materia') as HTMLSelectElement;
  materiaSelect?.addEventListener('change', (e) => {
    const selectedMateria = (e.target as HTMLSelectElement).value;
    renderSubdivisiones(selectedMateria);
  });
}

function collectStepData() {
  switch(currentStep) {
    case 1:
      formData.fecha = (document.getElementById('fecha') as HTMLInputElement).value;
      formData.cedula = (document.getElementById('cedula') as HTMLInputElement).value;
      formData.nombres = (document.getElementById('nombres') as HTMLInputElement).value;
      formData.fechaNacimiento = (document.getElementById('fechaNacimiento') as HTMLInputElement).value;
      formData.email = (document.getElementById('email') as HTMLInputElement).value;
      formData.telefono = (document.getElementById('telefono') as HTMLInputElement).value;
      formData.telefonoFijo = (document.getElementById('telefonoFijo') as HTMLInputElement).value;
      formData.direccion = (document.getElementById('direccion') as HTMLInputElement).value;
      formData.ocupacion = (document.getElementById('ocupacion') as HTMLInputElement).value;
      formData.instruccion = (document.getElementById('instruccion') as HTMLSelectElement).value;
      formData.etnia = (document.getElementById('etnia') as HTMLSelectElement).value;
      formData.genero = (document.getElementById('genero') as HTMLSelectElement).value;
      formData.estadoCivil = (document.getElementById('estadoCivil') as HTMLSelectElement).value;
      formData.nroHijos = parseInt((document.getElementById('nroHijos') as HTMLInputElement).value) || 0;
      formData.discapacidad = (document.getElementById('discapacidad') as HTMLSelectElement).value;
      formData.tipoUsuario = (document.getElementById('tipoUsuario') as HTMLInputElement).value;
      formData.estudiante = (document.getElementById('estudiante') as HTMLInputElement).value;
      formData.asesorLegal = (document.getElementById('asesorLegal') as HTMLInputElement).value;
      console.log('✅ Datos del paso 1 guardados:', formData); // AGREGADO
      break;
      
    case 2:
      formData.padreTrabaja = (document.getElementById('padreTrabaja') as HTMLInputElement).checked;
      formData.madreTrabaja = (document.getElementById('madreTrabaja') as HTMLInputElement).checked;
      formData.otrosTrabajan = (document.getElementById('otrosTrabajan') as HTMLInputElement).checked;
      formData.ingresosTotales = parseFloat((document.getElementById('ingresosTotales') as HTMLInputElement).value) || 0;
      formData.egresosTotales = parseFloat((document.getElementById('egresosTotales') as HTMLInputElement).value) || 0;
      formData.tieneVehiculo = (document.getElementById('tieneVehiculo') as HTMLInputElement).checked;
      formData.tieneNegocio = (document.getElementById('tieneNegocio') as HTMLInputElement).checked;
      formData.tieneCasa = (document.getElementById('tieneCasa') as HTMLInputElement).checked;
      formData.tieneDepartamento = (document.getElementById('tieneDepartamento') as HTMLInputElement).checked;
      formData.tieneTerreno = (document.getElementById('tieneTerreno') as HTMLInputElement).checked;
      formData.otrosBienes = (document.getElementById('otrosBienes') as HTMLInputElement).value;
      formData.gastoArriendo = parseFloat((document.getElementById('gastoArriendo') as HTMLInputElement).value) || 0;
      formData.gastoLuz = parseFloat((document.getElementById('gastoLuz') as HTMLInputElement).value) || 0;
      formData.gastoAgua = parseFloat((document.getElementById('gastoAgua') as HTMLInputElement).value) || 0;
      formData.gastoTelefono = parseFloat((document.getElementById('gastoTelefono') as HTMLInputElement).value) || 0;
      formData.gastoInternet = parseFloat((document.getElementById('gastoInternet') as HTMLInputElement).value) || 0;
      console.log('✅ Datos del paso 2 guardados:', formData); // AGREGADO
      break;
      
    case 3:
      formData.nroProceso = (document.getElementById('nroProceso') as HTMLInputElement).value;
  
      const materiaSeleccionada = (document.getElementById('materia') as HTMLSelectElement).value;
  
      const subdivisionRadio = document.querySelector('input[name="subdivision"]:checked') as HTMLInputElement;
      
      formData.materia = subdivisionRadio ? subdivisionRadio.value : materiaSeleccionada;
      
      formData.tema = (document.getElementById('tema') as HTMLTextAreaElement).value;
      formData.tipoProceso = (document.getElementById('tipoProceso') as HTMLSelectElement).value;
      formData.parte = (document.getElementById('parte') as HTMLSelectElement).value;
      formData.juezFiscal = (document.getElementById('juezFiscal') as HTMLInputElement).value;
      formData.contraparte = (document.getElementById('contraparte') as HTMLInputElement).value;
      formData.estadoActual = (document.getElementById('estadoActual') as HTMLSelectElement).value;
      formData.fechaProximaActividad = (document.getElementById('fechaProximaActividad') as HTMLInputElement).value;
      formData.gestion = (document.getElementById('gestion') as HTMLInputElement).value;
      formData.actividadesRealizadas = (document.getElementById('actividadesRealizadas') as HTMLTextAreaElement).value;
      console.log('✅ Datos del paso 3 guardados:', formData);
      break;
      
  }
}
  
  function validateStep(): boolean {
    const requiredFields = document.querySelectorAll(`#formSteps input[required], #formSteps select[required], #formSteps textarea[required]`);
    let isValid = true;
    
    requiredFields.forEach(field => {
      const input = field as HTMLInputElement;
      if (!input.value.trim()) {
        input.classList.add('border-red-500');
        isValid = false;
      } else {
        input.classList.remove('border-red-500');
      }
    });
    
    if (!isValid) {
      alert('Por favor completa todos los campos obligatorios marcados con *');
    }
    
    return isValid;
  }
  
  function setupNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    nextBtn?.addEventListener('click', async () => {
      if (!validateStep()) return;
      
      collectStepData();
      
      if (currentStep === totalSteps) {
        // Guardar caso
        await saveCase();
      } else {
        currentStep++;
        renderStep();
      }
    });
    
    prevBtn?.addEventListener('click', () => {
      collectStepData();
      currentStep--;
      renderStep();
    });
  }
  
  async function saveCase() {
    const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
    nextBtn.disabled = true;
    nextBtn.textContent = 'Guardando...';
    
    try {
      const caseData = {
        nro_de_cedula_usuario: formData.cedula,
        nombres_y_apellidos_de_usuario: formData.nombres,
        fecha_de_nacimiento: formData.fechaNacimiento,
        nro_proceso_judicial_expediente: formData.nroProceso,
        telefono: formData.telefono,
        telefono_fijo: formData.telefonoFijo || null,
        email: formData.email || null,
        direccion: formData.direccion,
        materia: formData.materia,
        tipo_de_proceso: formData.tipoProceso,
        parte_actor_demandado: formData.parte,
        juez_fiscal: formData.juezFiscal || '',
        juez_fiscal_1: null,
        contraparte: formData.contraparte || '',
        actividades_realizadas: formData.actividadesRealizadas || '',
        estado_actual: formData.estadoActual,
        fecha_de_proxima_actividad: formData.fechaProximaActividad || new Date().toISOString().split('T')[0],
        fecha: formData.fecha,
        gestion: formData.gestion,
        ocupacion: formData.ocupacion || null,
        instruccion: formData.instruccion || null,
        etnia: formData.etnia || null,
        genero: formData.genero,
        estado_civil: formData.estadoCivil,
        nro_hijos: formData.nroHijos || 0,
        discapacidad: formData.discapacidad || null,
        tipo_usuario: formData.tipoUsuario || null,
        linea_servicio: formData.materia,
        tema: formData.tema,
        estudiante_asignado: formData.estudiante || null,
        asesor_legal: formData.asesorLegal || null
      };
      
      const fichaSocioeconomica = {
        padre_trabaja: formData.padreTrabaja || false,
        madre_trabaja: formData.madreTrabaja || false,
        otros_trabajan: formData.otrosTrabajan || false,
        tiene_vehiculo: formData.tieneVehiculo || false,
        tiene_negocio: formData.tieneNegocio || false,
        tiene_casa: formData.tieneCasa || false,
        tiene_departamento: formData.tieneDepartamento || false,
        tiene_terreno: formData.tieneTerreno || false,
        otros_bienes: formData.otrosBienes || null,
        ingresos_totales: formData.ingresosTotales || 0,
        egresos_totales: formData.egresosTotales || 0,
        gasto_arriendo: formData.gastoArriendo || 0,
        gasto_luz: formData.gastoLuz || 0,
        gasto_agua: formData.gastoAgua || 0,
        gasto_telefono: formData.gastoTelefono || 0,
        gasto_internet: formData.gastoInternet || 0
      };
      
      console.log('📤 Enviando datos del caso...');
      
      // ✅ CAMBIO: Usar apiService en lugar de fetch directo
      const result = await apiService.post('/api/cases/complete', {
        caseData,
        fichaSocioeconomica
      });
      
      console.log('✅ Caso guardado exitosamente:', result);
      
      // Mostrar modal de encuesta
      showSurveyModal(formData.cedula, formData.nombres);
      
    } catch (error: any) {
      console.error('❌ Error al guardar caso:', error);
      alert(`Error al guardar: ${error.message}\n\nRevisa la consola para más detalles.`);
      nextBtn.disabled = false;
      nextBtn.textContent = 'Finalizar';
    }
  }
  
function showSurveyModal(cedula: string, nombre: string) {
  const modal = document.createElement('div');
  modal.id = 'surveyModal';
  modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
        <h2 class="text-2xl font-bold">✅ Caso Registrado Exitosamente</h2>
        <p class="text-green-100 text-sm">Usuario: ${nombre}</p>
      </div>
      
      <div class="p-6 space-y-4">
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
        
        <div class="flex space-x-3">
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
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Generar QR Code inmediatamente
  generateQRForSurvey(cedula, nombre);
  
  document.getElementById('openSurveyBtn')?.addEventListener('click', () => {
    modal.remove();
    document.getElementById('caseFormModal')?.remove();
    
    // Importar y mostrar encuesta
    import('./SurveyForm').then(({ showSurveyForm }) => {
      showSurveyForm(cedula, nombre);
    });
  });
  
  document.getElementById('closeSurveyModal')?.addEventListener('click', () => {
    modal.remove();
    document.getElementById('caseFormModal')?.remove();
    window.location.reload();
  });
}

async function generateQRForSurvey(cedula: string, nombre: string) {
  try {
    // Importar QRCode dinámicamente
    const QRCode = (await import('qrcode')).default;
    
    // URL que apuntará a la encuesta (puedes personalizarla)
    const surveyUrl = `${window.location.origin}/#/encuesta/${cedula}`;
    
    // Generar QR
    const qrCodeDataURL = await QRCode.toDataURL(surveyUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      }
    });
    
    // Insertar QR en el contenedor
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
      qrContainer.innerHTML = `
        <img src="${qrCodeDataURL}" alt="QR Code" class="border-4 border-blue-500 rounded-lg shadow-lg" />
      `;
    }
    
    console.log('✅ QR generado correctamente para:', cedula);
    console.log('🔗 URL de encuesta:', surveyUrl);
    
  } catch (error) {
    console.error('❌ Error al generar QR:', error);
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
      qrContainer.innerHTML = `
        <div class="text-red-600 text-sm">
          <p class="font-bold mb-2">Error al generar QR</p>
          <p>URL manual: ${window.location.origin}/#/encuesta/${cedula}</p>
        </div>
      `;
    }
  }
}