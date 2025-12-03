import type { Case } from '../types/Case';
import type { Activity } from '../types/Activity';
import { db } from '../services/database';
import jsPDF from 'jspdf';

//interface CalendarEvent {
//  date: string;
//  cases: Case[];
//}

let currentDate = new Date();
let allCases: Case[] = [];
let allActivities: Activity[] = [];

export function renderCalendar(): string {
  return `
    <div class="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/40 shadow-2xl">
      <!-- Header del Calendario -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-800 flex items-center">
          <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Calendario de Actividades
        </h3>
        
        <div class="flex space-x-3">
          <!-- Selector de tipo de exportación -->
          <div class="bg-white/70 rounded-lg px-4 py-2 border border-gray-300 flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Exportar:</label>
            <select id="exportType" class="bg-transparent border-none text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer">
              <option value="month">Mes Completo</option>
              <option value="week">Semana Actual</option>
              <option value="day">Día (Por Horas)</option>
            </select>
          </div>
          
          <!-- Botón Exportar PDF -->
          <button id="btnExportPDF" class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Exportar PDF</span>
          </button>
          
          <!-- Botón Nueva Actividad -->
          <button id="btnAddActivity" class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>

      <!-- Navegación del mes -->
      <div class="flex items-center justify-between mb-6 bg-white/40 backdrop-blur-sm rounded-xl p-4">
        <button id="prevMonth" class="p-2 hover:bg-white/50 rounded-lg transition">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h4 id="currentMonth" class="text-xl font-bold text-gray-800"></h4>
        <button id="nextMonth" class="p-2 hover:bg-white/50 rounded-lg transition">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Días de la semana -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Dom</div>
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Lun</div>
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Mar</div>
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Mié</div>
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Jue</div>
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Vie</div>
        <div class="text-center font-semibold text-gray-700 text-sm py-2">Sáb</div>
      </div>

      <!-- Grid del calendario -->
      <div id="calendarGrid" class="grid grid-cols-7 gap-2"></div>

      <!-- Lista de actividades del día seleccionado -->
      <div id="dayActivities" class="mt-6 hidden">
        <div class="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40">
          <h5 class="font-bold text-gray-800 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Actividades de <span id="selectedDate" class="ml-1"></span>
          </h5>
          <div id="activitiesList" class="space-y-2"></div>
        </div>
      </div>
    </div>
  `;
}

export async function initCalendar() {
  try {
    allCases = await db.getAllCases();
    allActivities = await db.getAllActivities();
    renderCalendarGrid();
    setupCalendarEvents();
    
    // ✅ Event listener para exportar PDF con selector
    document.getElementById('btnExportPDF')?.addEventListener('click', () => {
      const exportType = (document.getElementById('exportType') as HTMLSelectElement).value as 'month' | 'week' | 'day';
      
      if (exportType === 'week') {
        showWeekSelector();
      } else if (exportType === 'day') {
        showDaySelector();
      } else {
        exportCalendarToPDF('month');
      }
    });
    
  } catch (error) {
    console.error('Error al inicializar calendario:', error);
  }
}

