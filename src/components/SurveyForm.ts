import QRCode from 'qrcode';
import { SignaturePadComponent } from './SignaturePad';
import jsPDF from 'jspdf';

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
    // ✅ GUARDAR LA FIRMA INMEDIATAMENTE
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
      firma: firmaDataURL  // ✅ Usar la variable guardada
    };

    console.log('📝 Datos de encuesta:', {
      ...data,
      firma: data.firma ? 'Firma presente ✓' : 'Firma ausente ✗'
    });

    // Guardar en el backend
    const response = await fetch('http://localhost:3000/api/encuestas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Error al guardar la encuesta');
    }

    console.log('✅ Encuesta guardada');

    // ✅ Generar PDF ANTES de cambiar el modal
    await generatePDF(cedula, nombre, data);

    // Mostrar mensaje de éxito SIN QR
    await showSuccessWithQR(cedula, nombre, modal);

  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar la encuesta');
    submitBtn.disabled = false;
    submitBtn.textContent = '✓ Enviar Encuesta';
  }
}

async function generatePDF(cedula: string, nombre: string, data: any) {
  try {
    // Obtener datos completos del caso desde la BD
    const caseResponse = await fetch(`http://localhost:3000/api/cases/${cedula}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (!caseResponse.ok) {
      throw new Error('No se pudieron obtener los datos del caso');
    }

    const caseData = await caseResponse.json();

    // Obtener ficha socioeconómica
    const fichaResponse = await fetch(`http://localhost:3000/api/cases/${cedula}/ficha`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    let fichaData = null;
    if (fichaResponse.ok) {
      fichaData = await fichaResponse.json();
    }

    // Crear PDF
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

    // ============ TABLA PRINCIPAL ============
    const tableWidth = pageWidth - (margin * 2);
    const col1Width = tableWidth * 0.5;
    const col2Width = tableWidth * 0.5;

    // Función helper para crear fila con 2 columnas
    const addRow = (label1: string, value1: string, label2: string, value2: string, height: number = 6) => {
      // Columna 1
      pdf.rect(margin, yPos, col1Width, height);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(label1, margin + 1, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value1, margin + 35, yPos + 4);
      
      // Columna 2
      pdf.rect(margin + col1Width, yPos, col2Width, height);
      pdf.setFont('helvetica', 'bold');
      pdf.text(label2, margin + col1Width + 1, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value2, margin + col1Width + 35, yPos + 4);
      
      yPos += height;
    };

    // Función helper para crear fila de una sola columna
    const addFullRow = (label: string, value: string, height: number = 6) => {
      pdf.rect(margin, yPos, tableWidth, height);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(label, margin + 1, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 40, yPos + 4);
      yPos += height;
    };

    // Función para crear header de sección
    const addSectionHeader = (title: string) => {
      pdf.setFillColor(200, 200, 200);
      pdf.rect(margin, yPos, tableWidth, 5, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text(title, margin + 1, yPos + 3.5);
      yPos += 5;
    };

    // ============ DATOS DEL USUARIO ============
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

    addRow(
      'Teléfono Fijo:', 
      caseData.telefono_fijo || '',
      'Instrucción:', 
      caseData.instruccion || ''
    );

    addRow(
      'Etnia:', 
      caseData.etnia || '',
      'Genero:', 
      caseData.genero || ''
    );

    addRow(
      'ESTADO CIVIL:', 
      caseData.estado_civil || '',
      'NRO. DE HIJOS:', 
      caseData.nro_hijos?.toString() || '0'
    );

    addRow(
      'DISCAPACIDAD:', 
      caseData.discapacidad || 'NO',
      'TIPO DE USUARIO:', 
      caseData.tipo_usuario || ''
    );

    // ============ SERVICIOS BRINDADOS ============
    yPos += 1;
    addSectionHeader('SERVICIOS BRINDADOS POR EL CJG-UTMACH');

    addFullRow('LINEA DE SERVICIO / MATERIA:', caseData.materia || '');

    addRow(
      'TIPO DE USUARIO:', 
      caseData.tipo_usuario || '',
      'TEMA:', 
      (caseData.tema || '').substring(0, 35)
    );

    addFullRow('NRO. PROCESO JUDICIAL:', caseData.nro_proceso_judicial_expediente || '');

    // ============ FICHA SOCIOECONÓMICA ============
    if (fichaData) {
      yPos += 1;
      addSectionHeader('FICHA SOCIOECONÓMICA');
      
      // Gastos de Vivienda
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.rect(margin, yPos, tableWidth, 5);
      pdf.text('GASTOS DE VIVIENDA', margin + 1, yPos + 3.5);
      yPos += 5;

      // Tabla de gastos (5 columnas)
      const gastoWidth = tableWidth / 5;
      const gastos = [
        { label: 'LUZ ELÉCTRICA', value: fichaData.gasto_luz || 0 },
        { label: 'ARRIENDO', value: fichaData.gasto_arriendo || 0 },
        { label: 'TELÉFONO', value: fichaData.gasto_telefono || 0 },
        { label: 'INTERNET', value: fichaData.gasto_internet || 0 },
        { label: 'AGUA', value: fichaData.gasto_agua || 0 }
      ];

      // Headers de gastos
      gastos.forEach((gasto, i) => {
        pdf.rect(margin + (gastoWidth * i), yPos, gastoWidth, 4);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6);
        pdf.text(gasto.label, margin + (gastoWidth * i) + gastoWidth/2, yPos + 2.5, { align: 'center' });
      });
      yPos += 4;

      // Valores de gastos
      gastos.forEach((gasto, i) => {
        pdf.rect(margin + (gastoWidth * i), yPos, gastoWidth, 4);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(`$${gasto.value}`, margin + (gastoWidth * i) + gastoWidth/2, yPos + 2.5, { align: 'center' });
      });
      yPos += 4;

      // Bienes del Grupo Familiar
      pdf.rect(margin, yPos, tableWidth, 4);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('BIENES DE GRUPO FAMILIAR', margin + 1, yPos + 2.5);
      yPos += 4;

      const bienWidth = tableWidth / 5;
      const bienes = [
        { label: 'TERRENO', tiene: fichaData.tiene_terreno },
        { label: 'VEHÍCULO', tiene: fichaData.tiene_vehiculo },
        { label: 'NEGOCIO PROPIO', tiene: fichaData.tiene_negocio },
        { label: 'CASA', tiene: fichaData.tiene_casa },
        { label: 'DEPARTAMENTO', tiene: fichaData.tiene_departamento }
      ];

      bienes.forEach((bien, i) => {
        pdf.rect(margin + (bienWidth * i), yPos, bienWidth, 4);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6);
        pdf.text(bien.label, margin + (bienWidth * i) + bienWidth/2, yPos + 2, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.text(bien.tiene ? 'SI' : 'NO', margin + (bienWidth * i) + bienWidth/2, yPos + 3.5, { align: 'center' });
      });
      yPos += 4;

      // Condición Económica
      pdf.rect(margin, yPos, tableWidth, 4);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('CONDICIÓN ECONÓMICA (PERSONAS QUE LABORAN EN LA FAMILIA)', margin + 1, yPos + 2.5);
      yPos += 4;

      const trabajaWidth = tableWidth / 4;
      const trabaja = [
        { label: 'PADRE', value: fichaData.padre_trabaja },
        { label: 'MADRE', value: fichaData.madre_trabaja },
        { label: 'HIJOS', value: false },
        { label: 'OTROS', value: fichaData.otros_trabajan }
      ];

      trabaja.forEach((t, i) => {
        pdf.rect(margin + (trabajaWidth * i), yPos, trabajaWidth, 4);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(t.label, margin + (trabajaWidth * i) + trabajaWidth/2, yPos + 2.5, { align: 'center' });
      });
      yPos += 4;

      trabaja.forEach((t, i) => {
        pdf.rect(margin + (trabajaWidth * i), yPos, trabajaWidth, 3);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(t.value ? '( X )' : '(   )', margin + (trabajaWidth * i) + trabajaWidth/2, yPos + 2, { align: 'center' });
      });
      yPos += 3;

      // Ingresos y Egresos
      addRow(
        'VALORES DE INGRESOS:', 
        `$${fichaData.ingresos_totales || 0}`,
        'VALORES DE EGRESOS:', 
        `$${fichaData.egresos_totales || 0}`,
        5
      );
    }

    // ============ ENCUESTA DE SATISFACCIÓN ============
    yPos += 1;
    addSectionHeader('ENCUESTA DE SATISFACCIÓN');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.rect(margin, yPos, tableWidth, 4);
    pdf.text('FORMULARIO DE EVALUACIÓN A LA SATISFACCIÓN DEL USUARIO EN ASESORÍA BRINDADA', margin + 1, yPos + 2.5);
    yPos += 4;

    // Pregunta 1
    pdf.rect(margin, yPos, tableWidth, 4);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('1.¿Cómo se enteró de los servicios del Consultorio Jurídico Gratuito?', margin + 1, yPos + 2.5);
    yPos += 4;

    const medioWidth = tableWidth / 6;
    const medios = ['AMIGO', 'FAMILIAR', 'PERIÓDICO', 'RADIO', 'PAG. WEB', 'REDES SOCIALES'];
    const medioSeleccionado = translateMedio(data.medio_conocimiento);

    medios.forEach((medio, i) => {
      pdf.rect(margin + (medioWidth * i), yPos, medioWidth, 3.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.text(medio, margin + (medioWidth * i) + medioWidth/2, yPos + 2, { align: 'center' });
      
      // Marcar el seleccionado
      if (medioSeleccionado === medio) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('X', margin + (medioWidth * i) + medioWidth/2, yPos + 2.5, { align: 'center' });
      }
    });
    yPos += 3.5;

    // Teléfono Referido
    if (data.telefono_referido) {
      pdf.rect(margin, yPos, tableWidth, 3.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.5);
      pdf.text('TELF. REFERIDO:', margin + 1, yPos + 2);
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.telefono_referido, margin + 25, yPos + 2);
      yPos += 3.5;
    }

    // Función para crear pregunta con opciones
    const addQuestion = (question: string, selected: string) => {
      pdf.rect(margin, yPos, tableWidth, 3.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.text(question, margin + 1, yPos + 2);
      yPos += 3.5;

      const optWidth = tableWidth / 3;
      const opciones = ['EXCELENTE', 'BUENA:', 'DEFICIENTE:'];
      
      opciones.forEach((opc, i) => {
        pdf.rect(margin + (optWidth * i), yPos, optWidth, 3);
        pdf.text(opc, margin + (optWidth * i) + 2, yPos + 2);
        
        if (selected.toUpperCase() === opc.replace(':', '')) {
          pdf.setFont('helvetica', 'bold');
          pdf.text('X', margin + (optWidth * i) + optWidth - 5, yPos + 2);
          pdf.setFont('helvetica', 'normal');
        }
      });
      yPos += 3;
    };

    // Preguntas 2, 3, 4
    addQuestion('2.¿La información recibida en la asesoría incial fue?', data.informacion_recibida);
    addQuestion('3.¿La orientación brindada tanto por el asesor legal y el estudiante fue?', data.orientacion_brindada);
    addQuestion('4.¿su nivel de satisfacción con la asesoría recibida fue?', data.nivel_satisfaccion);

    // Pregunta 5
    pdf.rect(margin, yPos, tableWidth, 3.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('5.¿Volvería utilizar a los servicios del Consultorio Jurídíco?', margin + 1, yPos + 2);
    yPos += 3.5;

    const sinoWidth = tableWidth / 2;
    pdf.rect(margin, yPos, sinoWidth, 3);
    pdf.text('SI', margin + 2, yPos + 2);
    if (data.volveria_usar) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('X', margin + sinoWidth - 5, yPos + 2);
      pdf.setFont('helvetica', 'normal');
    }

    pdf.rect(margin + sinoWidth, yPos, sinoWidth, 3);
    pdf.text('NO', margin + sinoWidth + 2, yPos + 2);
    if (!data.volveria_usar) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('X', margin + tableWidth - 5, yPos + 2);
    }
    yPos += 3;

    // ============ FIRMA DEL USUARIO ============
    yPos += 2;
    pdf.rect(margin, yPos, tableWidth, 25);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('FIRMA DEL USUARIO', pageWidth / 2, yPos + 3, { align: 'center' });

    // Agregar firma si existe (CENTRADA)
    if (data.firma) {
      try {
        const firmaWidth = 50;
        const firmaHeight = 15;
        const firmaX = (pageWidth - firmaWidth) / 2;  // ✅ Centrar horizontalmente
        const firmaY = yPos + 5;
        
        pdf.addImage(data.firma, 'PNG', firmaX, firmaY, firmaWidth, firmaHeight);
        console.log('✅ Firma agregada al PDF (centrada)');
      } catch (error) {
        console.error('❌ Error al agregar firma:', error);
      }
    }

    // Línea de firma (también centrada)
    const lineWidth = 60;
    const lineX = (pageWidth - lineWidth) / 2;  // ✅ Centrar línea
    pdf.line(lineX, yPos + 22, lineX + lineWidth, yPos + 22);
    
    // Footer
    pdf.setFontSize(6);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPos + 27, { align: 'center' });

    // Guardar PDF
    const pdfName = `Formulario_${cedula}_${Date.now()}.pdf`;
    pdf.save(pdfName);

    console.log('✅ PDF generado con formato de casilleros:', pdfName);
    return pdfName;

  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    throw error;
  }
}

