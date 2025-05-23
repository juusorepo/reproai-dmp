// const API_BASE = "http://localhost:8000"; // Changed to match backend port
const API_BASE = window.REACT_APP_API_URL || "https://reproai-app.lemondune-e106e75a.westeurope.azurecontainerapps.io";
const API_KEY = window.REACT_APP_API_KEY || "weroihfeswfchwe973e424efdslsdfklefrwej3"; 

async function fetchManuscripts() {
    const listEl = document.getElementById('manuscript-list');
    listEl.innerHTML = '<p>Loading manuscripts...</p>';
    try {
        // Fetch manuscripts (paginated)
        let resp = await fetch(`${API_BASE}/api/v1/manuscripts?limit=10&offset=0`, {
    headers: { 'x-api-key': API_KEY }
});
        if (!resp.ok) throw new Error('Failed to fetch manuscripts');
        let data = await resp.json();
        if (!data.items || data.items.length === 0) {
            listEl.innerHTML = '<p>No manuscripts found.</p>';
            return;
        }
        // For each manuscript, fetch latest analysis
        let html = '<ul>';
        for (const m of data.items) {
    const manuscriptId = m._id || m.id || m.doi || '';
    html += `<li><b>${m.title || m.doi || manuscriptId}</b> `;
    html += '<span style="color:#888">(' + (m.doi || manuscriptId) + ')</span> ';
    if (manuscriptId) {
        html += `<button onclick="downloadPdf('${manuscriptId}')">Export PDF</button>`;
    } else {
        html += `<span style='color:red'>No ID available</span>`;
    }
    html += '</li>';
}
        html += '</ul>';
        listEl.innerHTML = html;
    } catch (err) {
        listEl.innerHTML = `<p style='color:red'>Error: ${err.message}</p>`;
    }
}

async function downloadPdf(manuscriptId) {
    // Get latest analysis for manuscript
    try {
        let resp = await fetch(`${API_BASE}/api/v1/analyses/manuscript/${manuscriptId}`, {
    headers: { 'x-api-key': API_KEY }
});
        if (!resp.ok) throw new Error('No analysis found');
        let analysis = await resp.json();
        // Download PDF
        let pdfResp = await fetch(`${API_BASE}/api/v1/checklists/${analysis.checklist_id}/export-pdf?analysis_id=${analysis.id}`, {
    headers: { 'x-api-key': API_KEY }
});
        if (!pdfResp.ok) throw new Error('PDF export failed');
        let blob = await pdfResp.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis_${manuscriptId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchManuscripts);
