export const toast = {
    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
      // Remover toast anterior si existe
      const existingToast = document.getElementById('globalToast');
      if (existingToast) {
        existingToast.remove();
      }
  
      const toastContainer = document.createElement('div');
      toastContainer.id = 'globalToast';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        animation: slideInRight 0.3s ease-out;
      `;
  
      const colors = {
        success: 'from-green-500 to-emerald-600',
        error: 'from-red-500 to-rose-600',
        info: 'from-blue-500 to-indigo-600',
        warning: 'from-yellow-500 to-orange-600'
      };
  
      const icons = {
        success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        info: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        warning: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>`
      };
  
      toastContainer.innerHTML = `
        <div class="bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl max-w-md flex items-center space-x-3 backdrop-blur-sm">
          <div class="flex-shrink-0">
            ${icons[type]}
          </div>
          <p class="font-medium">${message}</p>
          <button id="closeToast" class="ml-4 text-white/80 hover:text-white transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
  
      document.body.appendChild(toastContainer);
  
      // Agregar animación CSS si no existe
      if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
          @keyframes slideInRight {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(400px);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
  
      const closeToast = () => {
        toastContainer.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          toastContainer.remove();
        }, 300);
      };
  
      document.getElementById('closeToast')?.addEventListener('click', closeToast);
  
      if (duration > 0) {
        setTimeout(closeToast, duration);
      }
    },
  
    success(message: string, duration?: number) {
      this.show(message, 'success', duration);
    },
  
    error(message: string, duration?: number) {
      this.show(message, 'error', duration);
    },
  
    info(message: string, duration?: number) {
      this.show(message, 'info', duration);
    },
  
    warning(message: string, duration?: number) {
      this.show(message, 'warning', duration);
    },

    confirm(message: string, title: string = 'Confirmación'): Promise<boolean> {
      return new Promise((resolve) => {
        // Remover modal anterior si existe
        const existingModal = document.getElementById('confirmModal');
        if (existingModal) {
          existingModal.remove();
        }
  
        const modalContainer = document.createElement('div');
        modalContainer.id = 'confirmModal';
        modalContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: fadeIn 0.2s ease-out;
        `;
  
        modalContainer.innerHTML = `
          <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all" style="animation: scaleIn 0.3s ease-out;">
            <div class="flex items-center space-x-3 mb-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">${title}</h3>
            </div>
            
            <p class="text-gray-600 mb-6">${message}</p>
            
            <div class="flex space-x-3">
              <button id="confirmCancel" class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition">
                Cancelar
              </button>
              <button id="confirmAccept" class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-semibold rounded-xl transition">
                Confirmar
              </button>
            </div>
          </div>
        `;
  
        // Agregar animaciones CSS si no existen
        if (!document.getElementById('confirmStyles')) {
          const style = document.createElement('style');
          style.id = 'confirmStyles';
          style.textContent = `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from {
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
  
        document.body.appendChild(modalContainer);
  
        const closeModal = (result: boolean) => {
          modalContainer.style.animation = 'fadeOut 0.2s ease-out';
          setTimeout(() => {
            modalContainer.remove();
            resolve(result);
          }, 200);
        };
  
        document.getElementById('confirmAccept')?.addEventListener('click', () => {
          closeModal(true);
        });
  
        document.getElementById('confirmCancel')?.addEventListener('click', () => {
          closeModal(false);
        });
  
        // Cerrar al hacer clic fuera del modal
        modalContainer.addEventListener('click', (e) => {
          if (e.target === modalContainer) {
            closeModal(false);
          }
        });
      });
    }
  };