function formatDateForPDF(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function translateMedio(medio: string): string {
  const traducciones: { [key: string]: string } = {
    'amigo': 'AMIGO',
    'familiar': 'FAMILIAR',
    'periodico': 'PERIÓDICO',
    'radio': 'RADIO',
    'pagina_web': 'PAG. WEB',
    'redes_sociales': 'REDES SOCIALES'
  };
  return traducciones[medio] || medio.toUpperCase();
}

async function showSuccessWithQR(cedula: string, nombre: string, modal: HTMLElement) {
  // Mostrar solo mensaje de agradecimiento, SIN QR
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

        <div class="space-y-3">
          <button 
            id="downloadPDFBtn"
            class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Descargar Formulario PDF</span>
          </button>

          <button 
            id="closeSuccessModal"
            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            Cerrar
          </button>
        </div>

        <p class="text-gray-500 text-xs mt-6">
          Consultorio Jurídico Gratuito UTMACH
        </p>
      </div>
    </div>
  `;
  
  // Event listeners
  document.getElementById('downloadPDFBtn')?.addEventListener('click', async () => {
    try {
      // Obtener datos del formulario guardado
      const formData = {
        cedula_usuario: cedula,
        medio_conocimiento: (document.querySelector('input[name="medio"]:checked') as HTMLInputElement)?.value || '',
        telefono_referido: (document.getElementById('telefonoReferido') as HTMLInputElement)?.value || '',
        informacion_recibida: (document.querySelector('input[name="informacion"]:checked') as HTMLInputElement)?.value || '',
        orientacion_brindada: (document.querySelector('input[name="orientacion"]:checked') as HTMLInputElement)?.value || '',
        nivel_satisfaccion: (document.querySelector('input[name="satisfaccion"]:checked') as HTMLInputElement)?.value || '',
        volveria_usar: (document.querySelector('input[name="volveria"]:checked') as HTMLInputElement)?.value === 'true',
        comentarios: (document.getElementById('comentarios') as HTMLTextAreaElement)?.value || '',
        firma: signaturePad?.getDataURL() || ''
      };
      
      await generatePDF(cedula, nombre, formData);
      alert('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al generar el PDF');
    }
  });

  document.getElementById('closeSuccessModal')?.addEventListener('click', () => {
    modal.remove();
    window.location.reload();
  });
}