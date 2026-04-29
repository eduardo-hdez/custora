(function () {
  const canvas = document.getElementById('chartReservasSucursal');
  if (!canvas) return;

  const datos = JSON.parse(canvas.dataset.chart || '[]');
  if (!datos.length) return;

  const labels = datos.map(function(d) { return d.nombreSucursal; });
  const valores = datos.map(function(d) { return d.totalReservas; });

  const colores = [
    '#2B6398', '#93C5E8', '#1f496e', '#5B9BD5', '#A8D1F0',
    '#144272', '#3B82F6', '#60A5FA', '#BFDBFE', '#1D4ED8'
  ];

  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: colores.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ' ' + ctx.parsed + ' reservas (' + pct + '%)';
            }
          }
        }
      }
    }
  });

  // Leyenda manual
  const leyenda = document.getElementById('leyendaSucursal');
  if (leyenda) {
    const total = valores.reduce(function(a, b) { return a + b; }, 0);
    labels.forEach(function(label, i) {
      const pct = ((valores[i] / total) * 100).toFixed(1);
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-2';
      li.innerHTML = `
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-3 h-3 rounded-full flex-shrink-0" style="background:${colores[i]}"></span>
          <span class="truncate">${label}</span>
        </div>
        <span class="font-semibold text-gray-900 flex-shrink-0">${valores[i]} <span class="text-gray-400 font-normal">(${pct}%)</span></span>
      `;
      leyenda.appendChild(li);
    });
  }
})();