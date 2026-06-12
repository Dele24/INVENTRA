const products = [
    { name: 'Indomine Chicken', sku: 'IDC-300-CT', price: 1300, stock: 10, status: 'In stock', icon: '🍜' },
    { name: 'Milo 400g',        sku: 'MIL-400-PK', price: 6000, stock: 7,  status: 'In stock', icon: '🥫' },
    { name: 'Coca-cola 50cl',   sku: 'COK-050-CT', price: 2350, stock: 0,  status: 'Out of stock', icon: '🥤' },
    { name: 'Peak Milk Tin',    sku: 'PMT-150-TN', price: 2300, stock: 5,  status: 'In stock', icon: '🥛' },
    { name: 'Dettol Soap',      sku: 'DTL-075-BA', price: 1500, stock: 7,  status: 'Low stock', icon: '🧼' },
    { name: 'Golden Penny Se...', sku: 'GPS-001-BG', price: 1300, stock: 7, status: 'Expired', icon: '🌾' },
    { name: 'Sprite 33cl',      sku: 'SPR-033-BT', price: 1300, stock: 3,  status: 'Low stock', icon: '🥤' },
    { name: 'Fanta 33cl',       sku: 'FAN-033-BT', price: 2000, stock: 5,  status: 'In stock', icon: '🧃' },
    { name: 'Milo 380g',        sku: 'MIL-380-TN', price: 5000, stock: 5,  status: 'In stock', icon: '🥫' },
    { name: 'Fanta 50cl',       sku: 'FAN-050-BT', price: 1300, stock: 5,  status: 'In stock', icon: '🧃' },
  ];

  let qty = {}; // sku -> qty, starts at 0 as shown in image

  const statusClasses = {
    'In stock': 'bg-green-100 text-green-700',
    'Low stock': 'bg-orange-100 text-orange-500',
    'Out of stock': 'bg-red-100 text-red-500',
    'Expired': 'bg-gray-200 text-gray-600'
  };

  function naira(n) { return '₦' + n.toLocaleString('en-NG'); }

  function canSell(p) {
    return p.status === 'In stock' || p.status === 'Low stock';
  }

  function qtyControl(p) {
    if (!canSell(p)) {
      return `<span class="inline-block bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-1 rounded-md">N/A</span>`;
    }
    const q = qty[p.sku] || 0;
    return `
      <div class="flex items-center gap-2">
        <button data-sku="${p.sku}" data-d="-1" class="qtyBtn h-7 w-7 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100">−</button>
        <span class="w-4 text-center text-sm font-medium">${q}</span>
        <button data-sku="${p.sku}" data-d="1" class="qtyBtn h-7 w-7 flex items-center justify-center rounded-md border border-gray-300 bg-green-50 text-green-700 hover:bg-green-100">+</button>
      </div>`;
  }

  function render() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const statusF = document.getElementById('statusFilter').value;

    const filtered = products.filter(p =>
      (p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)) &&
      (!statusF || p.status === statusF)
    );

    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = filtered.map(p => `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 flex items-center gap-3 font-medium text-gray-800 whitespace-nowrap">
          <span class="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-md text-base">${p.icon}</span>
          ${p.name}
        </td>
        <td class="px-4 py-3 text-gray-500 whitespace-nowrap">${p.sku}</td>
        <td class="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">${naira(p.price)}</td>
        <td class="px-4 py-3 text-gray-600">${p.stock}</td>
        <td class="px-4 py-3"><span class="text-xs font-semibold px-2.5 py-1 rounded-full ${statusClasses[p.status]}">${p.status}</span></td>
        <td class="px-4 py-3">${qtyControl(p)}</td>
      </tr>`).join('') || `<tr><td colspan="6" class="text-center text-gray-400 py-10">No products found</td></tr>`;

    const cards = document.getElementById('productCards');
    cards.innerHTML = filtered.map(p => `
      <div class="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3">
        <span class="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-xl shrink-0">${p.icon}</span>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-800 truncate">${p.name}</p>
          <p class="text-xs text-gray-400">${p.sku} · Stock: ${p.stock}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="font-semibold text-gray-800 text-sm">${naira(p.price)}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${statusClasses[p.status]}">${p.status}</span>
          </div>
        </div>
        <div class="shrink-0">${qtyControl(p)}</div>
      </div>`).join('') || `<p class="text-center text-gray-400 py-10">No products found</p>`;
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qtyBtn');
    if (!btn) return;
    const sku = btn.dataset.sku;
    const delta = parseInt(btn.dataset.d, 10);
    const product = products.find(p => p.sku === sku);
    let next = (qty[sku] || 0) + delta;
    if (next < 0) next = 0;
    if (next > product.stock) next = product.stock;
    qty[sku] = next;
    render();
  });

  document.getElementById('productSearch').addEventListener('input', render);
  document.getElementById('statusFilter').addEventListener('change', render);

  document.getElementById('filterBtn').addEventListener('click', () => {
    document.getElementById('filterPanel').classList.toggle('hidden');
  });

  document.getElementById('newSaleBtn').addEventListener('click', () => {
    qty = {};
    document.getElementById('productSearch').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('filterPanel').classList.add('hidden');
    render();
  });

  document.getElementById('historyBtn').addEventListener('click', () => {
    alert('Sale History view goes here.');
  });

  // Sidebar (mobile)
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  document.getElementById('menuBtn').addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });

  render();