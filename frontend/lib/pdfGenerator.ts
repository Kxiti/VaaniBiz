/**
 * Generate and download a PDF of the business plan
 * Uses browser's print functionality for PDF generation
 */

export const generateBusinessPlanPDF = (
  transcription: string,
  aiResponse: string,
  roadmap: string,
  opportunities: any[]
) => {
  // Create a new window with the content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to download the PDF');
    return;
  }

  // Format the content for printing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>VaaniBiz Business Plan</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #6C63FF;
          }
          
          .header h1 {
            color: #6C63FF;
            font-size: 32px;
            margin-bottom: 10px;
          }
          
          .header p {
            color: #666;
            font-size: 14px;
          }
          
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 22px;
            font-weight: bold;
            color: #6C63FF;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0e0e0;
          }
          
          .business-idea {
            background: #f8f9ff;
            padding: 20px;
            border-left: 4px solid #6C63FF;
            margin-bottom: 30px;
            font-style: italic;
            font-size: 16px;
          }
          
          .content {
            font-size: 14px;
            line-height: 1.8;
          }
          
          .content h1, .content h2, .content h3 {
            color: #333;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          
          .content h1 { font-size: 20px; }
          .content h2 { font-size: 18px; }
          .content h3 { font-size: 16px; }
          
          .content ul, .content ol {
            margin-left: 25px;
            margin-bottom: 15px;
          }
          
          .content li {
            margin-bottom: 8px;
          }
          
          .content p {
            margin-bottom: 12px;
          }
          
          .content strong {
            color: #000;
            font-weight: 600;
          }
          
          .opportunity {
            background: #fff9e6;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #FFB800;
            page-break-inside: avoid;
          }
          
          .opportunity h4 {
            color: #FFB800;
            font-size: 16px;
            margin-bottom: 8px;
          }
          
          .opportunity p {
            font-size: 13px;
            margin-bottom: 5px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>VaaniBiz Business Plan</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Your Business Idea</div>
          <div class="business-idea">
            "${transcription}"
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Business Analysis & Insights</div>
          <div class="content">
            ${formatMarkdownToHTML(aiResponse)}
          </div>
        </div>
        
        ${roadmap ? `
          <div class="section">
            <div class="section-title">Startup Roadmap</div>
            <div class="content">
              ${formatMarkdownToHTML(roadmap)}
            </div>
          </div>
        ` : ''}
        
        ${opportunities.length > 0 ? `
          <div class="section">
            <div class="section-title">Business Opportunities</div>
            ${opportunities.map(opp => `
              <div class="opportunity">
                <h4>${opp.title}</h4>
                <p><strong>Type:</strong> ${opp.type}</p>
                <p><strong>Timing:</strong> ${opp.timing}</p>
                <p>${opp.description}</p>
                ${opp.actionItems ? `<p><strong>Action Items:</strong> ${opp.actionItems.join(', ')}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Generated by VaaniBiz AI - Empowering Entrepreneurs</p>
          <p>This business plan is for informational purposes only. Please consult with professionals before making business decisions.</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

/**
 * Convert markdown to basic HTML for PDF
 */
function formatMarkdownToHTML(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // Wrap consecutive list items in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');

  return html;
}
