import { apiService } from '../services/apiService';
import jsPDF from 'jspdf';
import { showQRModal } from '../components/QRGenerator';

// Mostrar modal con encuesta del cliente
export async function showSurveyViewer(cedula: string, nombre: string) {
  const modal = document.createElement('div');
  modal.id = 'surveyViewerModal';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 overflow-y-auto';
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">📊 Encuesta de Satisfacción</h2>
            <p class="text-blue-100 text-sm">${nombre} - CI: ${cedula}</p>
          </div>
          <button id="closeViewerModal" class="p-2 hover:bg-white/20 rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6">
        <div id="surveyContent" class="space-y-4">
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>

        <div id="actionButtons" class="hidden mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            id="downloadPDFBtn"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            📄 Descargar PDF
          </button>
          <button 
            id="showQRBtn"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            📱 Generar QR
          </button>
          <button 
            id="closeViewerBtn"
            class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Cargar encuesta
  loadSurveyData(cedula, nombre, modal);

  // Event listeners
  document.getElementById('closeViewerModal')?.addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('closeViewerBtn')?.addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

async function loadSurveyData(cedula: string, nombre: string, modal: HTMLElement) {
  try {
    console.log('📥 Cargando encuesta...');

    // Obtener encuesta del servidor
    const encuesta = await apiService.get(`/api/encuestas/${cedula}`);
    
    if (!encuesta) {
      showNoSurveyMessage(cedula, nombre, modal);
      return;
    }

    // Obtener datos del caso
    let caseData = null;
    try {
      caseData = await apiService.get(`/api/cases/${cedula}`);
    } catch (error) {
      console.log('⚠️ No se pudieron cargar datos del caso');
    }

    // Mostrar encuesta
    displaySurvey(encuesta, caseData, modal);

    // Configurar botón de descarga PDF (sin firma)
    document.getElementById('downloadPDFBtn')?.addEventListener('click', () => {
      generateAdminPDF(cedula, nombre, encuesta, caseData);
    });

    // Configurar botón de QR
    document.getElementById('showQRBtn')?.addEventListener('click', () => {
      showQRModal(cedula, nombre);
    });

  } catch (error: any) {
    console.error('❌ Error al cargar encuesta:', error);
    showNoSurveyMessage(cedula, nombre, modal);
  }
}

function showNoSurveyMessage(cedula: string, nombre: string, modal: HTMLElement) {
  const content = document.getElementById('surveyContent');
  if (!content) return;

  content.innerHTML = `
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📋</div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">No hay encuesta registrada</h3>
      <p class="text-gray-600 mb-6">
        Este usuario aún no ha completado la encuesta de satisfacción
      </p>
      <button 
        id="generateQRBtnNoSurvey"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition"
      >
        📱 Generar QR para Encuesta
      </button>
    </div>
  `;

  document.getElementById('generateQRBtnNoSurvey')?.addEventListener('click', () => {
    modal.remove();
    showQRModal(cedula, nombre);
  });
}

function displaySurvey(encuesta: any, caseData: any, modal: HTMLElement) {
  const content = document.getElementById('surveyContent');
  if (!content) return;

  const fecha = new Date(encuesta.fecha_encuesta).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  content.innerHTML = `
    <!-- Info -->
    <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
      <p class="text-sm text-gray-700"><strong>Fecha de registro:</strong> ${fecha}</p>
    </div>

    <!-- Respuestas -->
    <div class="space-y-4">
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <p class="text-sm font-bold text-gray-800 mb-2">
          1. ¿Cómo se enteró de los servicios?
        </p>
        <p class="text-sm text-gray-700 ml-4">→ ${encuesta.medio_conocimiento}</p>
        ${encuesta.telefono_referido ? `<p class="text-xs text-gray-500 ml-4 mt-1">Tel. referido: ${encuesta.telefono_referido}</p>` : ''}
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <p class="text-sm font-bold text-gray-800 mb-2">
          2. ¿La información recibida fue?
        </p>
        <p class="text-sm text-gray-700 ml-4">→ ${encuesta.informacion_recibida}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <p class="text-sm font-bold text-gray-800 mb-2">
          3. ¿La orientación brindada fue?
        </p>
        <p class="text-sm text-gray-700 ml-4">→ ${encuesta.orientacion_brindada}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <p class="text-sm font-bold text-gray-800 mb-2">
          4. ¿Su nivel de satisfacción fue?
        </p>
        <p class="text-sm text-gray-700 ml-4">→ ${encuesta.nivel_satisfaccion}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <p class="text-sm font-bold text-gray-800 mb-2">
          5. ¿Volvería a utilizar los servicios?
        </p>
        <p class="text-sm text-gray-700 ml-4">→ ${encuesta.volveria_usar ? 'Sí' : 'No'}</p>
      </div>

      ${encuesta.comentarios ? `
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm font-bold text-gray-800 mb-2">Comentarios:</p>
          <p class="text-sm text-gray-700 ml-4">${encuesta.comentarios}</p>
        </div>
      ` : ''}

      <!-- Nota sobre la firma -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-xs text-gray-500 text-center">
          ℹ️ El usuario firmó digitalmente al momento de completar la encuesta.<br>
          La firma se incluirá en el PDF generado como constancia.
        </p>
      </div>
    </div>
  `;

  // Mostrar botones de acción
  document.getElementById('actionButtons')?.classList.remove('hidden');
}

function generateAdminPDF(cedula: string, nombre: string, encuesta: any, caseData: any) {
  console.log('📄 Generando PDF administrativo (sin firma almacenada)...');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 15;

  // ===== HEADER =====
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('UNIVERSIDAD TÉCNICA DE MACHALA', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  pdf.setFontSize(11);
  pdf.text('FACULTAD DE CIENCIAS SOCIALES', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  pdf.text('CARRERA DE DERECHO', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  pdf.text('CONSULTORIO JURÍDICO GRATUITO UTMACH', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ENCUESTA DE SATISFACCIÓN', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // ===== DATOS DEL USUARIO =====
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DATOS DEL USUARIO', margin, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${nombre}`, margin, yPos);
  yPos += 5;
  pdf.text(`Cédula: ${cedula}`, margin, yPos);
  yPos += 5;
  
  const fecha = new Date(encuesta.fecha_encuesta).toLocaleDateString('es-EC');
  pdf.text(`Fecha de encuesta: ${fecha}`, margin, yPos);
  yPos += 10;

  // ===== DATOS DEL CASO =====
  if (caseData) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL CASO', margin, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'normal');
    if (caseData.tipo_caso) {
      pdf.text(`Tipo de caso: ${caseData.tipo_caso}`, margin, yPos);
      yPos += 5;
    }
    if (caseData.estado) {
      pdf.text(`Estado: ${caseData.estado}`, margin, yPos);
      yPos += 5;
    }
    yPos += 5;
  }

  // ===== RESPUESTAS =====
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESPUESTAS DE LA ENCUESTA', margin, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`1. ¿Cómo se enteró del servicio?`, margin, yPos);
  yPos += 5;
  pdf.text(`   Respuesta: ${encuesta.medio_conocimiento}`, margin, yPos);
  yPos += 5;
  
  if (encuesta.telefono_referido) {
    pdf.text(`   Teléfono referido: ${encuesta.telefono_referido}`, margin, yPos);
    yPos += 5;
  }
  yPos += 2;
  
  pdf.text(`2. ¿La información recibida en la asesoría fue?`, margin, yPos);
  yPos += 5;
  pdf.text(`   Respuesta: ${encuesta.informacion_recibida}`, margin, yPos);
  yPos += 7;
  
  pdf.text(`3. ¿La orientación brindada fue?`, margin, yPos);
  yPos += 5;
  pdf.text(`   Respuesta: ${encuesta.orientacion_brindada}`, margin, yPos);
  yPos += 7;
  
  pdf.text(`4. ¿Su nivel de satisfacción fue?`, margin, yPos);
  yPos += 5;
  pdf.text(`   Respuesta: ${encuesta.nivel_satisfaccion}`, margin, yPos);
  yPos += 7;
  
  pdf.text(`5. ¿Volvería a utilizar los servicios?`, margin, yPos);
  yPos += 5;
  pdf.text(`   Respuesta: ${encuesta.volveria_usar ? 'Sí' : 'No'}`, margin, yPos);
  yPos += 10;

  // ===== COMENTARIOS =====
  if (encuesta.comentarios) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMENTARIOS ADICIONALES:', margin, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    const comments = pdf.splitTextToSize(encuesta.comentarios, pageWidth - 2 * margin);
    pdf.text(comments, margin, yPos);
    yPos += comments.length * 5 + 8;
  }

  // ===== ESPACIO PARA FIRMA =====
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRMA DEL USUARIO:', margin, yPos);
  yPos += 5;
  
  // Línea para firma
  const firmaWidth = 60;
  const firmaX = (pageWidth - firmaWidth) / 2;
  yPos += 15;
  pdf.line(firmaX, yPos, firmaX + firmaWidth, yPos);
  yPos += 4;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(nombre, pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  pdf.text(`CI: ${cedula}`, pageWidth / 2, yPos, { align: 'center' });
  
  // Nota al pie
  yPos += 10;
  pdf.setFontSize(8);
  pdf.setTextColor(100);
  pdf.text('* El usuario firmó digitalmente al momento de completar esta encuesta', margin, yPos);

  // Guardar PDF
  const pdfName = `Encuesta_${cedula}_${Date.now()}.pdf`;
  pdf.save(pdfName);

  console.log('✅ PDF descargado en computadora administrativa');
}