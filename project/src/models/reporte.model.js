import supabase from '../config/supabase.js';

function normalizarRanking(filas = []) {
  return filas.map((fila) => ({
    nombreProducto: fila.nombre_producto ?? 'Sin nombre',
    totalUnidades: Number(fila.total_unidades) || 0,
  }));
}

export async function fetchDemandaProductosRanking(limite = 3) {
  const [masResult, menosResult] = await Promise.all([
    supabase.rpc('top_productos_mas_solicitados', { p_limite: limite }),
    supabase.rpc('top_productos_menos_solicitados', { p_limite: limite }),
  ]);

  if (masResult.error) throw masResult.error;
  if (menosResult.error) throw menosResult.error;

  return {
    productosMasSolicitados: normalizarRanking(masResult.data),
    productosMenosSolicitados: normalizarRanking(menosResult.data),
  };
}

export async function fetchTopConcesionariasRanking(limite = 10) {
  const { data, error } = await supabase
    .from('reserva')
    .select(`
      id_concesionaria,
      concesionaria(nombre_concesionaria),
      productos_reservados(unidades_reservadas)
    `)
    .eq('estado_reserva', true);

  if (error) throw error;

  const mapa = new Map();
  for (const r of data) {
    const id = r.id_concesionaria;
    if (!id) continue;

    const nombre = r.concesionaria?.nombre_concesionaria ?? 'N/D';
    const unidades = (r.productos_reservados || []).reduce(
      (sum, p) => sum + (Number(p.unidades_reservadas) || 0),
      0
    );

    const entrada = mapa.get(id) ?? {
      nombreConcesionaria: nombre,
      totalUnidades: 0,
      totalReservas: 0
    };
    entrada.totalUnidades += unidades;
    entrada.totalReservas += 1;
    mapa.set(id, entrada);
  }

  return Array.from(mapa.values())
    .sort((a, b) => b.totalUnidades - a.totalUnidades)
    .slice(0, limite);
}

export async function fetchIngresosHoy() {
  const { data, error } = await supabase.rpc('get_ingresos_hoy');

  if (error) throw error;

  return data?.[0]?.ingresos_hoy ?? 0;
}

export async function fetchPromedioIngresosDiarios() {
  const { data, error } = await supabase.rpc('get_promedio_ingresos_diarios');

  if (error) throw error;

  return data?.[0]?.promedio_ingresos_diarios ?? 0;
}

export async function fetchSingleTopConcesionaria() {
  const { data, error } = await supabase.rpc('get_single_top_concesionaria');

  if (error) throw error;

  return data?.[0] ?? {};
}

export async function fetchSingleTopSucursal() {
  const { data, error } = await supabase.rpc('get_single_top_sucursal');

  if (error) throw error;

  return data?.[0] ?? {};
}

export async function fetchPromedioReservasPorDia() {
  const { data, error } = await supabase.rpc('get_promedio_reservas_por_dia_semana');

  if (error) throw error;

  // Garantizar que los 7 días siempre aparezcan aunque no haya datos
  const dias = [
    { dia_semana: 1, nombre_dia: 'Lun' },
    { dia_semana: 2, nombre_dia: 'Mar' },
    { dia_semana: 3, nombre_dia: 'Mié' },
    { dia_semana: 4, nombre_dia: 'Jue' },
    { dia_semana: 5, nombre_dia: 'Vie' },
    { dia_semana: 6, nombre_dia: 'Sáb' },
    { dia_semana: 7, nombre_dia: 'Dom' },
  ];

  const mapa = new Map((data || []).map(d => [d.dia_semana, d]));

  return dias.map(d => ({
    nombreDia: d.nombre_dia,
    promedio: Number(mapa.get(d.dia_semana)?.promedio_reservas) || 0,
  }));
}

export async function fetchReservasPorHora() {
  const { data, error } = await supabase.rpc('get_reservas_por_hora');

  if (error) throw error;

  // Garantizar que las 24 horas siempre aparezcan
  const horas = Array.from({ length: 24 }, (_, i) => i);
  const mapa = new Map((data || []).map(d => [d.hora, d]));

  return horas.map(h => ({
    hora: `${String(h).padStart(2, '0')}:00`,
    total: Number(mapa.get(h)?.total_reservas) || 0,
  }));
}

export async function fetchTopProductosCalificados(limite = 5) {
  const { data, error } = await supabase
    .from('calificar')
    .select('id_producto, puntuacion, producto(nombre_producto, foto_producto)');

  if (error) throw error;

  const mapa = new Map();
  for (const r of data) {
    const id = r.id_producto;
    if (!id) continue;

    const puntuacion = Number(r.puntuacion) || 0;
    const info = mapa.get(id) || {
      nombre: r.producto?.nombre_producto || 'N/D',
      foto: r.producto?.foto_producto,
      suma: 0,
      conteo: 0
    };
    info.suma += puntuacion;
    info.conteo += 1;
    mapa.set(id, info);
  }

  return Array.from(mapa.values())
    .map(item => ({
      ...item,
      promedio: item.conteo > 0 ? (item.suma / item.conteo) : 0
    }))
    .sort((a, b) => b.promedio - a.promedio || b.conteo - a.conteo)
    .slice(0, limite);
}