async function exportCalendarToPDF(mode: 'month' | 'week' | 'day' = 'month', selectedDate?: Date) {
  try {
    console.log(`📄 Generando PDF del calendario (${mode})...`);
    
    const pdf = new jsPDF(mode === 'day' ? 'portrait' : 'landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    const baseDate = selectedDate || currentDate;
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const monthName = monthNames[month];
    
    // ========== MODO: MES ==========
    if (mode === 'month') {
      // ========== HEADER ==========
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CALENDARIO DE ACTIVIDADES', pageWidth / 2, 12, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text(`${monthName} ${year}`, pageWidth / 2, 22, { align: 'center' });
      
      pdf.setFontSize(7);
      pdf.text('Consultorio Jurídico Gratuito UTMACH', 10, 8);
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - 10, 8, { align: 'right' });
      
      // ========== CALENDARIO ==========
      const startY = 38;
      const tableWidth = pageWidth - 20;
      const cellWidth = tableWidth / 7;
      const cellHeight = 18;
      const headerHeight = 7;
      
      // ✅ FRANJA AZUL COMPLETA PARA ENCABEZADOS
      pdf.setFillColor(59, 130, 246);
      pdf.rect(10, startY, tableWidth, headerHeight, 'F');
      
      // Líneas divisorias blancas entre días
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.3);
      for (let i = 1; i < 7; i++) {
        const x = 10 + (cellWidth * i);
        pdf.line(x, startY, x, startY + headerHeight);
      }
      
      // Texto de los días (blanco sobre azul)
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      dayNames.forEach((dayName, i) => {
        const centerX = 10 + (cellWidth * i) + (cellWidth / 2);
        pdf.text(dayName, centerX, startY + 5, { align: 'center' });
      });
      
      // Calcular días del mes
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      let currentRow = 0;
      let currentCol = firstDay;
      
      // Guardar días con actividades
      const daysWithActivities: Array<{
        day: number;
        date: string;
        events: Case[];
        activities: Activity[];
      }> = [];
      
      // Dibujar todos los días
      for (let day = 1; day <= daysInMonth; day++) {
        const x = 10 + (cellWidth * currentCol);
        const y = startY + headerHeight + (cellHeight * currentRow);
        
        // Borde de celda
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.1);
        pdf.rect(x, y, cellWidth, cellHeight);
        
        // Número del día
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(40, 40, 40);
        pdf.text(day.toString(), x + 1.5, y + 4);
        
        // Obtener actividades
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = getEventsForDate(dateStr);
        const dayActivities = getActivitiesForDate(dateStr);
        
        if (dayEvents.length > 0 || dayActivities.length > 0) {
          daysWithActivities.push({ day, date: dateStr, events: dayEvents, activities: dayActivities });
        }
        
        let eventY = y + 7;
        pdf.setFontSize(5.5);
        pdf.setFont('helvetica', 'normal');
        
        const maxEventsInCell = 2;
        let eventCount = 0;
        
        // Casos judiciales
        dayEvents.slice(0, maxEventsInCell).forEach(event => {
          if (eventY < y + cellHeight - 1.5) {
            const eventText = event.nombres_y_apellidos_de_usuario.substring(0, 14);
            pdf.setTextColor(37, 99, 235);
            pdf.text(`• ${eventText}`, x + 1.2, eventY);
            eventY += 2.5;
            eventCount++;
          }
        });
        
        // Actividades personales
        dayActivities.slice(0, maxEventsInCell - eventCount).forEach(activity => {
          if (eventY < y + cellHeight - 1.5) {
            const activityText = activity.titulo.substring(0, 14);
            pdf.setTextColor(147, 51, 234);
            pdf.text(`• ${activityText}`, x + 1.2, eventY);
            eventY += 2.5;
          }
        });
        
        // Indicador "+X más"
        const totalEvents = dayEvents.length + dayActivities.length;
        if (totalEvents > maxEventsInCell && eventY < y + cellHeight - 1.5) {
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(5);
          pdf.text(`+${totalEvents - maxEventsInCell} más`, x + 1.2, eventY);
        }
        
        currentCol++;
        if (currentCol > 6) {
          currentCol = 0;
          currentRow++;
        }
      }
      
      // ========== DETALLE DE ACTIVIDADES ==========
      if (daysWithActivities.length > 0) {
        pdf.addPage();
        
        pdf.setFillColor(37, 99, 235);
        pdf.rect(0, 0, pageWidth, 15, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`DETALLE DE ACTIVIDADES - ${monthName} ${year}`, pageWidth / 2, 10, { align: 'center' });
        
        let detailY = 25;
        pdf.setTextColor(0, 0, 0);
        
        daysWithActivities.forEach((dayData) => {
          const dayDate = new Date(dayData.date + 'T00:00:00');
          const dayName = dayNames[dayDate.getDay()];
          const formattedDate = `${dayName} ${dayData.day} de ${monthName}`;
          
          if (detailY > pageHeight - 40) {
            pdf.addPage();
            detailY = 20;
          }
          
          pdf.setFillColor(240, 240, 250);
          pdf.rect(10, detailY - 5, pageWidth - 20, 8, 'F');
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(37, 99, 235);
          pdf.text(formattedDate.toUpperCase(), 12, detailY);
          detailY += 8;
          
          // Casos
          if (dayData.events.length > 0) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(37, 99, 235);
            pdf.text('📋 CASOS JUDICIALES:', 15, detailY);
            detailY += 6;
            
            dayData.events.forEach((event) => {
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${event.nombres_y_apellidos_de_usuario}`, 20, detailY);
              detailY += 5;
              
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(8);
              pdf.setTextColor(80, 80, 80);
              
              pdf.text(`Materia: ${event.materia}`, 25, detailY);
              detailY += 4;
              pdf.text(`Nro. Proceso: ${event.nro_proceso_judicial_expediente}`, 25, detailY);
              detailY += 4;
              pdf.text(`Estado: ${event.estado_actual}`, 25, detailY);
              detailY += 7;
              
              if (detailY > pageHeight - 30) {
                pdf.addPage();
                detailY = 20;
              }
            });
          }
          
          // Actividades
          if (dayData.activities.length > 0) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(147, 51, 234);
            pdf.text('📅 ACTIVIDADES PROGRAMADAS:', 15, detailY);
            detailY += 6;
            
            dayData.activities.forEach((activity) => {
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(0, 0, 0);
              
              const horaText = activity.hora_actividad ? ` [${activity.hora_actividad}]` : '';
              pdf.text(`• ${activity.titulo}${horaText}`, 20, detailY);
              detailY += 5;
              
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(8);
              pdf.setTextColor(80, 80, 80);
              
              const tipoText = activity.tipo === 'personal' ? 'Personal' : 'Vinculada a Cliente';
              pdf.text(`Tipo: ${tipoText}`, 25, detailY);
              detailY += 4;
              
              if (activity.cedula_cliente) {
                const clientInfo = allCases.find(c => c.nro_de_cedula_usuario === activity.cedula_cliente);
                if (clientInfo) {
                  pdf.text(`Cliente: ${clientInfo.nombres_y_apellidos_de_usuario}`, 25, detailY);
                  detailY += 4;
                }
              }
              
              if (activity.descripcion) {
                const descLines = pdf.splitTextToSize(`Descripción: ${activity.descripcion}`, pageWidth - 55);
                pdf.text(descLines.slice(0, 2), 25, detailY);
                detailY += 4 * Math.min(2, descLines.length);
              }
              
              if (activity.completada) {
                pdf.setTextColor(34, 197, 94);
                pdf.setFont('helvetica', 'bold');
                pdf.text('✓ COMPLETADA', 25, detailY);
              } else {
                pdf.setTextColor(200, 100, 0);
                pdf.text('○ Pendiente', 25, detailY);
              }
              detailY += 7;
              
              if (detailY > pageHeight - 30) {
                pdf.addPage();
                detailY = 20;
              }
            });
          }
          
          detailY += 3;
        });
        
        // Resumen
        if (detailY > pageHeight - 25) {
          pdf.addPage();
          detailY = 20;
        }
        
        pdf.setFillColor(240, 240, 240);
        pdf.rect(10, detailY, pageWidth - 20, 12, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(50, 50, 50);
        pdf.text('RESUMEN DEL MES', 15, detailY + 5);
        
        const totalCasos = daysWithActivities.reduce((sum, d) => sum + d.events.length, 0);
        const totalActividades = daysWithActivities.reduce((sum, d) => sum + d.activities.length, 0);
        const actividadesCompletadas = daysWithActivities.reduce((sum, d) => 
          sum + d.activities.filter(a => a.completada).length, 0
        );
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(`Total de casos judiciales: ${totalCasos}`, 15, detailY + 10);
        pdf.text(`Total de actividades programadas: ${totalActividades}`, pageWidth / 2 - 15, detailY + 10);
        pdf.text(`Actividades completadas: ${actividadesCompletadas}`, pageWidth - 70, detailY + 10);
      }
      
      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Consultorio Jurídico Gratuito - Universidad Técnica de Machala', pageWidth / 2, pageHeight - 5, { align: 'center' });
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 10, pageHeight - 5, { align: 'right' });
      }
      
      const fileName = `Calendario_${monthName}_${year}.pdf`;
      pdf.save(fileName);
    }
    
    // ========== MODO: SEMANA ==========
    else if (mode === 'week') {
      const dayOfWeek = baseDate.getDay();
      const startOfWeek = new Date(baseDate);
      startOfWeek.setDate(baseDate.getDate() - dayOfWeek);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      // Header
      pdf.setFillColor(34, 197, 94);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CALENDARIO SEMANAL', pageWidth / 2, 12, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(
        `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${monthName} ${year}`,
        pageWidth / 2,
        22,
        { align: 'center' }
      );
      
      let yPos = 40;
      
      // Iterar por cada día de la semana
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        const dateStr = currentDay.toISOString().split('T')[0];
        
        const dayEvents = getEventsForDate(dateStr);
        const dayActivities = getActivitiesForDate(dateStr);
        
        // Header del día
        pdf.setFillColor(240, 248, 255);
        pdf.rect(10, yPos, pageWidth - 20, 10, 'F');
        pdf.setTextColor(34, 197, 94);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(
          `${dayNames[currentDay.getDay()]} ${currentDay.getDate()}`,
          15,
          yPos + 7
        );
        yPos += 15;
        
        // Mostrar actividades
        if (dayEvents.length === 0 && dayActivities.length === 0) {
          pdf.setFontSize(9);
          pdf.setTextColor(150, 150, 150);
          pdf.setFont('helvetica', 'italic');
          pdf.text('Sin actividades programadas', 20, yPos);
          yPos += 10;
        } else {
          // Casos
          dayEvents.forEach(event => {
            pdf.setFontSize(10);
            pdf.setTextColor(37, 99, 235);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`📋 ${event.nombres_y_apellidos_de_usuario}`, 20, yPos);
            yPos += 5;
            
            pdf.setFontSize(8);
            pdf.setTextColor(80, 80, 80);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${event.materia} - ${event.nro_proceso_judicial_expediente}`, 25, yPos);
            yPos += 6;
          });
          
          // Actividades
          dayActivities.forEach(activity => {
            const horaText = activity.hora_actividad ? `[${activity.hora_actividad}] ` : '';
            pdf.setFontSize(10);
            pdf.setTextColor(147, 51, 234);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`📅 ${horaText}${activity.titulo}`, 20, yPos);
            yPos += 5;
            
            if (activity.descripcion) {
              pdf.setFontSize(8);
              pdf.setTextColor(80, 80, 80);
              pdf.setFont('helvetica', 'normal');
              const descLines = pdf.splitTextToSize(activity.descripcion, pageWidth - 50);
              pdf.text(descLines.slice(0, 2), 25, yPos);
              yPos += 4 * Math.min(2, descLines.length);
            }
            yPos += 2;
          });
        }
        
        yPos += 5;
        
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
      }
      
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Consultorio Jurídico Gratuito UTMACH', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      const fileName = `Calendario_Semana_${startOfWeek.getDate()}-${endOfWeek.getDate()}_${monthName}_${year}.pdf`;
      pdf.save(fileName);
    }
    
    // ========== MODO: DÍA (POR HORAS) ==========
    else if (mode === 'day') {
      const dateStr = baseDate.toISOString().split('T')[0];
      const dayEvents = getEventsForDate(dateStr);
      const dayActivities = getActivitiesForDate(dateStr);
      
      // Header
      pdf.setFillColor(147, 51, 234);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AGENDA DEL DÍA', pageWidth / 2, 12, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(
        `${dayNames[baseDate.getDay()]} ${baseDate.getDate()} de ${monthName} ${year}`,
        pageWidth / 2,
        24,
        { align: 'center' }
      );
      
      let yPos = 45;
      
      // Crear agenda por horas (7:00 - 20:00)
      const startHour = 7;
      const endHour = 20;
      
      for (let hour = startHour; hour <= endHour; hour++) {
        const hourStr = `${hour.toString().padStart(2, '0')}:00`;
        
        // Línea de hora
        pdf.setDrawColor(200, 200, 200);
        pdf.line(10, yPos, pageWidth - 10, yPos);
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'bold');
        pdf.text(hourStr, 15, yPos + 5);
        
        // Buscar actividades en esta hora
        const hourActivities = dayActivities.filter(a => {
          if (!a.hora_actividad) return false;
          const activityHour = parseInt(a.hora_actividad.split(':')[0]);
          return activityHour === hour;
        });
        
        if (hourActivities.length > 0) {
          let activityY = yPos + 5;
          
          hourActivities.forEach(activity => {
            pdf.setFillColor(245, 240, 255);
            pdf.rect(35, activityY - 3, pageWidth - 50, 12, 'F');
            
            pdf.setFontSize(11);
            pdf.setTextColor(147, 51, 234);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${activity.hora_actividad} - ${activity.titulo}`, 38, activityY + 2);
            
            if (activity.descripcion) {
              pdf.setFontSize(8);
              pdf.setTextColor(80, 80, 80);
              pdf.setFont('helvetica', 'normal');
              const desc = activity.descripcion.substring(0, 80);
              pdf.text(desc, 38, activityY + 7);
            }
            
            activityY += 15;
          });
          
          yPos = activityY + 5;
        } else {
          yPos += 15;
        }
        
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }
      }
      
      // Actividades sin hora definida
      const noTimeActivities = dayActivities.filter(a => !a.hora_actividad);
      const allDayEvents = dayEvents;
      
      if (noTimeActivities.length > 0 || allDayEvents.length > 0) {
        yPos += 10;
        pdf.setFillColor(255, 250, 230);
        pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(150, 100, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ACTIVIDADES SIN HORA ESPECÍFICA / TODO EL DÍA', 15, yPos + 5);
        yPos += 12;
        
        allDayEvents.forEach(event => {
          pdf.setFontSize(10);
          pdf.setTextColor(37, 99, 235);
          pdf.text(`📋 ${event.nombres_y_apellidos_de_usuario} - ${event.materia}`, 15, yPos);
          yPos += 6;
        });
        
        noTimeActivities.forEach(activity => {
          pdf.setFontSize(10);
          pdf.setTextColor(147, 51, 234);
          pdf.text(`📅 ${activity.titulo}`, 15, yPos);
          yPos += 6;
        });
      }
      
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Consultorio Jurídico Gratuito UTMACH', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      const fileName = `Agenda_${baseDate.getDate()}_${monthName}_${year}.pdf`;
      pdf.save(fileName);
    }

    console.log('✅ PDF generado exitosamente');
    showSuccessMessage(`Calendario exportado (${mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Día'})`);
    
  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    alert('Error al generar el PDF del calendario');
  }
}

// Función auxiliar para mostrar mensaje de éxito
function showSuccessMessage(message: string) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
  toast.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Mostrar selector de semana
function showWeekSelector() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Seleccionar Semana</h3>
      <p class="text-sm text-gray-600 mb-4">Selecciona una fecha para exportar la semana completa</p>
      
      <input 
        type="date" 
        id="weekDatePicker"
        value="${currentDate.toISOString().split('T')[0]}"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
      />
      
      <div class="flex space-x-3">
        <button id="confirmWeek" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          Exportar Semana
        </button>
        <button id="cancelWeek" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('confirmWeek')?.addEventListener('click', () => {
    const dateInput = document.getElementById('weekDatePicker') as HTMLInputElement;
    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    modal.remove();
    exportCalendarToPDF('week', selectedDate);
  });
  
  document.getElementById('cancelWeek')?.addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Mostrar selector de día
function showDaySelector() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Seleccionar Día</h3>
      <p class="text-sm text-gray-600 mb-4">Selecciona una fecha para ver las actividades por horas</p>
      
      <input 
        type="date" 
        id="dayDatePicker"
        value="${currentDate.toISOString().split('T')[0]}"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
      />
      
      <div class="flex space-x-3">
        <button id="confirmDay" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          Exportar Día
        </button>
        <button id="cancelDay" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('confirmDay')?.addEventListener('click', () => {
    const dateInput = document.getElementById('dayDatePicker') as HTMLInputElement;
    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    modal.remove();
    exportCalendarToPDF('day', selectedDate);
  });
  
  document.getElementById('cancelDay')?.addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function renderCalendarGrid() {
  const grid = document.getElementById('calendarGrid');
  const monthLabel = document.getElementById('currentMonth');
  
  if (!grid || !monthLabel) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  monthLabel.textContent = currentDate.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = '';

  // Días vacíos al inicio
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="aspect-square"></div>';
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventsCount = getEventsCountForDate(dateStr); // MODIFICADO
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isPast = new Date(dateStr) < today && !isToday;

    html += `
      <div 
        data-date="${dateStr}" 
        class="calendar-day aspect-square p-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isToday 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-2 ring-blue-400' 
            : isPast 
              ? 'bg-white/20 hover:bg-white/30' 
              : 'bg-white/40 hover:bg-white/60'
        } ${eventsCount > 0 ? 'ring-2 ring-yellow-400' : ''}"
      >
        <div class="flex flex-col h-full">
          <span class="text-sm font-semibold ${isToday ? 'text-white' : 'text-gray-800'}">${day}</span>
          ${eventsCount > 0 ? `
            <div class="mt-1 flex-1 flex items-end">
              <span class="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                ${eventsCount}
              </span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

// NUEVA FUNCIÓN: Contar eventos combinados
function getEventsCountForDate(dateStr: string): number {
  const casesCount = allCases.filter(c => {
    if (!c.fecha_de_proxima_actividad) return false;
    const eventDate = c.fecha_de_proxima_actividad.split('T')[0];
    return eventDate === dateStr;
  }).length;

  const activitiesCount = allActivities.filter(a => {
    const activityDate = a.fecha_actividad.split('T')[0];
    return activityDate === dateStr;
  }).length;

  return casesCount + activitiesCount;
}

function getEventsForDate(dateStr: string): Case[] {
  return allCases.filter(c => {
    if (!c.fecha_de_proxima_actividad) return false;
    const eventDate = c.fecha_de_proxima_actividad.split('T')[0];
    return eventDate === dateStr;
  });
}

// NUEVA FUNCIÓN: Obtener actividades para una fecha
function getActivitiesForDate(dateStr: string): Activity[] {
  return allActivities.filter(a => {
    const activityDate = a.fecha_actividad.split('T')[0];
    return activityDate === dateStr;
  });
}

function setupCalendarEvents() {
  // Navegación de meses
  document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendarGrid();
    setupDayClickEvents();
  });

  document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendarGrid();
    setupDayClickEvents();
  });

  document.getElementById('btnAddActivity')?.addEventListener('click', () => {
    showAddActivityModal();
  });

  setupDayClickEvents();
}

