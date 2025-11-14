import type { Case } from '../types/Case';
import type { Activity } from '../types/Activity';

const API_URL = 'http://localhost:3000/api';

class Database {
  async init(): Promise<void> {
    try {
      const response = await fetch('http://localhost:3000/health');
      if (!response.ok) throw new Error('Backend no disponible');
      console.log('Conectado al backend');
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  }

  // Métodos de casos (mantener los existentes)
  async addCase(caseData: Case): Promise<Case> {
    const response = await fetch(`${API_URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear caso');
    }
    return response.json();
  }

  async getAllCases(): Promise<Case[]> {
    const response = await fetch(`${API_URL}/cases`);
    if (!response.ok) throw new Error('Error al obtener casos');
    const data = await response.json();
    return data;
  }

  async updateCase(caseData: Case): Promise<Case> {
    const response = await fetch(`${API_URL}/cases/${caseData.nro_de_cedula_usuario}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    
    if (!response.ok) throw new Error('Error al actualizar caso');
    return response.json();
  }

  async deleteCase(cedula: string): Promise<void> {
    const response = await fetch(`${API_URL}/cases/${cedula}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Error al eliminar caso');
  }

  // Métodos de actividades (NUEVOS)
  async addActivity(activity: Activity): Promise<Activity> {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    
    if (!response.ok) throw new Error('Error al crear actividad');
    return response.json();
  }

  async getAllActivities(): Promise<Activity[]> {
    const response = await fetch(`${API_URL}/activities`);
    if (!response.ok) throw new Error('Error al obtener actividades');
    return response.json();
  }

  async updateActivity(activity: Activity): Promise<Activity> {
    const response = await fetch(`${API_URL}/activities/${activity.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    
    if (!response.ok) throw new Error('Error al actualizar actividad');
    return response.json();
  }

  async deleteActivity(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Error al eliminar actividad');
  }

  async toggleActivityComplete(id: number): Promise<Activity> {
    const response = await fetch(`${API_URL}/activities/${id}/toggle`, {
      method: 'PATCH',
    });
    
    if (!response.ok) throw new Error('Error al actualizar actividad');
    return response.json();
  }
}

export const db = new Database();