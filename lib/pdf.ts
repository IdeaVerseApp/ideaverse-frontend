import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { IdeaDetail } from '@/types/idea';

export const downloadIdeaAsPdf = (idea: IdeaDetail, experiment: string) => {
  if (!idea) return;

  const pdfElement = typeof window !== 'undefined' ? document.getElementById('pdf-content') : null;
  if (pdfElement) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = `
      [data-state="closed"] { display: block !important; }
      body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
    `;
    document.head.appendChild(tempStyle);

    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    }

    const options = {
      margin: [20, 20],
      filename: `idea_${idea.task_id || 'details'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    } as const;

    // Dynamically import html2pdf only when needed to avoid SSR issues
    import('html2pdf.js').then((html2pdf) => {
      const worker = html2pdf.default().set(options).from(pdfElement);
      
      worker.save().then(() => {
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        }
        document.head.removeChild(tempStyle);
      }).catch((err: any) => {
        console.error("Error generating PDF:", err);
        // Cleanup even if there's an error
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        }
        document.head.removeChild(tempStyle);
      });
    }).catch((err: any) => {
      console.error("Error loading html2pdf:", err);
      // Cleanup on import error
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
      document.head.removeChild(tempStyle);
    });

    return; // Skip the legacy builder
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let yOffset = margin;

  // Helper functions
  const addSectionTitle = (title: string) => {
    yOffset += 24;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yOffset);
    yOffset += 16;
    doc.setFont('helvetica', 'normal');
  };
  const addSubTitle = (title: string) => {
    yOffset += 18;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yOffset);
    yOffset += 12;
    doc.setFont('helvetica', 'normal');
  };
  const addText = (text: string, fontSize = 11, indent = 0, extraSpace = 14) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - indent);
    doc.text(lines, margin + indent, yOffset);
    yOffset += lines.length * (fontSize + 7) + extraSpace;
  };
  const addList = (items: string[], numbered = false, indent = 20, extraSpace = 12) => {
    if (!items || items.length === 0) return;
    items.forEach((item, idx) => {
      const prefix = numbered ? `${idx + 1}. ` : '\u2022 ';
      addText(`${prefix}${item}`, 11, indent, 4);
    });
    yOffset += extraSpace;
  };
  const addHorizontalLine = () => {
    yOffset += 8;
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 10;
  };
  const checkNewPage = (neededHeight = 40) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (yOffset + neededHeight > pageHeight - margin) {
      doc.addPage();
      yOffset = margin;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Research Idea Details', pageWidth / 2, yOffset, { align: 'center' });
  yOffset += 30;
  doc.setFont('helvetica', 'normal');

  // Task ID
  doc.setFontSize(10);
  doc.text(`Task ID: ${idea.task_id}`, margin, yOffset);
  yOffset += 16;
  addHorizontalLine();

  // Seed Idea
  addSectionTitle('Seed Idea / Task Description');
  addText(idea.task_description || experiment, 11);
  addHorizontalLine();

  // Generated Ideas
  addSectionTitle('Generated Ideas');
  idea.ideas.forEach((genIdea, idx) => {
    checkNewPage(120);
    addSubTitle(`Idea ${idx + 1}: ${genIdea.Title}`);
    if (genIdea.Name) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Name:`, margin, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(genIdea.Name, margin + 50, yOffset);
      yOffset += 16;
    }
    // Description
    if (genIdea.description) {
      addSubTitle('Description');
      addText(genIdea.description, 11, 10);
    }
    // Experiment
    if (genIdea.Experiment) {
      addSubTitle('Experiment');
      addText(genIdea.Experiment, 11, 10);
    }
    // Scores
    addSubTitle('Scores');
    addText(`Interestingness: ${genIdea.Interestingness}`, 11, 10);
    addText(`Feasibility: ${genIdea.Feasibility}`, 11, 10);
    addText(`Novelty: ${genIdea.Novelty}`, 11, 10);
    if (genIdea.scientific_merit !== undefined)
      addText(`Scientific Merit: ${(genIdea.scientific_merit * 100).toFixed(0)}%`, 11, 10);
    if (genIdea.innovation_level !== undefined)
      addText(`Innovation Level: ${(genIdea.innovation_level * 100).toFixed(0)}%`, 11, 10);
    // Implementation Steps
    if (genIdea.implementation_steps && genIdea.implementation_steps.length > 0) {
      addSubTitle('Implementation Steps');
      addList(genIdea.implementation_steps, true, 20);
    }
    // Expected Outcomes
    if (genIdea.expected_outcomes && genIdea.expected_outcomes.length > 0) {
      addSubTitle('Expected Outcomes');
      addList(genIdea.expected_outcomes, false, 20);
    }
    // Potential Challenges
    if (genIdea.potential_challenges && genIdea.potential_challenges.length > 0) {
      addSubTitle('Potential Challenges');
      addList(genIdea.potential_challenges, false, 20);
    }
    // Mitigation Strategies
    if (genIdea.mitigation_strategies && genIdea.mitigation_strategies.length > 0) {
      addSubTitle('Mitigation Strategies');
      addList(genIdea.mitigation_strategies, false, 20);
    }
    // Developer's Thought
    if (genIdea.thought) {
      addSubTitle("Developer's Thought");
      doc.setFont('helvetica', 'italic');
      addText(genIdea.thought, 11, 10);
      doc.setFont('helvetica', 'normal');
    }
    addHorizontalLine();
  });

  // Similar Papers Table
  if (idea.similar_papers && idea.similar_papers.length > 0) {
    checkNewPage(120);
    addSectionTitle('Similar Research Papers');
    autoTable(doc, {
      startY: yOffset,
      head: [['Title', 'Authors', 'Year', 'Source', 'Similarity']],
      body: idea.similar_papers.map(paper => [
        paper.title,
        paper.authors.slice(0, 2).join(", ") + (paper.authors.length > 2 ? " et al." : ""),
        paper.year || 'N/A',
        paper.source,
        paper.semantic_similarity.toFixed(3)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold', fontSize: 11 },
      bodyStyles: { fontSize: 10 },
      margin: { left: margin, right: margin },
      styles: { cellPadding: 4 },
      didDrawPage: (data) => {
        if (data.cursor) {
          yOffset = data.cursor.y + 10;
        }
      }
    });
    addHorizontalLine();
  }

  doc.save(`idea_${idea.task_id || 'details'}.pdf`);
}; 