function setupDayClickEvents() {
  document.querySelectorAll('.calendar-day').forEach(dayEl => {
    dayEl.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const date = target.dataset.date!;
      showDayActivities(date);
    });
  });
}

// MODIFICAR FUNCIÓN: Mostrar actividades del día combinadas
function showDayActivities(dateStr: string) {
  const container = document.getElementById('dayActivities');
  const dateLabel = document.getElementById('selectedDate');
  const list = document.getElementById('activitiesList');

  if (!container || !dateLabel || !list) return;

  const events = getEventsForDate(dateStr);
  const activities = getActivitiesForDate(dateStr); // NUEVO
  const date = new Date(dateStr + 'T00:00:00');

  dateLabel.textContent = date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (events.length === 0 && activities.length === 0) {
    list.innerHTML = '<p class="text-gray-500 text-sm">No hay actividades programadas</p>';
  } else {
    let html = '';

    // Mostrar actividades de casos
    if (events.length > 0) {
      html += '<h6 class="text-xs font-semibold text-gray-500 uppercase mb-2">Actividades de Casos</h6>';
      html += events.map(evento => `
        <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/60 mb-2">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-1">
                <svg class="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-xs text-gray-500">Caso Judicial</span>
              </div>
              <h6 class="font-semibold text-gray-800">${evento.nombres_y_apellidos_de_usuario}</h6>
              <p class="text-sm text-gray-600">${evento.materia}</p>
              <p class="text-sm text-gray-600">${evento.juez_fiscal}</p>
              <p class="text-xs text-gray-500 mt-1">Exp: ${evento.nro_proceso_judicial_expediente}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(evento.estado_actual)}">
              ${evento.estado_actual}
            </span>
          </div>
        </div>
      `).join('');
    }

    // Mostrar actividades personales
    if (activities.length > 0) {
      html += '<h6 class="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">Actividades Personales</h6>';
      html += activities.map(activity => {
        const clientInfo = activity.cedula_cliente 
          ? allCases.find(c => c.nro_de_cedula_usuario === activity.cedula_cliente)
          : null;

        return `
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm rounded-lg p-3 border border-purple-200 mb-2">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center mb-1">
                  <svg class="w-4 h-4 mr-1 ${activity.tipo === 'personal' ? 'text-purple-600' : 'text-indigo-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-xs ${activity.tipo === 'personal' ? 'text-purple-600' : 'text-indigo-600'} font-medium">
                    ${activity.tipo === 'personal' ? 'Personal' : 'Vinculada a Cliente'}
                  </span>
                </div>
                <h6 class="font-semibold text-gray-800">${activity.titulo}</h6>
                ${activity.hora_actividad ? `
                  <p class="text-xs text-gray-500 mt-1">⏰ ${activity.hora_actividad}</p>
                ` : ''}
                ${activity.descripcion ? `
                  <p class="text-sm text-gray-600 mt-1">${activity.descripcion}</p>
                ` : ''}
                ${clientInfo ? `
                  <p class="text-xs text-gray-500 mt-1">👤 ${clientInfo.nombres_y_apellidos_de_usuario}</p>
                ` : ''}
              </div>
              <div class="flex flex-col items-end space-y-2">
                <button 
                    onclick="editActivity(${activity.id})" 
                    class="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    title="Editar actividad"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    onclick="toggleActivity(${activity.id})" 
                    class="p-1.5 rounded-lg transition ${activity.completada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'}"
                    title="${activity.completada ? 'Marcar como pendiente' : 'Marcar como completada'}"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button 
                    onclick="deleteActivity(${activity.id})" 
                    class="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                    title="Eliminar actividad"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            ${activity.completada ? '<span class="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">✓ Completada</span>' : ''}
          </div>
        `;
      }).join('');
    }

    list.innerHTML = html;
  }

  container.classList.remove('hidden');
}

