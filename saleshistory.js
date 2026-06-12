 const methodClasses = {
    'Cash': 'bg-green-100 text-green-700',
    'Transfer': 'bg-indigo-100 text-indigo-700',
    'POS': 'bg-purple-100 text-purple-700'
  };
  const methodIcons = { 'Cash': '💵', 'Transfer': '🏦', 'POS': '💳' };
  const amountClasses = { 'Cash': 'text-gray-800', 'Transfer': 'text-indigo-600', 'POS': 'text-purple-600' };

  const attendants = ['Adaeze', 'Pamella', 'Babajide'];
  const itemSets = [
    'Coca-Cola 50cl x2, Milo x4',
    'Peak Milk x3, Milo 500g x1',
    'Vaseline Lotion x1'
  ];
  const moreCounts = [3, 1, 2, 2, 1, 1, 1];
  const methods = ['Transfer', 'POS', 'Transfer', 'Cash', 'Transfer', 'Cash', 'POS'];
  const amounts = [1300, 6000, 2350, 2300, 1500, 1300, 1300];

  // Base 7 rows exactly from the image, then generated rows for pagination
  const baseSales = [
    { id: 'SRD-1042', time: 'Jun 7, 9:30am', attendant: 'Adaeze',   items: itemSets[0], more: moreCounts[0], method: methods[0], amount: amounts[0] },
    { id: 'SRD-1043', time: 'Jun 7, 9:30am', attendant: 'Pamella',  items: itemSets[1], more: moreCounts[1], method: methods[1], amount: amounts[1] },
    { id: 'SRD-1044', time: 'Jun 6, 9:30am', attendant: 'Babajide', items: itemSets[2], more: moreCounts[2], method: methods[2], amount: amounts[2] },
    { id: 'SRD-1045', time: 'Jun 6, 9:30am', attendant: 'Pamella',  items: itemSets[2], more: moreCounts[3], method: methods[3], amount: amounts[3] },
    { id: 'SRD-1046', time: 'Jun 6, 9:30am', attendant: 'Adaeze',   items: itemSets[1], more: moreCounts[4], method: methods[4], amount: amounts[4] },
    { id: 'SRD-1047', time: 'Jun 4, 9:30am', attendant: 'Pamella',  items: itemSets[1], more: moreCounts[5], method: methods[5], amount: amounts[5] },
    { id: 'SRD-1048', time: 'Jun 4, 9:30am', attendant: 'Adaeze',   items: itemSets[1], more: moreCounts[6], method: methods[6], amount: amounts[6] },
  ];

  // Generate additional rows to fill 30 pages (7 per page = 210 rows)
  const sales = [...baseSales];
  let idCounter = 1049;
  while (sales.length < 210) {
    const i = sales.length % 7;
    sales.push({
      id: 'SRD-' + idCounter++,
      time: 'Jun ' + (1 + (sales.length % 28)) + ', 9:30am',
      attendant: attendants[sales.length % attendants.length],
      items: itemSets[i % itemSets.length],
      more: moreCounts[i],
      method: methods[i],
      amount: amounts[i]
    });
  }

  const PAGE_SIZE = 7;
  let currentPage = 1;
  let activeRange = 'All';

  function naira(n) { return '₦' + n.toLocaleString('en-NG'); }

  function getFiltered() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    return sales.filter(s => {
      const matchesSearch = !search || s.id.toLowerCase().includes(search) || s.attendant.toLowerCase().includes(search) || s.items.toLowerCase().includes(search);
      // 'Today'/'This week'/'This month' just narrow to first N for demo purposes
      let matchesRange = true;
      if (activeRange === 'Today') matchesRange = s.time.startsWith('Jun 7');
      if (activeRange === 'This week') matchesRange = ['Jun 7', 'Jun 6', 'Jun 5', 'Jun 4'].some(d => s.time.startsWith(d));
      if (activeRange === 'This month') matchesRange = true;
      return matchesSearch && matchesRange;
    });
  }

  function renderTabs() {
    document.querySelectorAll('.dateTab').forEach(btn => {
      const active = btn.dataset.range === activeRange;
      btn.className = 'dateTab px-4 py-1.5 rounded-lg text-sm font-medium ' +
        (active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200');
    });
  }

  function renderTotals(filtered) {
    const totals = { Cash: 0, Transfer: 0, POS: 0 };
    filtered.forEach(s => totals[s.method] += s.amount);
    document.getElementById('totalCash').textContent = naira(totals.Cash);
    document.getElementById('totalTransfer').textContent = naira(totals.Transfer);
    document.getElementById('totalPOS').textContent = naira(totals.POS);
  }

  function rowHTML(s) {
    return `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">${s.id}</td>
        <td class="px-4 py-3 text-gray-500 whitespace-nowrap">${s.time}</td>
        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">${s.attendant}</td>
        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">${s.items} <span class="text-gray-400">+${s.more} more</span></td>
        <td class="px-4 py-3"><span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${methodClasses[s.method]}">${methodIcons[s.method]} ${s.method}</span></td>
        <td class="px-4 py-3 text-right font-semibold ${amountClasses[s.method]} whitespace-nowrap">${naira(s.amount)}</td>
      </tr>`;
  }

  function cardHTML(s) {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-3">
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-gray-800">${s.id}</span>
          <span class="font-semibold ${amountClasses[s.method]}">${naira(s.amount)}</span>
        </div>
        <p class="text-xs text-gray-400 mb-1">${s.time} · ${s.attendant}</p>
        <p class="text-sm text-gray-700 mb-2">${s.items} <span class="text-gray-400">+${s.more} more</span></p>
        <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${methodClasses[s.method]}">${methodIcons[s.method]} ${s.method}</span>
      </div>`;
  }

  function renderPagination(totalPages) {
    document.getElementById('pageLabel').textContent = `Page ${currentPage} of ${totalPages}`;

    const container = document.getElementById('pageNumbers');
    const pages = [];
    const add = (p) => pages.push(p);

    add(1);
    if (currentPage > 4) add('...');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      if (p !== 1 && p !== totalPages) add(p);
    }
    if (currentPage < totalPages - 3) add('...');
    if (totalPages > 1) add(totalPages);

    container.innerHTML = pages.map(p => {
      if (p === '...') return `<span class="px-2 text-gray-400">...</span>`;
      const active = p === currentPage;
      return `<button data-page="${p}" class="pageBtn h-8 w-8 flex items-center justify-center rounded-lg border text-sm font-medium ${active ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}">${p}</button>`;
    }).join('');

    // Go to page dropdown
    const select = document.getElementById('goToPage');
    select.innerHTML = Array.from({ length: totalPages }, (_, i) => `<option value="${i+1}">${String(i+1).padStart(2,'0')}</option>`).join('');
    select.value = currentPage;
  }

  function render() {
    renderTabs();
    const filtered = getFiltered();
    renderTotals(filtered);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    document.getElementById('tableBody').innerHTML = pageItems.map(rowHTML).join('') ||
      `<tr><td colspan="6" class="text-center text-gray-400 py-10">No transactions found</td></tr>`;

    document.getElementById('cardList').innerHTML = pageItems.map(cardHTML).join('') ||
      `<p class="text-center text-gray-400 py-10">No transactions found</p>`;

    renderPagination(totalPages);
  }

  document.querySelectorAll('.dateTab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeRange = btn.dataset.range;
      currentPage = 1;
      render();
    });
  });

  document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    render();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pageBtn');
    if (btn) {
      currentPage = parseInt(btn.dataset.page, 10);
      render();
    }
  });

  document.getElementById('goToPage').addEventListener('change', (e) => {
    currentPage = parseInt(e.target.value, 10);
    render();
  });

  document.getElementById('filterBtn').addEventListener('click', () => {
    // placeholder for future advanced filters
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