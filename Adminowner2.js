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

  let qty = {};
  let paymentMethod = 'Cash';

  const statusClasses = {
    'In stock': 'bg-green-100 text-green-700',
    'Low stock': 'bg-orange-100 text-orange-500',
    'Out of stock': 'bg-red-100 text-red-500',
    'Expired': 'bg-gray-200 text-gray-600'
  };

  function naira(n) { return '₦' + n.toLocaleString('en-NG'); }
  function canSell(p) { return p.status === 'In stock' || p.status === 'Low stock'; }

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

  function renderProducts() {
    const alertItems = products.filter(p => p.status === 'Low stock' || p.status === 'Out of stock' || p.status === 'Expired').length;
    document.getElementById('alertCount').textContent = alertItems;

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

  function renderCart() {
    const itemsDiv = document.getElementById('cartItems');
    const empty = document.getElementById('cartEmpty');
    const skus = Object.keys(qty).filter(sku => qty[sku] > 0);
    let total = 0, itemCount = 0;

    if (skus.length === 0) {
      itemsDiv.innerHTML = '';
      itemsDiv.appendChild(empty);
    } else {
      itemsDiv.innerHTML = skus.map(sku => {
        const p = products.find(x => x.sku === sku);
        const q = qty[sku];
        const lineTotal = p.price * q;
        total += lineTotal;
        itemCount += q;
        return `
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">${p.name}</p>
              <p class="text-xs text-gray-400">${naira(p.price)}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button data-sku="${sku}" data-d="-1" class="qtyBtn h-7 w-7 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100">−</button>
              <span class="w-4 text-center text-sm font-medium">${q}</span>
              <button data-sku="${sku}" data-d="1" class="qtyBtn h-7 w-7 flex items-center justify-center rounded-md border border-gray-300 bg-green-50 text-green-700 hover:bg-green-100">+</button>
              <button data-sku="${sku}" class="removeItem h-7 w-7 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50">🗑️</button>
            </div>
          </div>`;
      }).join('');
    }

    document.getElementById('cartCountLabel').textContent = itemCount + ' item' + (itemCount === 1 ? '' : 's') + ' added';
    document.getElementById('cartSubtotal').textContent = naira(total);
    document.getElementById('cartTotal').textContent = naira(total);

    const badge = document.getElementById('cartBadge');
    if (itemCount > 0) { badge.classList.remove('hidden'); badge.textContent = itemCount; }
    else { badge.classList.add('hidden'); }

    updateChange();
    document.getElementById('completeSaleBtn').disabled = itemCount === 0;
    return { total, itemCount };
  }

  function getTotal() {
    return Object.keys(qty).reduce((sum, sku) => {
      const p = products.find(x => x.sku === sku);
      return sum + p.price * (qty[sku] || 0);
    }, 0);
  }

  function updateChange() {
    const total = getTotal();
    const received = parseFloat(document.getElementById('amountReceived').value) || 0;
    const change = received - total;
    const display = document.getElementById('changeDisplay');
    display.textContent = naira(change < 0 ? 0 : change);
    display.classList.toggle('text-red-500', change < 0);
    display.classList.toggle('text-gray-700', change >= 0);
  }

  // Qty buttons (table/cards + cart)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qtyBtn');
    if (btn) {
      const sku = btn.dataset.sku;
      const delta = parseInt(btn.dataset.d, 10);
      const product = products.find(p => p.sku === sku);
      let next = (qty[sku] || 0) + delta;
      if (next < 0) next = 0;
      if (next > product.stock) next = product.stock;
      qty[sku] = next;
      renderProducts();
      renderCart();
      return;
    }
    const rem = e.target.closest('.removeItem');
    if (rem) {
      qty[rem.dataset.sku] = 0;
      renderProducts();
      renderCart();
    }
  });

  document.getElementById('productSearch').addEventListener('input', renderProducts);
  document.getElementById('statusFilter').addEventListener('change', renderProducts);

  document.getElementById('filterBtn').addEventListener('click', () => {
    document.getElementById('filterPanel').classList.toggle('hidden');
  });

  document.getElementById('newSaleBtn').addEventListener('click', () => {
    qty = {};
    document.getElementById('productSearch').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('amountReceived').value = '';
    document.getElementById('filterPanel').classList.add('hidden');
    renderProducts();
    renderCart();
  });

  document.getElementById('clearCartBtn').addEventListener('click', () => {
    qty = {};
    renderProducts();
    renderCart();
  });

  document.getElementById('historyBtn').addEventListener('click', () => {
    const sales = JSON.parse(localStorage.getItem('inventra_sales') || '[]');
    if (sales.length === 0) { alert('No sales recorded yet.'); return; }
    const summary = sales.slice().reverse().slice(0, 10).map(s =>
      `${s.id} — ${s.items} item(s) — ${naira(s.total)} (${s.method})`
    ).join('\n');
    alert('Recent Sales:\n\n' + summary);
  });

  // Payment method buttons
  function renderPaymentButtons() {
    document.querySelectorAll('.payBtn').forEach(btn => {
      const active = btn.dataset.method === paymentMethod;
      btn.className = 'payBtn flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border ' +
        (active ? 'bg-green-50 border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50');
    });
    document.getElementById('cashSection').classList.toggle('hidden', paymentMethod !== 'Cash');
  }
  document.querySelectorAll('.payBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      paymentMethod = btn.dataset.method;
      renderPaymentButtons();
    });
  });

  // Quick amount buttons
  document.querySelectorAll('.quickAmt').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = parseFloat(document.getElementById('amountReceived').value) || 0;
      document.getElementById('amountReceived').value = current + parseInt(btn.dataset.amt, 10);
      updateChange();
    });
  });
  document.getElementById('amountReceived').addEventListener('input', updateChange);

  // Sidebar (mobile)
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  document.getElementById('menuBtn').addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  });

  // Cart drawer (mobile)
  const cartPanel = document.getElementById('cartPanel');
  document.getElementById('cartToggleBtn').addEventListener('click', () => {
    cartPanel.classList.remove('translate-y-full');
    overlay.classList.remove('hidden');
  });
  document.getElementById('closeCart').addEventListener('click', closeCart);
  function closeCart() {
    cartPanel.classList.add('translate-y-full');
    overlay.classList.add('hidden');
  }
  overlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    closeCart();
    overlay.classList.add('hidden');
  });

  // Checkout
  const STORAGE_KEY = 'inventra_sales';
  function nextTxnId() {
    const sales = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return 'SRD-' + (1043 + sales.length);
  }

  document.getElementById('completeSaleBtn').addEventListener('click', () => {
    const { total, itemCount } = renderCart();
    if (itemCount === 0) return;

    const received = parseFloat(document.getElementById('amountReceived').value) || 0;
    if (paymentMethod === 'Cash' && received < total) {
      alert('Amount received is less than the total.');
      return;
    }
    const change = paymentMethod === 'Cash' ? Math.max(received - total, 0) : 0;

    // Reduce stock & update status
    Object.keys(qty).forEach(sku => {
      if (!qty[sku]) return;
      const p = products.find(x => x.sku === sku);
      p.stock -= qty[sku];
      if (p.stock <= 0) { p.stock = 0; p.status = 'Out of stock'; }
      else if (p.stock <= 3) { p.status = 'Low stock'; }
    });

    const txnId = nextTxnId();
    const sales = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    sales.push({ id: txnId, items: itemCount, total, method: paymentMethod, received, change, date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));

    document.getElementById('modalTxnId').textContent = txnId;
    document.getElementById('modalItems').textContent = itemCount + ' item(s)';
    document.getElementById('modalMethod').textContent = paymentMethod;
    document.getElementById('modalReceived').textContent = paymentMethod === 'Cash' ? naira(received) : '—';
    document.getElementById('modalChange').textContent = paymentMethod === 'Cash' ? naira(change) : '—';
    document.getElementById('modalTotal').textContent = naira(total);
    document.getElementById('successModal').classList.remove('hidden');
  });

  document.getElementById('closeSuccessBtn').addEventListener('click', () => {
    qty = {};
    document.getElementById('amountReceived').value = '';
    renderProducts();
    renderCart();
    document.getElementById('successModal').classList.add('hidden');
    closeCart();
  });

  // init
  renderPaymentButtons();
  renderProducts();
  renderCart();