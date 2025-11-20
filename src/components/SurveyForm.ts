import { SignaturePadComponent } from './SignaturePad';
import jsPDF from 'jspdf';
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

      <!-- Footer con botones -->
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

  setTimeout(() => {
    signaturePad = new SignaturePadComponent('signatureCanvas');
  }, 100);

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
    const firmaDataURL = signaturePad.getDataURL();
    
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

    // Guardar encuesta (sin firma en BD)
    const dataParaBD = { ...data };
    //delete dataParaBD.firma;
    
    await apiService.post('/api/encuestas', dataParaBD);
    console.log('✅ Encuesta guardada');

    // Generar PDF CON firma (solo se descarga localmente)
    await generateCompletePDF(cedula, nombre, data);

    await showSuccessWithQR(cedula, nombre, modal);

  } catch (error: any) {
    console.error('❌ Error:', error);
    alert(error.message || 'Error al guardar la encuesta');
    submitBtn.disabled = false;
    submitBtn.textContent = '✓ Enviar Encuesta';
  }
}

// Función auxiliar para traducir medio de conocimiento
function translateMedio(medio: string): string {
  const traduccion: { [key: string]: string } = {
    'amigo': 'AMIGO',
    'familiar': 'FAMILIAR',
    'periodico': 'PERIÓDICO',
    'radio': 'RADIO',
    'pagina_web': 'PAG. WEB',
    'redes_sociales': 'REDES SOCIALES'
  };
  return traduccion[medio] || medio.toUpperCase();
}

// Función auxiliar para formatear fechas
function formatDateForPDF(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC');
  } catch {
    return '';
  }
}

