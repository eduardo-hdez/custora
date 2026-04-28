(function () {
  const canvas = document.getElementById('chartComparativaProductos');
  if (!canvas) return;

  const payload = JSON.parse(canvas.dataset.chart || '{}');
  const mas = Array.isArray(payload.productosMasSolicitados) ? payload.productosMasSolicitados : [];
  const menos = Array.isArray(payload.productosMenosSolicitados) ? payload.productosMenosSolicitados : [];

  const etiquetasMas = mas.map(function (p) { return p.nombreProducto; });
  const etiquetasMenos = menos.map(function (p) { return p.nombreProducto; });
  const labels = etiquetasMas.concat(etiquetasMenos);

  const valoresMas = mas.map(function (p) { return Number(p.totalUnidades) || 0; });
  const valoresMenos = menos.map(function (p) { return -1 * (Number(p.totalUnidades) || 0); });
  const valores = valoresMas.concat(valoresMenos);

  const colores = valores.map(function (valor) {
    return valor >= 0 ? '#2B6398' : '#93C5E8';
  });

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Unidades solicitadas',
        data: valores,
        backgroundColor: colores,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (chartContext) {
              const valor = Math.abs(chartContext.parsed.y);
              return ' ' + valor + ' reservas';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#F3F4F6' },
          ticks: {
            color: '#6B7280',
            font: { size: 12 },
            callback: function (value) {
              if (!Number.isInteger(value)) return '';
              return Math.abs(value);
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#374151', font: { size: 11, weight: '500' } }
        }
      }
    }
  });
})();
