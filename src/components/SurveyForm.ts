import QRCode from 'qrcode';
import { SignaturePadComponent } from './SignaturePad';
import jsPDF from 'jspdf';
import { API_BASE_URL } from '../config/api';
import { apiService } from '../services/apiService';

let signaturePad: SignaturePadComponent | null = null;

export function showSurveyForm(cedula: string, nombre: string) {
  const modal = document.createElement('div');
  modal.id = 'surveyFormModal';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 overflow-y-auto';
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8 max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex-shrink-0">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">📋 Encuesta de Satisfacción</h2>
            <p class="text-blue-100 text-sm">${nombre} - CI: ${cedula}</p>
          </div>
          <button id="closeSurveyForm" class="p-2 hover:bg-white/20 rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Formulario con scroll -->
      <form id="surveyForm" class="p-6 space-y-6 overflow-y-auto flex-1">
        <!-- Pregunta 1: Medio de Conocimiento -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label class="block text-sm font-bold text-gray-800 mb-3">
            1. ¿Cómo se enteró de los servicios del Consultorio Jurídico Gratuito? *
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
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

        <!-- Teléfono Referido (opcional) -->
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
      </form>

      <!-- Footer con botones (fijo en la parte inferior) -->
      <div class="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 flex-shrink-0 bg-white rounded-b-2xl">
        <button 
          type="button"
          id="submitSurveyBtn"
          class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
        >
          ✓ Enviar Encuesta
        </button>
        <button 
          type="button"
          id="cancelSurvey"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Inicializar el pad de firma
  setTimeout(() => {
    signaturePad = new SignaturePadComponent('signatureCanvas');
  }, 100);

  // Event listeners
  document.getElementById('closeSurveyForm')?.addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('cancelSurvey')?.addEventListener('click', () => {
    if (confirm('¿Estás seguro de cancelar la encuesta?')) {
      modal.remove();
    }
  });

  document.getElementById('clearSignature')?.addEventListener('click', () => {
    signaturePad?.clear();
  });

  document.getElementById('submitSurveyBtn')?.addEventListener('click', async () => {
    await submitSurvey(cedula, nombre, modal);
  });

  // Cerrar al hacer clic en el fondo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (confirm('¿Estás seguro de cancelar la encuesta?')) {
        modal.remove();
      }
    }
  });
}

async function submitSurvey(cedula: string, nombre: string, modal: HTMLElement) {
  const form = document.getElementById('surveyForm') as HTMLFormElement;
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!signaturePad || signaturePad.isEmpty()) {
    alert('Por favor firme en el recuadro antes de enviar');
    return;
  }

  const submitBtn = document.getElementById('submitSurveyBtn') as HTMLButtonElement;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Guardando...';

  try {
    // Guardar la firma inmediatamente
    const firmaDataURL = signaturePad.getDataURL();
    
    // Recopilar datos
    const data = {
      cedula_usuario: cedula,
      medio_conocimiento: (document.querySelector('input[name="medio"]:checked') as HTMLInputElement).value,
      telefono_referido: (document.getElementById('telefonoReferido') as HTMLInputElement).value || null,
      informacion_recibida: (document.querySelector('input[name="informacion"]:checked') as HTMLInputElement).value,
      orientacion_brindada: (document.querySelector('input[name="orientacion"]:checked') as HTMLInputElement).value,
      nivel_satisfaccion: (document.querySelector('input[name="satisfaccion"]:checked') as HTMLInputElement).value,
      volveria_usar: (document.querySelector('input[name="volveria"]:checked') as HTMLInputElement).value === 'true',
      comentarios: (document.getElementById('comentarios') as HTMLTextAreaElement).value || null,
      firma: firmaDataURL
    };

    console.log('📝 Enviando encuesta:', {
      ...data,
      firma: data.firma ? 'Firma presente ✓' : 'Firma ausente ✗'
    });

    // Guardar en el backend usando apiService
    await apiService.post('/api/encuestas', data);

    console.log('✅ Encuesta guardada');

    // Generar PDF ANTES de cambiar el modal
    await generatePDF(cedula, nombre, data);

    // Mostrar mensaje de éxito
    await showSuccessWithQR(cedula, nombre, modal);

  } catch (error: any) {
    console.error('❌ Error al guardar encuesta:', error);
    alert(error.message || 'Error al guardar la encuesta');
    submitBtn.disabled = false;
    submitBtn.textContent = '✓ Enviar Encuesta';
  }
}

