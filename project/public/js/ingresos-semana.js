(function () {
  const canvas = document.getElementById('chartIngresosSemana');
  if (!canvas) return;

  const datos = JSON.parse(canvas.dataset.chart || '[]');
  if (!datos.length) return;

  const labels = datos.map(function(d) { return d.semana; });
  const valores = datos.map(function(d) { return d.ingresos; });

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ingresos con IVA',
        data: valores,
        backgroundColor: valores.map(function(v, i) {
          return i === valores.length - 1 ? '#93C5E8' : '#2B6398';
        }),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ' $' + ctx.parsed.y.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });
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
            callback: function(v) {
              return '$' + Number(v).toLocaleString('es-MX', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              });
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