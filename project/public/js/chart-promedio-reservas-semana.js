(function () {
  const canvas = document.getElementById('chartPromedioSemana');
  if (!canvas) return;

  const datos = JSON.parse(canvas.dataset.chart || '[]');
  const labels = datos.map(function(d) { return d.nombreDia; });
  const valores = datos.map(function(d) { return d.promedio; });
  const max = Math.max.apply(null, valores);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Promedio de reservas',
        data: valores,
        backgroundColor: valores.map(function(v) {
          return v === max ? '#2B6398' : '#93C5E8';
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
            label: function(ctx) { return ' ' + ctx.parsed.y.toFixed(1) + ' reservas'; }
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
            callback: function(v) { return Number.isInteger(v) ? v : ''; }
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#374151', font: { size: 13, weight: '500' } }
        }
      }
    }
  });
})();