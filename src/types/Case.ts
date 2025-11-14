export interface Case {
  nro_de_cedula_usuario: string;  // Ahora es la clave primaria
  fecha: string;
  gestion: string;
  nombres_y_apellidos_de_usuario: string;
  fecha_de_nacimiento: string;
  nro_proceso_judicial_expediente: string;
  telefono: string;
  materia: string;
  tipo_de_proceso: string;
  parte_actor_demandado: 'ACTOR' | 'DEMANDADO';
  juez_fiscal: string;
  juez_fiscal_1?: string;
  contraparte: string;
  actividades_realizadas: string;
  estado_actual: string;
  fecha_de_proxima_actividad: string;
}