async function generatePDF(cedula: string, nombre: string, data: any) {
  try {
    console.log('📄 Generando PDF completo...');
    
    // Obtener datos completos del caso
    let caseData = null;
    try {
      caseData = await apiService.get(`/api/cases/${cedula}`);
    } catch (error) {
      console.log('⚠️ No se encontraron datos del caso');
    }
    
    // Crear PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 15;

    // ============ HEADER ============
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

    // ============ DATOS DEL USUARIO ============
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL USUARIO', margin, yPos);
    yPos += 6;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${nombre}`, margin, yPos);
    yPos += 5;
    pdf.text(`Cédula: ${cedula}`, margin, yPos);
    yPos += 5;
    
    const fecha = new Date().toLocaleDateString('es-EC');
    pdf.text(`Fecha: ${fecha}`, margin, yPos);
    yPos += 10;

    // ============ DATOS DEL CASO (si existen) ============
    if (caseData) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORMACIÓN DEL CASO', margin, yPos);
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
      
      if (caseData.fecha_registro) {
        const fechaRegistro = new Date(caseData.fecha_registro).toLocaleDateString('es-EC');
        pdf.text(`Fecha de registro: ${fechaRegistro}`, margin, yPos);
        yPos += 5;
      }
      
      yPos += 5;
    }

    // ============ RESPUESTAS DE LA ENCUESTA ============
    pdf.setFont('helvetica', 'bold');
    pdf.text('RESPUESTAS DE LA ENCUESTA', margin, yPos);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    // Pregunta 1
    pdf.setFont('helvetica', 'bold');
    pdf.text('1. ¿Cómo se enteró de los servicios del Consultorio Jurídico?', margin, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`   Respuesta: ${data.medio_conocimiento}`, margin, yPos);
    yPos += 5;
    
    if (data.telefono_referido) {
      pdf.text(`   Teléfono del referido: ${data.telefono_referido}`, margin, yPos);
      yPos += 5;
    }
    yPos += 3;

    // Pregunta 2
    pdf.setFont('helvetica', 'bold');
    pdf.text('2. ¿La información recibida en la asesoría inicial fue?', margin, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`   Respuesta: ${data.informacion_recibida}`, margin, yPos);
    yPos += 8;

    // Pregunta 3
    pdf.setFont('helvetica', 'bold');
    pdf.text('3. ¿La orientación brindada por el asesor legal y el estudiante fue?', margin, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`   Respuesta: ${data.orientacion_brindada}`, margin, yPos);
    yPos += 8;

    // Pregunta 4
    pdf.setFont('helvetica', 'bold');
    pdf.text('4. ¿Su nivel de satisfacción con la asesoría recibida fue?', margin, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`   Respuesta: ${data.nivel_satisfaccion}`, margin, yPos);
    yPos += 8;

    // Pregunta 5
    pdf.setFont('helvetica', 'bold');
    pdf.text('5. ¿Volvería a utilizar los servicios del Consultorio Jurídico?', margin, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`   Respuesta: ${data.volveria_usar ? 'Sí' : 'No'}`, margin, yPos);
    yPos += 10;

    // ============ COMENTARIOS ============
    if (data.comentarios) {
      // Verificar si hay espacio suficiente
      if (yPos + 20 > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('COMENTARIOS ADICIONALES:', margin, yPos);
      yPos += 5;
      
      pdf.setFont('helvetica', 'normal');
      const comentarioLines = pdf.splitTextToSize(data.comentarios, pageWidth - 2 * margin);
      pdf.text(comentarioLines, margin, yPos);
      yPos += (comentarioLines.length * 5) + 10;
    }

    // ============ FIRMA ============
    // Verificar si hay espacio suficiente para la firma
    if (yPos + 40 > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }

    yPos += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('FIRMA DEL USUARIO:', margin, yPos);
    yPos += 10;

    // Agregar firma si existe (CENTRADA)
    if (data.firma) {
      try {
        const firmaWidth = 60;
        const firmaHeight = 20;
        const firmaX = (pageWidth - firmaWidth) / 2;
        
        pdf.addImage(data.firma, 'PNG', firmaX, yPos, firmaWidth, firmaHeight);
        yPos += firmaHeight + 5;
        
        console.log('✅ Firma agregada al PDF');
      } catch (error) {
        console.error('❌ Error al agregar firma al PDF:', error);
        
        // Si falla la firma, agregar línea para firmar manualmente
        const lineWidth = 60;
        const lineX = (pageWidth - lineWidth) / 2;
        yPos += 15;
        pdf.line(lineX, yPos, lineX + lineWidth, yPos);
        yPos += 5;
      }
    } else {
      // Línea para firma manual
      const lineWidth = 60;
      const lineX = (pageWidth - lineWidth) / 2;
      yPos += 15;
      pdf.line(lineX, yPos, lineX + lineWidth, yPos);
      yPos += 5;
    }
    
    // Nombre y cédula debajo de la firma
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(nombre, pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    pdf.text(`CI: ${cedula}`, pageWidth / 2, yPos, { align: 'center' });

    // ============ PIE DE PÁGINA ============
    yPos = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Universidad Técnica de Machala - Consultorio Jurídico Gratuito', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    pdf.text(`Generado el ${fecha}`, pageWidth / 2, yPos, { align: 'center' });

    // ============ GUARDAR PDF ============
    const pdfName = `Encuesta_${cedula}_${Date.now()}.pdf`;
    pdf.save(pdfName);

    console.log('✅ PDF generado exitosamente:', pdfName);
    return pdfName;

  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    throw error;
  }
}

export async function showSuccessWithQR(cedula: string, nombre: string, modal: HTMLElement) {
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-t-2xl text-center">
        <div class="text-7xl mb-4">✅</div>
        <h2 class="text-3xl font-bold">¡Gracias por su Tiempo!</h2>
        <p class="text-green-100 text-lg mt-2">Encuesta completada exitosamente</p>
      </div>
      
      <div class="p-8 text-center">
        <div class="bg-blue-50 rounded-lg p-6 mb-6">
          <p class="text-gray-700 text-lg mb-2">
            <span class="font-bold">${nombre}</span>
          </p>
          <p class="text-gray-600 text-sm">
            Su opinión es muy importante para nosotros
          </p>
        </div>

        <button 
          id="closeSuccessModal"
          class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
        >
          Cerrar
        </button>

        <p class="text-gray-500 text-xs mt-6">
          Consultorio Jurídico Gratuito UTMACH
        </p>
      </div>
    </div>
  `;

  document.getElementById('closeSuccessModal')?.addEventListener('click', () => {
    modal.remove();
    window.location.reload();
  });
}