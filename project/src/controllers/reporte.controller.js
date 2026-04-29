import {
  fetchDemandaProductosRanking,
  fetchTopConcesionariasRanking,
  fetchIngresosHoy,
  fetchPromedioIngresosDiarios,
  fetchSingleTopConcesionaria,
  fetchSingleTopSucursal,
  fetchPromedioReservasPorDia,
  fetchReservasPorHora,
  fetchTopProductosCalificados,
  fetchPesoAcumulado,
  fetchReservasPorSucursal,
  fetchProductosPorSucursal,
  fetchIngresosPorSemana
} from '../models/reporte.model.js';

export async function renderReporte(request, response) {
  const base = {
    title: 'Reporte de Reservas',
    fechaActualizacion: new Date(),
  };

  try {
    const [demanda, topConcesionarias, ingresosHoy, promedioIngresosDiarios, singleTopConcesionaria, singleTopSucursal, promedioReservasPorDia, reservasPorHora, mejoresProductos,pesoAcumulado,
      reservasPorSucursal,productosPorSucursal,ingresosPorSemana] = await Promise.all([
      fetchDemandaProductosRanking(3),
      fetchTopConcesionariasRanking(5),
      fetchIngresosHoy(),
      fetchPromedioIngresosDiarios(),
      fetchSingleTopConcesionaria(),
      fetchSingleTopSucursal(),
      fetchPromedioReservasPorDia(),
      fetchReservasPorHora(),
      fetchTopProductosCalificados(5),
      fetchPesoAcumulado(),
      fetchReservasPorSucursal(),
      fetchProductosPorSucursal(),
      fetchIngresosPorSemana(),
    ]);

    const sinReservas = topConcesionarias.length === 0 && (demanda.productosMasSolicitados?.length === 0);

    const renderData = {
      ...base,
      errorReporte: null,
      infoReporte: sinReservas ? 'Actualmente no existen reservas en la campaña seleccionada. Las métricas se actualizarán cuando se registren nuevas reservas.' : null,
      ...demanda,
      topConcesionarias,
      ingresosHoy,
      promedioIngresosDiarios,
      singleTopConcesionaria,
      singleTopSucursal,
      promedioReservasPorDia,
      reservasPorHora,
      pesoAcumulado,
      reservasPorSucursal,
      productosPorSucursal,
      ingresosPorSemana,
      mejoresProductos: mejoresProductos || []
    };

    return response.render('empleado/reporte', renderData);
  } catch (error) {
    console.error('[reporte] Error al generar el reporte:', error);

    return response.status(500).render('empleado/reporte', {
      ...base,
      errorReporte: 'Lo siento. No se pudieron recuperar los datos o generar el reporte en este momento. Por favor, intenta más tarde.',
      infoReporte: null,
      productosMasSolicitados: [],
      productosMenosSolicitados: [],
      topConcesionarias: [],
      ingresosHoy: 0,
      promedioIngresosDiarios: 0,
      singleTopConcesionaria: {},
      singleTopSucursal: {},
      promedioReservasPorDia: [],
      reservasPorHora: [],
      mejoresProductos: [],
      pesoAcumulado: 0,
      reservasPorSucursal:[],
      productosPorSucursal:[],
      ingresosPorSemana: []
    });
  }
}
