const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const mdPath = 'C:\\Chris\\Studies\\SEN\\Project\\docs\\PED\\PED_v4.0_Final_Project_Closure_and_Release_Dossier.md';
const tempHtml = path.join(process.env.TEMP || 'C:\\Users\\jakof\\AppData\\Local\\Temp', 'ped_v4_styled.html');

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Robust Markdown-to-HTML converter tailored for clean A4 engineering reports
function mdToHtml(md) {
  let lines = md.split(/\r?\n/);
  let html = [];
  let inCode = false;
  let codeLang = '';
  let codeBuffer = [];
  let inTable = false;
  let inList = false;

  function formatInline(text) {
    // Preserve explicit <br> tags
    text = text.replace(/<br\s*\/?>/gi, '___BR_TAG___');

    // Escape basic HTML entities
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Restore explicit <br> tags
    text = text.replace(/___BR_TAG___/g, '<br>');

    // Convert markdown links [label](url) to clean label text for printed dossier
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return `<a href="${url}" style="color: #0f172a; text-decoration: underline;">${label}</a>`;
      }
      return label;
    });

    // Bold italic
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
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
        if (inList) { html.push('</ul>'); inList = false; }
        if (inTable) { html.push('</tbody></table>'); inTable = false; }
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
      if (inList) { html.push('</ul>'); inList = false; }
      if (inTable) { html.push('</tbody></table>'); inTable = false; }
      html.push('<hr class="section-divider" />');
      continue;
    }

    // Images: ![alt](url)
    const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      if (inList) { html.push('</ul>'); inList = false; }
      if (inTable) { html.push('</tbody></table>'); inTable = false; }
      const alt = imgMatch[1];
      let src = imgMatch[2];
      if (!src.startsWith('http') && !src.startsWith('file:///')) {
        const absPath = path.resolve('C:\\Chris\\Studies\\SEN\\Project', src);
        src = 'file:///' + absPath.replace(/\\/g, '/');
      }
      html.push(`<div class="doc-img-container"><img src="${src}" alt="${alt}" class="doc-img" /><p class="doc-img-caption"><em>${alt}</em></p></div>`);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inList) { html.push('</ul>'); inList = false; }
      
      // Clean escaped pipes so they don't break table column counts
      let cleanLine = line.replace(/\\\|/g, ' - ');
      let cells = cleanLine.split('|').slice(1, -1).map(c => c.trim());

      // Check if delimiter row
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;

        // Proportional column allocations ensuring 100% A4 width fit
        let colgroupHtml = '';
        if (cells.length === 2) {
          colgroupHtml = '<colgroup><col style="width: 28%;"><col style="width: 72%;"></colgroup>';
        } else if (cells.length === 4) {
          colgroupHtml = '<colgroup><col style="width: 28%;"><col style="width: 10%;"><col style="width: 31%;"><col style="width: 31%;"></colgroup>';
        } else if (cells.length === 6 && cells[0].toLowerCase().includes('version')) {
          colgroupHtml = '<colgroup><col style="width: 8%;"><col style="width: 12%;"><col style="width: 17%;"><col style="width: 17%;"><col style="width: 15%;"><col style="width: 31%;"></colgroup>';
        } else if (cells.length === 6) {
          colgroupHtml = '<colgroup><col style="width: 17%;"><col style="width: 12%;"><col style="width: 13%;"><col style="width: 11%;"><col style="width: 23%;"><col style="width: 24%;"></colgroup>';
        }

        html.push(`<table class="report-table">${colgroupHtml}<thead><tr>`);
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
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h1 class="doc-title">${formatInline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2 class="section-h2">${formatInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h3 class="section-h3">${formatInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h4 class="section-h4">${formatInline(line.slice(5))}</h4>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<blockquote class="doc-quote">${formatInline(line.slice(2))}</blockquote>`);
      continue;
    }

    // Lists
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${formatInline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<p class="doc-p" style="margin-left: 12pt;">${formatInline(line)}</p>`);
      continue;
    }

    // End list if non-list line
    if (inList && line.trim() !== '') {
      html.push('</ul>');
      inList = false;
    }

    // Empty lines
    if (line.trim() === '') {
      continue;
    }

    // Normal paragraph
    html.push(`<p class="doc-p">${formatInline(line)}</p>`);
  }

  if (inList) html.push('</ul>');
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
    margin: 15mm 12mm 15mm 12mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #111827;
    background: #ffffff;
    line-height: 1.45;
    font-size: 9pt;
    margin: 0;
    padding: 0;
  }
  .doc-title {
    font-size: 13pt;
    font-weight: bold;
    color: #0f172a;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 3pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
    page-break-after: avoid;
  }
  .section-h2 {
    font-size: 11pt;
    font-weight: bold;
    color: #0f172a;
    border-bottom: 1px solid #94a3b8;
    padding-bottom: 2pt;
    margin-top: 14pt;
    margin-bottom: 5pt;
    page-break-after: avoid;
  }
  .section-h3 {
    font-size: 9.5pt;
    font-weight: bold;
    color: #1e293b;
    margin-top: 10pt;
    margin-bottom: 3pt;
    page-break-after: avoid;
  }
  .section-h4 {
    font-size: 9pt;
    font-weight: bold;
    color: #334155;
    margin-top: 8pt;
    margin-bottom: 2pt;
    page-break-after: avoid;
  }
  .doc-p {
    margin-top: 3pt;
    margin-bottom: 5pt;
    text-align: left;
    font-size: 9pt;
  }
  .doc-quote {
    background: #f8fafc;
    border-left: 3px solid #64748b;
    padding: 4pt 8pt;
    margin: 6pt 0;
    font-style: italic;
    color: #334155;
    font-size: 8.5pt;
  }
  .report-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 12pt 0;
    font-size: 7.5pt;
    line-height: 1.35;
    table-layout: fixed;
    page-break-inside: auto;
  }
  .report-table thead {
    display: table-header-group;
  }
  .report-table tr {
    page-break-inside: avoid;
  }
  .report-table th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: bold;
    padding: 5pt 5pt;
    border: 1px solid #475569;
    text-align: left;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .report-table td {
    border: 1px solid #475569;
    padding: 4pt 5pt;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    background-color: #ffffff;
  }
  .report-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .code-block {
    background: #f8fafc;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 7.5pt;
    line-height: 1.35;
    padding: 6pt 8pt;
    border-radius: 2px;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 6pt 0;
    page-break-inside: avoid;
  }
  code {
    font-family: "Consolas", "Courier New", monospace;
    background: #f1f5f9;
    color: #0f172a;
    padding: 1pt 2pt;
    border-radius: 2pt;
    font-size: 8pt;
  }
  .code-block code {
    background: transparent;
    color: inherit;
    padding: 0;
  }
  .section-divider {
    border: 0;
    height: 1px;
    background: #94a3b8;
    margin: 10pt 0;
  }
  .doc-img-container {
    text-align: center;
    margin: 12pt 0;
    page-break-inside: avoid;
  }
  .doc-img {
    max-width: 98%;
    height: auto;
    border: 1px solid #94a3b8;
    border-radius: 4px;
  }
  .doc-img-caption {
    font-size: 8pt;
    color: #475569;
    margin-top: 4pt;
    margin-bottom: 6pt;
  }
  ul, ol {
    margin-top: 3pt;
    margin-bottom: 6pt;
    padding-left: 18pt;
  }
  li {
    margin-bottom: 2pt;
    font-size: 8.5pt;
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
  'C:\\Users\\jakof\\Desktop\\SEN381_Final_Project_GroupE\\SEN381_Final_GroupE.pdf',
  'C:\\Chris\\Studies\\SEN\\Project\\docs\\PED\\PED_v4.0_CivicConnect_GroupE.pdf',
  'C:\\Chris\\Studies\\SEN\\Project\\SEN381_Final_GroupE.pdf',
  'C:\\Chris\\Studies\\SEN\\SEN381_Final_GroupE.pdf'
];

outputPdfs.forEach(outPath => {
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileUrl = 'file:///' + tempHtml.replace(/\\/g, '/');
  const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${outPath}" "${fileUrl}"`;
  console.log(`Printing PDF to: ${outPath}...`);
  execSync(cmd, { stdio: 'ignore' });
  console.log(`Saved PDF: ${outPath}`);
});

console.log('PDF_GENERATION_COMPLETE');
