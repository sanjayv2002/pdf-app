import { rejects } from "assert"
import { resolve } from "path"

export const pdfToBase64 = async(file: File): Promise<string> => {
    return new Promise((resolve, rejects) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = rejects;
        reader.readAsDataURL(file);
    });
};

export const base64ToPdf = (base64: string, fileName: string): void => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = fileName;
    link.click();
  };


  export const viewPdf = (base64: string): void => {
    const pdfWindow = window.open("");
    pdfWindow?.document.write(
      `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64}'></iframe>`
    );
  };

  