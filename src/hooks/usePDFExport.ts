import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(async (elementId: string, fileName: string = "cv") => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast.error("Could not find CV to export");
        return;
      }

      // Create a clone to avoid modifying the original
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.transform = "none";
      clone.style.width = "794px"; // A4 width in pixels at 96 DPI
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${fileName}.pdf`);
      
      toast.success("CV downloaded successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export CV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportToPDF, isExporting };
}
