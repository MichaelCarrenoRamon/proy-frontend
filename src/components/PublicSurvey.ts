import { SignaturePadComponent } from '../components/SignaturePad';
import { apiService } from '../services/apiService';

let signaturePad: SignaturePadComponent | null = null;

export function renderPublicSurvey(): string {
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div class="text-center">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Encuesta de Satisfacción</h1>
            <p class="text-gray-600">Consultorio Jurídico Gratuito UTMACH</p>
            <p class="text-sm text-gray-500 mt-2">Su opinión es muy importante para nosotros</p>
          </div>
        </div>

        <!-- Formulario de Búsqueda -->
        <div id="searchSection" class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Buscar mi Caso</h2>
          <p class="text-gray-600 text-sm mb-4">Ingrese su número de cédula para cargar sus datos</p>
          
          <div class="flex gap-3">
            <input 
              type="text" 
              id="cedulaInput"
              placeholder="Ej: 0705123456"
              maxlength="10"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              id="searchBtn"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg"
            >
              Buscar
            </button>
          </div>
          
          <div id="searchMessage" class="hidden mt-4"></div>
        </div>

        <!-- Formulario de Encuesta (oculto inicialmente) -->
        <form id="surveyForm" class="hidden bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <!-- Datos del Usuario -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <h3 class="font-bold text-gray-800 mb-2">Datos del Usuario</h3>
            <p class="text-sm text-gray-700">
              <strong>Nombre:</strong> <span id="userName"></span>
            </p>
            <p class="text-sm text-gray-700">
              <strong>Cédula:</strong> <span id="userCedula"></span>
            </p>
          </div>

          <!-- Pregunta 1: Medio de Conocimiento -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-800 mb-3">
              1. ¿Cómo se enteró de los servicios del Consultorio Jurídico Gratuito? *
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="medio" value="amigo" required class="w-4 h-4 text-blue-600">
                <span class="text-sm">Amigo</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="medio" value="familiar" required class="w-4 h-4 text-blue-600">
                <span class="text-sm">Familiar</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="medio" value="periodico" required class="w-4 h-4 text-blue-600">
                <span class="text-sm">Periódico</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="medio" value="radio" required class="w-4 h-4 text-blue-600">
                <span class="text-sm">Radio</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="medio" value="pagina_web" required class="w-4 h-4 text-blue-600">
                <span class="text-sm">Página Web</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="medio" value="redes_sociales" required class="w-4 h-4 text-blue-600">
                <span class="text-sm">Redes Sociales</span>
              </label>
            </div>
          </div>

          <!-- Teléfono Referido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Teléfono del Referido (opcional)
            </label>
            <input 
              type="tel" 
              id="telefonoReferido"
              placeholder="0987654321"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Pregunta 2: Información Recibida -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-800 mb-3">
              2. ¿La información recibida en la asesoría inicial fue? *
            </label>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="informacion" value="excelente" required class="w-4 h-4 text-green-600">
                <span class="text-sm">Excelente</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="informacion" value="buena" required class="w-4 h-4 text-green-600">
                <span class="text-sm">Buena</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="informacion" value="deficiente" required class="w-4 h-4 text-green-600">
                <span class="text-sm">Deficiente</span>
              </label>
            </div>
          </div>

          <!-- Pregunta 3: Orientación -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-800 mb-3">
              3. ¿La orientación brindada tanto por el asesor legal y el estudiante fue? *
            </label>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="orientacion" value="excelente" required class="w-4 h-4 text-yellow-600">
                <span class="text-sm">Excelente</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="orientacion" value="buena" required class="w-4 h-4 text-yellow-600">
                <span class="text-sm">Buena</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="orientacion" value="deficiente" required class="w-4 h-4 text-yellow-600">
                <span class="text-sm">Deficiente</span>
              </label>
            </div>
          </div>

          <!-- Pregunta 4: Nivel de Satisfacción -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-800 mb-3">
              4. ¿Su nivel de satisfacción con la asesoría recibida fue? *
            </label>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="satisfaccion" value="excelente" required class="w-4 h-4 text-purple-600">
                <span class="text-sm">Excelente</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="satisfaccion" value="buena" required class="w-4 h-4 text-purple-600">
                <span class="text-sm">Buena</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="satisfaccion" value="deficiente" required class="w-4 h-4 text-purple-600">
                <span class="text-sm">Deficiente</span>
              </label>
            </div>
          </div>

          <!-- Pregunta 5: Volvería a usar -->
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-800 mb-3">
              5. ¿Volvería a utilizar los servicios del Consultorio Jurídico? *
            </label>
            <div class="flex flex-wrap gap-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="volveria" value="true" required class="w-4 h-4 text-indigo-600">
                <span class="text-sm">Sí</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="volveria" value="false" required class="w-4 h-4 text-indigo-600">
                <span class="text-sm">No</span>
              </label>
            </div>
          </div>

          <!-- Comentarios -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Comentarios Adicionales (opcional)
            </label>
            <textarea 
              id="comentarios"
              rows="3"
              placeholder="Comparta sus comentarios o sugerencias..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Firma Digital -->
          <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-800 mb-3">
              Firma del Usuario *
            </label>
            <p class="text-xs text-gray-500 mb-2">
              La firma se utilizará únicamente como constancia en el PDF
            </p>
            <canvas 
              id="signatureCanvas" 
              class="w-full h-40 bg-white border-2 border-gray-300 rounded cursor-crosshair touch-none"
            ></canvas>
            <div class="flex justify-between mt-3">
              <p class="text-xs text-gray-500">Firme en el recuadro blanco</p>
              <button 
                type="button" 
                id="clearSignature"
                class="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Limpiar Firma
              </button>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              type="submit" 
              id="submitBtn"
              class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg"
            >
              ✓ Enviar Encuesta
            </button>
            <button 
              type="button"
              id="cancelBtn"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
            >
              Cancelar
            </button>
          </div>
        </form>

        <!-- Modal de Éxito -->
        <div id="successModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-t-2xl text-center">
              <div class="text-7xl mb-4">✅</div>
              <h2 class="text-3xl font-bold">¡Gracias por su Tiempo!</h2>
              <p class="text-green-100 text-lg mt-2">Encuesta completada exitosamente</p>
            </div>
            
            <div class="p-8 text-center">
              <div class="bg-blue-50 rounded-lg p-6 mb-6">
                <p class="text-gray-700 text-lg mb-2">
                  Su opinión es muy importante para nosotros
                </p>
                <p class="text-gray-600 text-sm">
                  Sus respuestas han sido guardadas correctamente
                </p>
              </div>

              <button 
                id="closeSuccessBtn"
                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
              >
                Finalizar
              </button>

              <p class="text-gray-500 text-xs mt-6">
                Consultorio Jurídico Gratuito UTMACH
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initPublicSurvey() {
  console.log('🎯 Inicializando encuesta pública...');
  
  const searchBtn = document.getElementById('searchBtn');
  const cedulaInput = document.getElementById('cedulaInput') as HTMLInputElement;
  const searchMessage = document.getElementById('searchMessage');
  const searchSection = document.getElementById('searchSection');
  const surveyForm = document.getElementById('surveyForm') as HTMLFormElement;
  const cancelBtn = document.getElementById('cancelBtn');
  
  let currentCedula = '';
  let currentNombre = '';
  let currentCaseData: any = null;

  // ============================================
  // 1. VERIFICAR SI VIENE CÉDULA DESDE QR
  // ============================================
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const cedulaFromQR = urlParams.get('cedula');
  const nombreFromQR = urlParams.get('nombre');

  if (cedulaFromQR) {
    console.log('📱 Datos desde QR:', { cedula: cedulaFromQR, nombre: nombreFromQR });
    cedulaInput.value = cedulaFromQR;
    
    // Auto-buscar después de un pequeño delay
    setTimeout(() => {
      searchBtn?.click();
    }, 500);
  }

  // ============================================
  // 2. BUSCAR CASO POR CÉDULA
  // ============================================
  searchBtn?.addEventListener('click', async () => {
    const cedula = cedulaInput.value.trim();
    
    // Validación básica de cédula ecuatoriana
    if (!cedula) {
      showMessage('Por favor ingrese su número de cédula', 'error');
      return;
    }
    
    if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
      showMessage('La cédula debe tener 10 dígitos numéricos', 'error');
      return;
    }

    searchBtn.textContent = 'Buscando...';
    searchBtn.setAttribute('disabled', 'true');

    try {
      console.log('🔍 Buscando caso para cédula:', cedula);
      
      const response = await apiService.get(`/api/cases/${cedula}`);
      
      if (!response) {
        showMessage('No se encontró un caso registrado con esta cédula. Por favor contacte con el consultorio.', 'error');
        return;
      }

      console.log('✅ Caso encontrado:', response);

      // Guardar datos
      currentCedula = cedula;
      currentNombre = response.nombre_completo || response.nombre || 'Usuario';
      currentCaseData = response;

      // Mostrar datos en el formulario
      document.getElementById('userName')!.textContent = currentNombre;
      document.getElementById('userCedula')!.textContent = currentCedula;
      
      // Ocultar búsqueda y mostrar formulario
      searchSection?.classList.add('hidden');
      surveyForm?.classList.remove('hidden');
      surveyForm?.scrollIntoView({ behavior: 'smooth' });

      // Inicializar firma digital
      setTimeout(() => {
        signaturePad = new SignaturePadComponent('signatureCanvas');
        console.log('✅ Firma digital inicializada');
      }, 100);

    } catch (error: any) {
      console.error('❌ Error al buscar caso:', error);
      showMessage(error.message || 'Error al buscar el caso. Por favor intente nuevamente.', 'error');
    } finally {
      searchBtn.textContent = 'Buscar';
      searchBtn.removeAttribute('disabled');
    }
  });

  // Permitir buscar con Enter
  cedulaInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn?.click();
    }
  });

  // ============================================
  // 3. LIMPIAR FIRMA
  // ============================================
  document.getElementById('clearSignature')?.addEventListener('click', () => {
    signaturePad?.clear();
  });

  // ============================================
  // 4. CANCELAR ENCUESTA
  // ============================================
  cancelBtn?.addEventListener('click', () => {
    if (confirm('¿Está seguro de cancelar? Perderá todos los datos ingresados.')) {
      window.location.reload();
    }
  });

  // ============================================
  // 5. ENVIAR ENCUESTA
  // ============================================
  surveyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitPublicSurvey(currentCedula, currentNombre, currentCaseData);
  });

  // ============================================
  // 6. CERRAR MODAL DE ÉXITO
  // ============================================
  document.getElementById('closeSuccessBtn')?.addEventListener('click', () => {
    window.location.reload();
  });

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  function showMessage(message: string, type: 'error' | 'success') {
    if (!searchMessage) return;
    
    searchMessage.className = type === 'error' 
      ? 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm'
      : 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm';
    searchMessage.textContent = message;
    searchMessage.classList.remove('hidden');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      searchMessage.classList.add('hidden');
    }, 5000);
  }
}

