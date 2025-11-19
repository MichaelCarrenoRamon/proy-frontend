import QRCode from 'qrcode';

/**
 * Genera y muestra un modal con código QR para acceder a la encuesta
 * @param cedula - Cédula del usuario
 * @param nombre - Nombre del usuario
 */
export async function showQRModal(cedula: string, nombre: string) {
  // Crear modal
  const modal = document.createElement('div');
  modal.id = 'qrModal';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">📱 Código QR de Encuesta</h2>
            <p class="text-blue-100 text-sm mt-1">${nombre}</p>
          </div>
          <button id="closeQRModal" class="p-2 hover:bg-white/20 rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido -->
      <div class="p-6">
        <!-- Estado de carga -->
        <div id="qrLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- QR Code (oculto inicialmente) -->
        <div id="qrContent" class="hidden text-center">
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <canvas id="qrCanvas" class="mx-auto"></canvas>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-700 mb-2">
              <strong>📋 Instrucciones:</strong>
            </p>
            <ol class="text-xs text-gray-600 text-left space-y-1 ml-4">
              <li>1. Escanee el código QR con su teléfono</li>
              <li>2. Complete la encuesta de satisfacción</li>
              <li>3. Firme digitalmente al finalizar</li>
            </ol>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p class="text-xs text-gray-600">
              <strong>Cédula:</strong> ${cedula}<br>
              <strong>Usuario:</strong> ${nombre}
            </p>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col gap-3">
            <button 
              id="downloadQRBtn"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              ⬇️ Descargar QR como Imagen
            </button>
            
            <button 
              id="printQRBtn"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              🖨️ Imprimir QR
            </button>

            <button 
              id="copyLinkBtn"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              📋 Copiar Enlace
            </button>
          </div>
        </div>

        <!-- Error (oculto inicialmente) -->
        <div id="qrError" class="hidden text-center py-8">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Error al generar QR</h3>
          <p class="text-gray-600 text-sm mb-4" id="qrErrorMessage"></p>
          <button 
            id="retryQRBtn"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Generar QR
  await generateQR(cedula, nombre, modal);

  // Event Listeners
  setupQRModalListeners(modal, cedula, nombre);
}

/**
 * Genera el código QR con la URL de la encuesta
 */
async function generateQR(cedula: string, nombre: string, modal: HTMLElement) {
  try {
    console.log('🔄 Generando código QR...');

    // URL pública de la encuesta (sin autenticación)
    // Ajusta esta URL según tu configuración
    const surveyURL = `${window.location.origin}/encuesta?cedula=${encodeURIComponent(cedula)}&nombre=${encodeURIComponent(nombre)}`;
    
    console.log('🔗 URL de encuesta:', surveyURL);

    const canvas = document.getElementById('qrCanvas') as HTMLCanvasElement;
    
    if (!canvas) {
      throw new Error('Canvas no encontrado');
    }

    // Generar QR Code
    await QRCode.toCanvas(canvas, surveyURL, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1e40af',  // Azul oscuro
        light: '#ffffff'  // Blanco
      },
      errorCorrectionLevel: 'M'
    });

    // Ocultar loading y mostrar contenido
    document.getElementById('qrLoading')?.classList.add('hidden');
    document.getElementById('qrContent')?.classList.remove('hidden');

    console.log('✅ Código QR generado exitosamente');

  } catch (error: any) {
    console.error('❌ Error al generar QR:', error);
    showQRError(modal, error.message || 'Error desconocido');
  }
}

/**
 * Muestra mensaje de error en el modal
 */
function showQRError(modal: HTMLElement, message: string) {
  document.getElementById('qrLoading')?.classList.add('hidden');
  document.getElementById('qrContent')?.classList.add('hidden');
  
  const errorDiv = document.getElementById('qrError');
  const errorMessage = document.getElementById('qrErrorMessage');
  
  if (errorDiv && errorMessage) {
    errorDiv.classList.remove('hidden');
    errorMessage.textContent = message;
  }
}

/**
 * Configura todos los event listeners del modal
 */
function setupQRModalListeners(modal: HTMLElement, cedula: string, nombre: string) {
  // Cerrar modal
  document.getElementById('closeQRModal')?.addEventListener('click', () => {
    modal.remove();
  });

  // Cerrar al hacer clic en el fondo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Descargar QR como imagen
  document.getElementById('downloadQRBtn')?.addEventListener('click', () => {
    downloadQRImage(cedula);
  });

  // Imprimir QR
  document.getElementById('printQRBtn')?.addEventListener('click', () => {
    printQR(cedula, nombre);
  });

  // Copiar enlace
  document.getElementById('copyLinkBtn')?.addEventListener('click', () => {
    copyLinkToClipboard(cedula, nombre);
  });

  // Reintentar generación
  document.getElementById('retryQRBtn')?.addEventListener('click', async () => {
    document.getElementById('qrError')?.classList.add('hidden');
    document.getElementById('qrLoading')?.classList.remove('hidden');
    await generateQR(cedula, nombre, modal);
  });
}

