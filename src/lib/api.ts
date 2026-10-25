import type { DesignsPayload } from '../types';

/** Data is fetched at runtime from public/data/designs.json (never bundled). */
export async function fetchDesigns(attempt: number): Promise<DesignsPayload> {
  const base = import.meta.env.BASE_URL || '/';
  const url = `${base}data/designs.json${attempt > 0 ? `?retry=${attempt}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la galería (HTTP ${response.status})`);
  }
  const payload = (await response.json()) as DesignsPayload;
  if (!Array.isArray(payload.designs)) {
    throw new Error('El archivo de datos no tiene el formato esperado');
  }
  return payload;
}
