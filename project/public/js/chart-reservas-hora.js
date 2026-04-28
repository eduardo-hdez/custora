(function () {
  const canvas = document.getElementById('chartReservasPorHora');
  if (!canvas) return;

  const datos = JSON.parse(canvas.dataset.chart || '[]');
  const labels = datos.map(function(d) { return d.hora; });
  const valores = datos.map(function(d) { return d.total; });

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Reservas',
        data: valores,
        borderColor: '#2B6398',
        backgroundColor: 'rgba(43, 99, 152, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#2B6398',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) { return ' ' + ctx.parsed.y + ' reservas'; }
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
          ticks: { color: '#374151', font: { size: 11, weight: '500' } }
        }
      }
    }
  });
})();