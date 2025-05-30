
const toolsData = [{"name": "Whois Lookup", "description": "أداة للاستعلام عن معلومات ملكية النطاقات", "category": "Domain Tools", "url": "https://whois.domaintools.com/"}, {"name": "Social Links", "description": "البحث عن الحسابات عبر منصات التواصل", "category": "Social Media", "url": "https://sociallinks.io/tools"}, {"name": "IP Tracker", "description": "تحديد الموقع الجغرافي لعنوان IP", "category": "IP Analysis", "url": "https://www.iplocation.net/"}, {"name": "ExifTool", "description": "استخراج بيانات الميتا من الصور والملفات", "category": "Metadata Analysis", "url": "https://exiftool.org/"}, {"name": "Google Dorking", "description": "استخدام متقدم لمحركات البحث عبر أوامر مخصصة", "category": "Search Tools", "url": "https://www.exploit-db.com/google-hacking-database"}];

const app = document.getElementById('app');
let searchTerm = '';
let categoryFilter = 'All';

const categories = ['All', ...new Set(toolsData.map(tool => tool.category))];

function render() {
  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  app.innerHTML = `
    <h1 class="text-2xl font-bold mb-2 text-center">أدوات تحقيق المصادر المفتوحة (OSINT)</h1>
    <p class="text-center text-gray-700 mb-6">
      يمكنك من خلال هذه الواجهة استعراض أدوات OSINT، البحث ضمنها، تصفيتها حسب الفئة، أو تصديرها إلى Excel أو PDF.
    </p>
    <div class="mb-4 flex flex-col md:flex-row gap-4 justify-center">
      <input
        type="text"
        placeholder="بحث عن أداة..."
        value="${searchTerm}"
        oninput="updateSearch(this.value)"
        class="p-2 border border-gray-300 rounded w-full md:w-1/3"
      />
      <select
        onchange="updateCategory(this.value)"
        class="p-2 border border-gray-300 rounded w-full md:w-1/4"
      >
        ${categories.map(c => `<option ${c === categoryFilter ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
      <button onclick="exportToPDF()" class="p-2 bg-red-500 text-white rounded hover:bg-red-600">تصدير PDF</button>
      <button onclick="exportToExcel()" class="p-2 bg-green-500 text-white rounded hover:bg-green-600">تصدير Excel</button>
    </div>
    <div class="overflow-auto">
      <table class="min-w-full bg-white border border-gray-200 text-right">
        <thead>
          <tr>
            <th class="p-2 border-b">الاسم</th>
            <th class="p-2 border-b">الوصف</th>
            <th class="p-2 border-b">الفئة</th>
            <th class="p-2 border-b">الرابط</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTools.map(tool => `
            <tr class="hover:bg-gray-50">
              <td class="p-2 border-b font-semibold">${tool.name}</td>
              <td class="p-2 border-b">${tool.description}</td>
              <td class="p-2 border-b text-sm text-gray-700">${tool.category}</td>
              <td class="p-2 border-b"><a href="${tool.url}" target="_blank" class="text-blue-500 hover:underline">زيارة</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function updateSearch(val) {
  searchTerm = val;
  render();
}

function updateCategory(val) {
  categoryFilter = val;
  render();
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.autoTable({
    head: [['الاسم', 'الوصف', 'الفئة', 'الرابط']],
    body: toolsData.map(tool => [tool.name, tool.description, tool.category, tool.url])
  });
  doc.save('osint_tools.pdf');
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(toolsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tools');
  XLSX.writeFile(workbook, 'osint_tools.xlsx');
}

render();