/**
 * Descarga el código QR como imagen PNG
 */
function downloadQRImage(cedula: string) {
  try {
    const canvas = document.getElementById('qrCanvas') as HTMLCanvasElement;
    
    if (!canvas) {
      throw new Error('Canvas no encontrado');
    }

    // Convertir canvas a blob y descargar
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Error al crear blob');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_Encuesta_${cedula}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ QR descargado como imagen');
    });

  } catch (error) {
    console.error('❌ Error al descargar QR:', error);
    alert('Error al descargar el código QR');
  }
}

/**
 * Imprime el código QR
 */
function printQR(cedula: string, nombre: string) {
  try {
    const canvas = document.getElementById('qrCanvas') as HTMLCanvasElement;
    
    if (!canvas) {
      throw new Error('Canvas no encontrado');
    }

    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('No se pudo abrir ventana de impresión');
    }

    const qrDataURL = canvas.toDataURL('image/png');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Código QR - Encuesta de Satisfacción</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
              margin: 0;
            }
            h1 {
              color: #1e40af;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .info {
              margin: 20px 0;
              font-size: 14px;
              color: #4b5563;
            }
            .qr-container {
              margin: 30px auto;
              max-width: 300px;
            }
            img {
              width: 100%;
              height: auto;
            }
            .instructions {
              margin-top: 30px;
              text-align: left;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
              font-size: 12px;
              color: #6b7280;
            }
            .instructions ol {
              padding-left: 20px;
            }
            .instructions li {
              margin-bottom: 8px;
            }
            .footer {
              margin-top: 40px;
              font-size: 11px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>CONSULTORIO JURÍDICO GRATUITO UTMACH</h1>
          <h2 style="color: #4b5563; font-size: 18px;">Encuesta de Satisfacción</h2>
          
          <div class="info">
            <strong>Usuario:</strong> ${nombre}<br>
            <strong>Cédula:</strong> ${cedula}
          </div>

          <div class="qr-container">
            <img src="${qrDataURL}" alt="Código QR">
          </div>

          <div class="instructions">
            <strong>📋 Instrucciones:</strong>
            <ol>
              <li>Escanee el código QR con la cámara de su teléfono</li>
              <li>Complete la encuesta de satisfacción</li>
              <li>Firme digitalmente al finalizar</li>
            </ol>
          </div>

          <div class="footer">
            Universidad Técnica de Machala<br>
            Facultad de Ciencias Sociales - Carrera de Derecho<br>
            Generado el ${new Date().toLocaleDateString('es-EC')} a las ${new Date().toLocaleTimeString('es-EC')}
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    console.log('✅ Ventana de impresión abierta');

  } catch (error) {
    console.error('❌ Error al imprimir QR:', error);
    alert('Error al imprimir el código QR');
  }
}

/**
 * Copia el enlace de la encuesta al portapapeles
 */
async function copyLinkToClipboard(cedula: string, nombre: string) {
  try {
    const surveyURL = `${window.location.origin}/encuesta?cedula=${encodeURIComponent(cedula)}&nombre=${encodeURIComponent(nombre)}`;
    
    await navigator.clipboard.writeText(surveyURL);
    
    // Feedback visual
    const btn = document.getElementById('copyLinkBtn');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✅ ¡Enlace copiado!';
      btn.classList.add('bg-green-600', 'hover:bg-green-700');
      btn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
        btn.classList.add('bg-gray-600', 'hover:bg-gray-700');
      }, 2000);
    }

    console.log('✅ Enlace copiado al portapapeles');

  } catch (error) {
    console.error('❌ Error al copiar enlace:', error);
    alert('Error al copiar el enlace. Por favor, intente nuevamente.');
  }
}

/**
 * Genera un código QR como Data URL (útil para otros componentes)
 * @returns Data URL del código QR generado
 */
export async function generateQRDataURL(cedula: string, nombre: string): Promise<string> {
  const surveyURL = `${window.location.origin}/#encuesta?cedula=${encodeURIComponent(cedula)}&nombre=${encodeURIComponent(nombre)}`;
  
  return await QRCode.toDataURL(surveyURL, {
    width: 280,
    margin: 2,
    color: {
      dark: '#1e40af',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });
}