function getStatusColor(estado: string): string {
  if (!estado) return 'bg-gray-100 text-gray-800';
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('activo')) return 'bg-green-100 text-green-800';
  if (estadoLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
  if (estadoLower.includes('finalizado') || estadoLower.includes('cerrado')) return 'bg-gray-100 text-gray-800';
  return 'bg-blue-100 text-blue-800';
}

// FUNCIONES GLOBALES NUEVAS
(window as any).toggleActivity = async (id: number) => {
  try {
    await db.toggleActivityComplete(id);
    allActivities = await db.getAllActivities();
    renderCalendarGrid();
    setupDayClickEvents();
    
    // Recargar vista del día si está abierta
    const container = document.getElementById('dayActivities');
    if (container && !container.classList.contains('hidden')) {
      const selectedDate = document.getElementById('selectedDate')?.textContent;
      if (selectedDate) {
        const dateMatch = selectedDate.match(/\d{1,2} de \w+ de \d{4}/);
        if (dateMatch) {
          // Recargar la vista actual
          const currentDayEl = document.querySelector('.calendar-day[data-date]') as HTMLElement;
          if (currentDayEl) {
            showDayActivities(currentDayEl.dataset.date!);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    alert('Error al actualizar la actividad');
  }
};

(window as any).deleteActivity = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
  
  try {
    await db.deleteActivity(id);
    allActivities = await db.getAllActivities();
    renderCalendarGrid();
    setupDayClickEvents();
    
    // Recargar vista del día
    const container = document.getElementById('dayActivities');
    if (container && !container.classList.contains('hidden')) {
      container.classList.add('hidden');
    }
    
    alert('Actividad eliminada exitosamente');
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    alert('Error al eliminar la actividad');
  }
};

(window as any).editActivity = async (id: number) => {
  try {
    const activity = allActivities.find(a => a.id === id);
    if (!activity) {
      alert('Actividad no encontrada');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'editActivityModal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    const clientInfo = activity.cedula_cliente 
      ? allCases.find(c => c.nro_de_cedula_usuario === activity.cedula_cliente)
      : null;

    modal.innerHTML = `
      <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/40">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Editar Actividad</h3>
          <button id="closeEditModal" class="p-2 hover:bg-gray-200 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form id="editActivityForm" class="space-y-4">
          <!-- Tipo (solo lectura) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Actividad</label>
            <input 
              type="text" 
              value="${activity.tipo === 'personal' ? 'Personal' : 'Vinculada a Cliente'}"
              disabled
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
            />
          </div>

          ${activity.tipo === 'cliente' && clientInfo ? `
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <input 
                type="text" 
                value="${clientInfo.nombres_y_apellidos_de_usuario}"
                disabled
                class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
              />
            </div>
          ` : ''}

          <!-- Título -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input 
              type="text" 
              id="editTitle"
              value="${activity.titulo}"
              required 
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Fecha y hora -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input 
                type="date" 
                id="editDate" 
                value="${activity.fecha_actividad}"
                required 
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input 
                type="time" 
                id="editTime"
                value="${activity.hora_actividad || ''}"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Juez (NUEVO) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Juez (opcional)</label>
            <input 
              type="text" 
              id="editJuez"
              value="${activity.juez || ''}"
              placeholder="Nombre del juez..."
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Este campo no se guarda en la base de datos</p>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              id="editDescription" 
              rows="3" 
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles adicionales..."
            >${activity.descripcion || ''}</textarea>
          </div>

          <div class="flex space-x-3 pt-2">
            <button 
              type="submit" 
              class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Guardar Cambios
            </button>
            <button 
              type="button" 
              id="cancelEditModal"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    document.getElementById('closeEditModal')?.addEventListener('click', closeModal);
    document.getElementById('cancelEditModal')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.getElementById('editActivityForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const updatedActivity = {
        titulo: (document.getElementById('editTitle') as HTMLInputElement).value,
        fecha_actividad: (document.getElementById('editDate') as HTMLInputElement).value,
        hora_actividad: (document.getElementById('editTime') as HTMLInputElement).value || undefined,
        descripcion: (document.getElementById('editDescription') as HTMLTextAreaElement).value || undefined,
        juez: (document.getElementById('editJuez') as HTMLInputElement).value || undefined, // ✅ Campo local
      };

      try {
        await db.updateActivity(id, updatedActivity);
        
        // Actualizar el array local con el juez
        const activityIndex = allActivities.findIndex(a => a.id === id);
        if (activityIndex !== -1) {
          allActivities[activityIndex] = { ...allActivities[activityIndex], ...updatedActivity };
        }
        
        alert('Actividad actualizada exitosamente');
        closeModal();
        
        allActivities = await db.getAllActivities();
        renderCalendarGrid();
        setupDayClickEvents();
        
        const container = document.getElementById('dayActivities');
        if (container && !container.classList.contains('hidden')) {
          const currentDayEl = document.querySelector('.calendar-day[data-date]') as HTMLElement;
          if (currentDayEl) {
            showDayActivities(currentDayEl.dataset.date!);
          }
        }
      } catch (error) {
        console.error('Error al actualizar actividad:', error);
        alert('Error al actualizar la actividad');
      }
    });

  } catch (error) {
    console.error('Error al editar actividad:', error);
    alert('Error al cargar la actividad');
  }
};

function showAddActivityModal() {
  const modal = document.createElement('div');
  modal.id = 'activityModal';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/40">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800">Nueva Actividad</h3>
        <button id="closeModal" class="p-2 hover:bg-gray-200 rounded-lg transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form id="activityForm" class="space-y-4">
        <!-- Tipo de actividad -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Actividad</label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input type="radio" name="tipo" value="personal" checked class="mr-2">
              <span>Personal</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="tipo" value="cliente" class="mr-2">
              <span>Vinculada a Cliente</span>
            </label>
          </div>
        </div>

        <!-- Selector de cliente (oculto por defecto) -->
        <div id="clientSelectDiv" class="hidden">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select id="clientSelect" class="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Seleccionar cliente...</option>
            ${allCases.map(c => `
              <option value="${c.nro_de_cedula_usuario}">
                ${c.nombres_y_apellidos_de_usuario} - ${c.nro_de_cedula_usuario}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Título -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input 
            type="text" 
            id="activityTitle"
            required 
            placeholder="Ej: Reunión con cliente, Audiencia, Revisión de documentos..."
            class="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Fecha y hora -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
            <input 
              type="date" 
              id="activityDate" 
              required 
              class="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input 
              type="time" 
              id="activityTime"
              class="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea 
            id="activityDescription" 
            rows="3" 
            class="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Detalles adicionales..."
          ></textarea>
        </div>

        <div class="flex space-x-3 pt-2">
          <button 
            type="submit" 
            class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Guardar
          </button>
          <button 
            type="button" 
            id="cancelModal"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Mostrar/ocultar selector de cliente
  const tipoInputs = document.querySelectorAll('input[name="tipo"]');
  const clientDiv = document.getElementById('clientSelectDiv')!;
  const clientSelect = document.getElementById('clientSelect') as HTMLSelectElement;

  tipoInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (value === 'cliente') {
        clientDiv.classList.remove('hidden');
        clientSelect.required = true;
      } else {
        clientDiv.classList.add('hidden');
        clientSelect.required = false;
      }
    });
  });

  // Cerrar modal
  const closeModal = () => modal.remove();

  document.getElementById('closeModal')?.addEventListener('click', closeModal);
  document.getElementById('cancelModal')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Submit form
  document.getElementById('activityForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tipo = (document.querySelector('input[name="tipo"]:checked') as HTMLInputElement).value as 'personal' | 'cliente';
    const titulo = (document.getElementById('activityTitle') as HTMLInputElement).value;
    const fecha = (document.getElementById('activityDate') as HTMLInputElement).value;
    const hora = (document.getElementById('activityTime') as HTMLInputElement).value;
    const descripcion = (document.getElementById('activityDescription') as HTMLTextAreaElement).value;
    const cedula = tipo === 'cliente' ? clientSelect.value : undefined;

    try {
      const newActivity = {
        titulo,
        descripcion: descripcion || undefined,
        fecha_actividad: fecha,
        hora_actividad: hora || undefined,
        tipo,
        completada: false,
        cedula_cliente: cedula,
      };

      await db.addActivity(newActivity);
      
      alert('Actividad guardada exitosamente');
      closeModal();
      
      // Recargar datos
      allCases = await db.getAllCases();
      allActivities = await db.getAllActivities();
      renderCalendarGrid();
      setupDayClickEvents();
      
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      alert('Error al guardar la actividad');
    }
  });
}