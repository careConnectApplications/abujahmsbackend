# Converting Maternity API Documentation to PDF

## Quick Methods to Convert HTML to PDF

### Method 1: Browser Print (Recommended for Quick PDF)
1. Open `maternity-api-documentation.html` in your web browser
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. Select "Save as PDF" as the destination
4. Ensure the following settings:
   - Paper size: A4.
   - Margins: Default or Custom (10mm)
   - Scale: 100%
   - Background graphics: Enabled (for colors)
5. Click "Save" and choose your file location

### Method 2: Using Node.js and Puppeteer (Professional Quality)

First, install puppeteer:
```bash
npm install puppeteer
```

Create a file `generate-pdf.js`:
```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load the HTML file
  await page.goto(`file://${path.join(__dirname, 'maternity-api-documentation.html')}`, {
    waitUntil: 'networkidle0'
  });

  // Generate PDF
  await page.pdf({
    path: 'maternity-api-documentation.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });

  await browser.close();
  console.log('PDF generated successfully!');
})();
```

Run the script:
```bash
node generate-pdf.js
```

### Method 3: Using wkhtmltopdf (Command Line)

Install wkhtmltopdf from: https://wkhtmltopdf.org/downloads.html

Then run:
```bash
wkhtmltopdf --enable-local-file-access --print-media-type --margin-top 20mm --margin-bottom 20mm --margin-left 20mm --margin-right 20mm maternity-api-documentation.html maternity-api-documentation.pdf
```

### Method 4: Online Converters
If you prefer online tools:
1. https://www.ilovepdf.com/html-to-pdf
2. https://www.web2pdfconvert.com/
3. https://pdfcrowd.com/

Simply upload the HTML file and download the converted PDF.

## Features of the Generated PDF

The HTML document has been optimized for PDF conversion with:
- **Professional styling** with clear typography
- **Page breaks** between major sections
- **Table of contents** for easy navigation
- **Color-coded elements** for better readability
- **Print-optimized CSS** for clean output
- **Comprehensive documentation** of all endpoints and data models

## PDF Content Includes

1. **Cover Page** with title and version information
2. **Table of Contents** for easy navigation
3. **Complete API Documentation** for all 6 maternity modules:
   - First Stage Labour
   - Second Stage Labour
   - Third Stage Labour
   - Birth Register
   - Postnatal Care
   - Mortality Register
4. **Detailed Endpoint Information** including:
   - HTTP methods
   - Request/response formats
   - Query parameters
   - Authentication requirements
5. **Data Model Specifications** with:
   - Field types and requirements
   - Enum values
   - Nested object structures
6. **Appendix** with all enumeration values

## Tips for Best Results

- Use Chrome or Edge browser for best rendering
- Enable "Background graphics" to preserve colors
- Check page preview before saving
- The document is already formatted for A4 paper size
- All code blocks and tables are optimized to prevent page breaks

The generated PDF will be approximately 30-40 pages and ready for distribution to your development team or API consumers.
