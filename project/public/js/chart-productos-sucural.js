(function () {
  const contenedor = document.getElementById('datosProductosSucursal');
  if (!contenedor) return;

  const datos = JSON.parse(contenedor.dataset.productos || '[]');
  const selectConcesionaria = document.getElementById('selectConcesionaria');
  const selectSucursal = document.getElementById('selectSucursal');
  const resultado = document.getElementById('resultadoProductosSucursal');
  const sinDatos = document.getElementById('sinDatosSucursal');
  let chartInstance = null;

  // Construir mapa de concesionarias -> sucursales -> productos
  const mapa = {};
  datos.forEach(function(d) {
    if (!mapa[d.id_concesionaria]) {
      mapa[d.id_concesionaria] = {
        nombre: d.nombre_concesionaria,
        sucursales: {}
      };
    }
    if (!mapa[d.id_concesionaria].sucursales[d.id_sucursal]) {
      mapa[d.id_concesionaria].sucursales[d.id_sucursal] = {
        nombre: d.nombre_sucursal,
        productos: []
      };
    }
    mapa[d.id_concesionaria].sucursales[d.id_sucursal].productos.push({
      nombre: d.nombre_producto,
      total: d.total_unidades
    });
  });

  // Llenar dropdown de concesionarias
  Object.keys(mapa).forEach(function(idC) {
    const opt = document.createElement('option');
    opt.value = idC;
    opt.textContent = mapa[idC].nombre;
    selectConcesionaria.appendChild(opt);
  });

  // Al cambiar concesionaria
  selectConcesionaria.addEventListener('change', function () {
    const idC = this.value;
    selectSucursal.innerHTML = '<option value="">Selecciona una sucursal</option>';
    resultado.classList.add('hidden');
    sinDatos.classList.add('hidden');

    if (!idC) {
      selectSucursal.disabled = true;
      return;
    }

    selectSucursal.disabled = false;
    Object.keys(mapa[idC].sucursales).forEach(function(idS) {
      const opt = document.createElement('option');
      opt.value = idS;
      opt.textContent = mapa[idC].sucursales[idS].nombre;
      selectSucursal.appendChild(opt);
    });
  });

  // Al cambiar sucursal
  selectSucursal.addEventListener('change', function () {
    const idC = selectConcesionaria.value;
    const idS = this.value;
    resultado.classList.add('hidden');
    sinDatos.classList.add('hidden');

    if (!idC || !idS) return;

    const productos = mapa[idC].sucursales[idS].productos.slice(0, 5);

    if (!productos.length) {
      sinDatos.classList.remove('hidden');
      return;
    }

    const labels = productos.map(function(p) { return p.nombre; });
    const valores = productos.map(function(p) { return p.total; });

    resultado.classList.remove('hidden');

    if (chartInstance) chartInstance.destroy();

    const ctx = document.getElementById('chartProductosSucursal').getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Unidades reservadas',
          data: valores,
          backgroundColor: '#2B6398',
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) { return ' ' + ctx.parsed.x + ' unidades'; }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#F3F4F6' },
            ticks: { color: '#6B7280', font: { size: 12 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#374151', font: { size: 13 } }
          }
        }
      }
    });
  });
})();