async function generateCompletePDF(cedula: string, nombre: string, surveyData: any) {
  try {
    console.log('📄 Generando PDF con formato de casilleros...');
    
    // Obtener datos completos del caso
    let caseData: any = null;
    try {
      caseData = await apiService.get(`/api/cases/${cedula}`);
    } catch (error) {
      console.log('⚠️ No se pudieron obtener datos del caso');
    }

    // Obtener ficha socioeconómica
    let fichaData: any = null;
    try {
      fichaData = await apiService.get(`/api/cases/${cedula}/ficha`);
    } catch (error) {
      console.log('⚠️ No hay ficha socioeconómica');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let yPos = 8;

    // ============ HEADER ============
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('UNIVERSIDAD TÉCNICA DE MACHALA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    pdf.setFontSize(11);
    pdf.text('FACULTAD DE CIENCIAS SOCIALES', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4.5;
    pdf.text('CARRERA DE DERECHO', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4.5;
    pdf.text('CONSULTORIO JURÍDICO GRATUITO UTMACH', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('FORMULARIO DE ASESORÍA INICIAL / SOCIOECONÓMICA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;

    // ============ FUNCIONES HELPER ============
    const tableWidth = pageWidth - (margin * 2);
    const col1Width = tableWidth * 0.5;
    const col2Width = tableWidth * 0.5;

    const addRow = (label1: string, value1: string, label2: string, value2: string, height: number = 6) => {
      pdf.rect(margin, yPos, col1Width, height);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(label1, margin + 1, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value1, margin + 35, yPos + 4);
      
      pdf.rect(margin + col1Width, yPos, col2Width, height);
      pdf.setFont('helvetica', 'bold');
      pdf.text(label2, margin + col1Width + 1, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value2, margin + col1Width + 35, yPos + 4);
      
      yPos += height;
    };

    const addFullRow = (label: string, value: string, height: number = 6) => {
      pdf.rect(margin, yPos, tableWidth, height);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(label, margin + 1, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 40, yPos + 4);
      yPos += height;
    };

    const addSectionHeader = (title: string) => {
      pdf.setFillColor(200, 200, 200);
      pdf.rect(margin, yPos, tableWidth, 5, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text(title, margin + 1, yPos + 3.5);
      yPos += 5;
    };

    // ============ DATOS DEL USUARIO ============
    if (caseData) {
      addRow(
        'ASESOR LEGAL:', 
        caseData.asesor_legal || 'LEONARDO FALCONI ROMERO',
        'FECHA ASESORÍA:', 
        formatDateForPDF(caseData.fecha) || ''
      );

      addRow(
        'ESTUDIANTE:', 
        caseData.estudiante_asignado || '',
        'CÉDULA USUARIO:', 
        cedula || ''
      );

      addRow(
        'NOMBRE USUARIO:', 
        (nombre || '').substring(0, 30),
        'FECHA NACIMIENTO:', 
        formatDateForPDF(caseData.fecha_de_nacimiento) || ''
      );

      addRow(
        'OCUPACIÓN:', 
        caseData.ocupacion || '',
        'Email:', 
        (caseData.email || '').substring(0, 30)
      );

      addRow(
        'DIRECCIÓN:', 
        (caseData.direccion || '').substring(0, 30),
        'Teléfono 1:', 
        caseData.telefono || ''
      );
    } else {
      // Si no hay datos del caso, mostrar info básica
      addRow('NOMBRE:', nombre, 'CÉDULA:', cedula);
      addRow('FECHA:', formatDateForPDF(new Date().toISOString()), '', '');
    }

    // ============ ENCUESTA DE SATISFACCIÓN ============
    yPos += 1;
    addSectionHeader('ENCUESTA DE SATISFACCIÓN');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.rect(margin, yPos, tableWidth, 4);
    pdf.text('FORMULARIO DE EVALUACIÓN A LA SATISFACCIÓN DEL USUARIO', margin + 1, yPos + 2.5);
    yPos += 4;

    // Pregunta 1
    pdf.rect(margin, yPos, tableWidth, 4);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('1. ¿Cómo se enteró de los servicios del Consultorio Jurídico Gratuito?', margin + 1, yPos + 2.5);
    yPos += 4;

    const medioWidth = tableWidth / 6;
    const medios = ['AMIGO', 'FAMILIAR', 'PERIÓDICO', 'RADIO', 'PAG. WEB', 'REDES SOCIALES'];
    const medioSeleccionado = translateMedio(surveyData.medio_conocimiento);

    medios.forEach((medio, i) => {
      pdf.rect(margin + (medioWidth * i), yPos, medioWidth, 3.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.text(medio, margin + (medioWidth * i) + medioWidth/2, yPos + 2, { align: 'center' });
      
      if (medioSeleccionado === medio) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('X', margin + (medioWidth * i) + medioWidth/2, yPos + 2.5, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
      }
    });
    yPos += 3.5;

    // Teléfono Referido
    if (surveyData.telefono_referido) {
      pdf.rect(margin, yPos, tableWidth, 3.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.5);
      pdf.text('TELF. REFERIDO:', margin + 1, yPos + 2);
      pdf.setFont('helvetica', 'normal');
      pdf.text(surveyData.telefono_referido, margin + 25, yPos + 2);
      yPos += 3.5;
    }

    // Función para preguntas con opciones
    const addQuestion = (question: string, selected: string) => {
      pdf.rect(margin, yPos, tableWidth, 3.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.text(question, margin + 1, yPos + 2);
      yPos += 3.5;

      const optWidth = tableWidth / 3;
      const opciones = ['EXCELENTE', 'BUENA', 'DEFICIENTE'];
      
      opciones.forEach((opc, i) => {
        pdf.rect(margin + (optWidth * i), yPos, optWidth, 3);
        pdf.text(opc + ':', margin + (optWidth * i) + 2, yPos + 2);
        
        if (selected.toUpperCase() === opc) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('X', margin + (optWidth * i) + optWidth - 5, yPos + 2);
          pdf.setFont('helvetica', 'normal');
        }
      });
      yPos += 3;
    };

    addQuestion('2. ¿La información recibida en la asesoría inicial fue?', surveyData.informacion_recibida);
    addQuestion('3. ¿La orientación brindada por el asesor legal y estudiante fue?', surveyData.orientacion_brindada);
    addQuestion('4. ¿Su nivel de satisfacción con la asesoría recibida fue?', surveyData.nivel_satisfaccion);

    // Pregunta 5
    pdf.rect(margin, yPos, tableWidth, 3.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('5. ¿Volvería a utilizar los servicios del Consultorio Jurídico?', margin + 1, yPos + 2);
    yPos += 3.5;

    const sinoWidth = tableWidth / 2;
    pdf.rect(margin, yPos, sinoWidth, 3);
    pdf.text('SI:', margin + 2, yPos + 2);
    if (surveyData.volveria_usar) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('X', margin + sinoWidth - 5, yPos + 2);
      pdf.setFont('helvetica', 'normal');
    }

    pdf.rect(margin + sinoWidth, yPos, sinoWidth, 3);
    pdf.text('NO:', margin + sinoWidth + 2, yPos + 2);
    if (!surveyData.volveria_usar) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('X', margin + tableWidth - 5, yPos + 2);
      pdf.setFont('helvetica', 'normal');
    }
    yPos += 3;

    // Comentarios
    if (surveyData.comentarios) {
      yPos += 1;
      pdf.rect(margin, yPos, tableWidth, 15);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('COMENTARIOS:', margin + 1, yPos + 3);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      const comentarios = pdf.splitTextToSize(surveyData.comentarios, tableWidth - 4);
      pdf.text(comentarios, margin + 2, yPos + 6);
      yPos += 15;
    }

    // ============ FIRMA ============
    yPos += 2;
    pdf.rect(margin, yPos, tableWidth, 25);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('FIRMA DEL USUARIO', pageWidth / 2, yPos + 3, { align: 'center' });

    if (surveyData.firma) {
      try {
        const firmaWidth = 50;
        const firmaHeight = 15;
        const firmaX = (pageWidth - firmaWidth) / 2;
        const firmaY = yPos + 5;
        
        pdf.addImage(surveyData.firma, 'PNG', firmaX, firmaY, firmaWidth, firmaHeight);
        console.log('✅ Firma agregada al PDF');
      } catch (error) {
        console.error('❌ Error al agregar firma:', error);
      }
    }

    // Línea de firma
    const lineWidth = 60;
    const lineX = (pageWidth - lineWidth) / 2;
    pdf.line(lineX, yPos + 22, lineX + lineWidth, yPos + 22);
    
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(nombre, pageWidth / 2, yPos + 24, { align: 'center' });

    // Footer
    pdf.setFontSize(6);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, pageWidth / 2, yPos + 27, { align: 'center' });

    // Guardar
    const pdfName = `Formulario_${cedula}_${Date.now()}.pdf`;
    pdf.save(pdfName);

    console.log('✅ PDF generado con formato completo:', pdfName);
    return pdfName;

  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    throw error;
  }
}

async function showSuccessWithQR(cedula: string, nombre: string, modal: HTMLElement) {
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
          <p class="text-gray-500 text-xs mt-2">
            El formulario ha sido descargado automáticamente
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