const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const mdPath = 'C:\\Chris\\Studies\\SEN\\Project\\docs\\PED\\PED_v4.0_Final_Project_Closure_and_Release_Dossier.md';
const tempHtml = path.join(process.env.TEMP || 'C:\\Users\\jakof\\AppData\\Local\\Temp', 'ped_v4_styled.html');

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Lightweight robust Markdown-to-HTML converter
function mdToHtml(md) {
  let lines = md.split(/\r?\n/);
  let html = [];
  let inCode = false;
  let codeLang = '';
  let codeBuffer = [];
  let inTable = false;
  let tableHeaderDone = false;

  function formatInline(text) {
    // Escaping
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Bold italic
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Math indicators
    text = text.replace(/\\rightarrow/g, '→').replace(/\\longrightarrow/g, '⟶');
    text = text.replace(/\\ge/g, '≥').replace(/\\le/g, '≤');
    text = text.replace(/\\text\{([^}]+)\}/g, '$1');
    text = text.replace(/\$(.*?)\$/g, '<span class="math">$1</span>');
    return text;
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Fenced code blocks
    if (line.trim().startsWith('```')) {
      if (inCode) {
        inCode = false;
        html.push(`<pre class="code-block language-${codeLang}"><code>${codeBuffer.join('\n')}</code></pre>`);
        codeBuffer = [];
      } else {
        inCode = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      continue;
    }

    // Horizontal Rule
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      if (inTable) { html.push('</tbody></table>'); inTable = false; }
      html.push('<hr class="section-divider" />');
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      let cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if delimiter row
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        tableHeaderDone = true;
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeaderDone = false;
        html.push('<table class="report-table"><thead><tr>');
        cells.forEach(c => html.push(`<th>${formatInline(c)}</th>`));
        html.push('</tr></thead><tbody>');
      } else {
        html.push('<tr>');
        cells.forEach(c => html.push(`<td>${formatInline(c)}</td>`));
        html.push('</tr>');
      }
      continue;
    } else {
      if (inTable) {
        html.push('</tbody></table>');
        inTable = false;
      }
    }

    // Headings
    if (line.startsWith('# ')) {
      html.push(`<h1 class="doc-title">${formatInline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      html.push(`<h2 class="section-h2">${formatInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      html.push(`<h3 class="section-h3">${formatInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      html.push(`<h4 class="section-h4">${formatInline(line.slice(5))}</h4>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      html.push(`<blockquote class="doc-quote">${formatInline(line.slice(2))}</blockquote>`);
      continue;
    }

    // Lists
    if (/^\s*[-*]\s+/.test(line)) {
      html.push(`<li class="doc-li">${formatInline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      html.push(`<li class="doc-ol-li">${formatInline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      continue;
    }

    // Normal paragraph
    html.push(`<p class="doc-p">${formatInline(line)}</p>`);
  }

  if (inTable) html.push('</tbody></table>');

  return html.join('\n');
}

const bodyHtml = mdToHtml(mdContent);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>PED v4.0 Final — CivicConnect (Group E)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 20mm 16mm 20mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.5;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }
  .doc-title {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2pt solid #2563eb;
    padding-bottom: 4pt;
    margin-top: 12pt;
    margin-bottom: 6pt;
  }
  .section-h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e3a8a;
    border-bottom: 1pt solid #cbd5e1;
    padding-bottom: 2pt;
    margin-top: 16pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
  }
  .section-h3 {
    font-size: 11pt;
    font-weight: 600;
    color: #0369a1;
    margin-top: 12pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
  }
  .section-h4 {
    font-size: 10pt;
    font-weight: 600;
    color: #334155;
    margin-top: 8pt;
    margin-bottom: 2pt;
    page-break-after: avoid;
  }
  .doc-p {
    margin-top: 4pt;
    margin-bottom: 6pt;
    text-align: justify;
  }
  .doc-quote {
    background: #f8fafc;
    border-left: 3pt solid #3b82f6;
    padding: 6pt 10pt;
    margin: 6pt 0;
    font-style: italic;
    color: #334155;
  }
  .report-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 12pt 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }
  .report-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    padding: 5pt 6pt;
    border: 1pt solid #0f172a;
    text-align: left;
  }
  .report-table td {
    border: 0.5pt solid #cbd5e1;
    padding: 4pt 6pt;
    vertical-align: top;
  }
  .report-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  .code-block {
    background: #0f172a;
    color: #f8fafc;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 8pt;
    padding: 8pt 10pt;
    border-radius: 4pt;
    overflow-x: auto;
    margin: 8pt 0;
    page-break-inside: avoid;
  }
  code {
    font-family: "Consolas", "Courier New", monospace;
    background: #f1f5f9;
    color: #0369a1;
    padding: 1pt 3pt;
    border-radius: 2pt;
    font-size: 8.5pt;
  }
  .code-block code {
    background: transparent;
    color: inherit;
    padding: 0;
  }
  .section-divider {
    border: 0;
    height: 1pt;
    background: #cbd5e1;
    margin: 14pt 0;
  }
  li {
    margin-bottom: 3pt;
  }
  strong {
    color: #0f172a;
  }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

fs.writeFileSync(tempHtml, fullHtml, 'utf8');

const outputPdfs = [
  'C:\\Users\\jakof\\Desktop\\SEN381_Final_Project_GroupE\\PED_v4.0_CivicConnect_GroupE.pdf',
  'C:\\Users\\jakof\\Desktop\\SEN381_Final_Project_GroupE\\SEN381_Final_GroupE.pdf',
  'C:\\Chris\\Studies\\SEN\\Project\\docs\\PED\\PED_v4.0_CivicConnect_GroupE.pdf',
  'C:\\Chris\\Studies\\SEN\\Project\\SEN381_Final_GroupE.pdf',
  'C:\\Chris\\Studies\\SEN\\SEN381_Final_GroupE.pdf'
];

outputPdfs.forEach(outPath => {
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileUrl = 'file:///' + tempHtml.replace(/\\/g, '/');
  const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outPath}" "${fileUrl}"`;
  console.log(`Printing PDF to: ${outPath}...`);
  execSync(cmd, { stdio: 'ignore' });
  console.log(`Saved PDF: ${outPath}`);
});

console.log('PDF_GENERATION_COMPLETE');
