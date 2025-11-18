import { apiService } from './apiService';
import type { Case } from '../types/Case';
import type { Activity } from '../types/Activity';
import { API_BASE_URL } from '../config/api';

class Database {
  async init(): Promise<void> {
    try {
      console.log('🔄 Verificando conexión al backend...');
      console.log('🌐 URL:', `${API_BASE_URL}/health`);
      
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error('Backend no disponible');
      }
      
      const data = await response.json();
      console.log('✅ Conectado al backend:', data);
    } catch (error) {
      console.error('❌ Error al conectar con el backend:', error);
      throw error;
    }
  }

  // ============= CASOS =============
  
  async addCase(caseData: Case): Promise<Case> {
    return apiService.post<Case>('/api/cases', caseData);
  }

  async getAllCases(): Promise<Case[]> {
    return apiService.get<Case[]>('/api/cases');
  }

  async getCase(cedula: string): Promise<Case> {
    return apiService.get<Case>(`/api/cases/${cedula}`);
  }

  async updateCase(caseData: Case): Promise<Case> {
    return apiService.put<Case>(
      `/api/cases/${caseData.nro_de_cedula_usuario}`,
      caseData
    );
  }

  async deleteCase(cedula: string): Promise<void> {
    return apiService.delete(`/api/cases/${cedula}`);
  }

  // Caso completo con ficha socioeconómica
  async createCompleteCase(data: {
    caseData: Case;
    fichaSocioeconomica?: any;
  }): Promise<Case> {
    return apiService.post<Case>('/api/cases/complete', data);
  }

  async updateCompleteCase(
    cedula: string,
    data: {
      caseData: Case;
      fichaSocioeconomica?: any;
    }
  ): Promise<any> {
    return apiService.put(`/api/cases/${cedula}/complete`, data);
  }

  async getFichaSocioeconomica(cedula: string): Promise<any> {
    return apiService.get(`/api/cases/${cedula}/ficha`);
  }

  // ============= ACTIVIDADES =============
  
  async addActivity(activity: Activity): Promise<Activity> {
    return apiService.post<Activity>('/api/activities', activity);
  }

  async getAllActivities(): Promise<Activity[]> {
    return apiService.get<Activity[]>('/api/activities');
  }

  async updateActivity(activity: Activity): Promise<Activity> {
    return apiService.put<Activity>(
      `/api/activities/${activity.id}`,
      activity
    );
  }

  async deleteActivity(id: number): Promise<void> {
    return apiService.delete(`/api/activities/${id}`);
  }

  async toggleActivityComplete(id: number): Promise<Activity> {
    return apiService.patch<Activity>(`/api/activities/${id}/toggle`);
  }

  // ============= ENCUESTAS =============

  async saveEncuesta(encuesta: any): Promise<any> {
    return apiService.post('/api/encuestas', encuesta);
  }

  async getEncuestasStats(): Promise<any> {
    return apiService.get('/api/encuestas/stats');
  }
}

export const db = new Database();