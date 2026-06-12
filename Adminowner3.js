 const STORAGE_KEY = 'pos_sales';
  let sales = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
 
  if (!sales) {
    sales = [{
      id: 'SRD-1043',
      date: 'Jun 7, 2026 - 9:41am',
      user: 'Adaeze Okafor',
      method: 'Cash',
      item: 'Walk-in sale',
      total: 13630
    }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  }
 
  const backdrop = document.getElementById('backdrop');
  const salesView = document.getElementById('salesView');
  const newSaleView = document.getElementById('newSaleView');
  const salesList = document.getElementById('salesList');
 
  function formatNaira(n) {
    return '₦' + Number(n).toLocaleString('en-NG');
  }
 
  function renderModal(sale) {
    document.getElementById('txnId').textContent = sale.id;
    document.getElementById('txnDate').textContent = sale.date;
    document.getElementById('txnUser').textContent = sale.user;
    document.getElementById('txnMethod').textContent = sale.method;
    document.getElementById('txnTotal').textContent = formatNaira(sale.total);
  }
 
  function renderSalesList() {
    salesList.innerHTML = '';
    [...sales].reverse().forEach(s => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center px-4 py-3';
      row.innerHTML = `
        <div>
          <p class="text-sm font-semibold text-gray-800">${s.id} — ${s.item}</p>
          <p class="text-xs text-gray-500">${s.date} · ${s.user}</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">${s.method}</span>
          <p class="text-sm font-bold text-gray-800 mt-1">${formatNaira(s.total)}</p>
        </div>`;
      salesList.appendChild(row);
    });
  }
 
  function nextId() {
    const n = sales.length + 1043;
    return 'SRD-' + n;
  }
 
  function nowString() {
    const d = new Date();
    let h = d.getHours();
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    const m = d.getMinutes().toString().padStart(2, '0');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} - ${h}:${m}${ampm}`;
  }
 
  // Init with last sale
  renderModal(sales[sales.length - 1]);
 
  // Buttons
  document.getElementById('viewSalesBtn').addEventListener('click', () => {
    renderSalesList();
    backdrop.classList.add('hidden');
    salesView.classList.remove('hidden');
  });
 
  document.getElementById('closeSalesBtn').addEventListener('click', () => {
    salesView.classList.add('hidden');
    backdrop.classList.remove('hidden');
  });
 
  document.getElementById('newSaleBtn').addEventListener('click', () => {
    backdrop.classList.add('hidden');
    newSaleView.classList.remove('hidden');
    document.getElementById('itemInput').focus();
  });
 
  document.getElementById('cancelNewSale').addEventListener('click', () => {
    newSaleView.classList.add('hidden');
    backdrop.classList.remove('hidden');
  });
 
  document.getElementById('newSaleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const item = document.getElementById('itemInput').value.trim();
    const amount = parseFloat(document.getElementById('amountInput').value);
    const method = document.getElementById('methodInput').value;
 
    if (!item || !amount || amount <= 0) return;
 
    const sale = {
      id: nextId(),
      date: nowString(),
      user: 'Adaeze Okafor',
      method: method,
      item: item,
      total: amount
    };
 
    sales.push(sale);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
 
    renderModal(sale);
    e.target.reset();
    newSaleView.classList.add('hidden');
    backdrop.classList.remove('hidden');
  });