// ============================================
// FUNCIÓN PARA ENVIAR ENCUESTA
// ============================================
async function submitPublicSurvey(cedula: string, nombre: string, caseData: any) {
  const form = document.getElementById('surveyForm') as HTMLFormElement;
  
  // Validar formulario
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Validar firma
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('⚠️ Por favor firme en el recuadro antes de enviar la encuesta');
    return;
  }

  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Guardando...';

  try {
    console.log('📤 Enviando encuesta...');

    // Recopilar datos del formulario
    const data = {
      cedula_usuario: cedula,
      medio_conocimiento: (document.querySelector('input[name="medio"]:checked') as HTMLInputElement).value,
      telefono_referido: (document.getElementById('telefonoReferido') as HTMLInputElement).value || null,
      informacion_recibida: (document.querySelector('input[name="informacion"]:checked') as HTMLInputElement).value,
      orientacion_brindada: (document.querySelector('input[name="orientacion"]:checked') as HTMLInputElement).value,
      nivel_satisfaccion: (document.querySelector('input[name="satisfaccion"]:checked') as HTMLInputElement).value,
      volveria_usar: (document.querySelector('input[name="volveria"]:checked') as HTMLInputElement).value === 'true',
      comentarios: (document.getElementById('comentarios') as HTMLTextAreaElement).value || null
      // ❌ NO incluimos la firma en la base de datos
    };

    console.log('📋 Datos a enviar:', data);

    // Guardar en el servidor (SIN firma)
    await apiService.post('/api/encuestas', data);

    console.log('✅ Encuesta guardada exitosamente');

    // Mostrar modal de éxito
    document.getElementById('successModal')?.classList.remove('hidden');

    // Opcional: Podrías generar un PDF aquí si lo deseas
    // await generatePDFLocal(cedula, nombre, data, signaturePad.getDataURL());

  } catch (error: any) {
    console.error('❌ Error al enviar encuesta:', error);
    alert(`Error: ${error.message || 'No se pudo guardar la encuesta. Por favor intente nuevamente.'}`);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText || '✓ Enviar Encuesta';
  }
}

console.log('✅ Módulo PublicSurvey cargado');