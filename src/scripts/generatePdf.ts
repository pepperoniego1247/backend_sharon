import path from "path";
import fs from 'fs';
import * as ejs from "ejs";
import PuppeteerHTMLPDF from "puppeteer-html-pdf";

export const generatePdf = async (data: any) => {
    try {
        const templatePath = path.join(__dirname, '../extras/saleNote.ejs');
        const template = fs.readFileSync(templatePath, 'utf-8');
        const html = ejs.render(template, data);
        const htmlPdf = new PuppeteerHTMLPDF();
        htmlPdf.setOptions({ format: "A4", printBackground: true });
        const pdf = await htmlPdf.create(html);

        return pdf;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('PDF generation failed');
    }
}
