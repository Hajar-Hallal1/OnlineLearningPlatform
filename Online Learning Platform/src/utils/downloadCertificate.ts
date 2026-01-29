import { jsPDF } from "jspdf";

export const downloadCertificate = (courseTitle: string, instructorName: string) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1123, 794], // A4 landscape size in px
  });

  // Background color or border (optional)
  doc.setFillColor(240, 240, 240); // light gray
  doc.rect(0, 0, 1123, 794, "F"); 

  // Certificate title
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("Certificate of Completion", 1123 / 2, 150, { align: "center" });

  // Course title
  doc.setFontSize(28);
  doc.setFont("helvetica", "normal");
  doc.text(`This certificate is awarded for completing`, 1123 / 2, 250, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(`"${courseTitle}"`, 1123 / 2, 300, { align: "center" });

  // Instructor
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text(`Instructor: ${instructorName}`, 1123 / 2, 400, { align: "center" });

  // Date
  const today = new Date().toLocaleDateString();
  doc.text(`Date: ${today}`, 1123 / 2, 460, { align: "center" });

  // Save PDF
  doc.save(`${courseTitle}_certificate.pdf`);
};
