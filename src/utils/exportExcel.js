import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (reports) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte Taxi');

  // Helper to get month name
  const getMonthName = () => {
    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  };

  const monthName = getMonthName();

  // Sort reports chronologically
  const sortedReports = [...reports].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Separate incomes and expenses
  const incomes = sortedReports.filter(r => r.type === 'income');
  const expenses = sortedReports.filter(r => r.type === 'expense');

  // Calculate totals
  const totalIncome = incomes.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpense = expenses.reduce((sum, r) => sum + Number(r.amount), 0);
  const netTotal = totalIncome - totalExpense;

  // Set column widths
  worksheet.columns = [
    { key: 'A', width: 3 }, // spacer
    { key: 'B', width: 14 }, // Fecha Registro
    { key: 'C', width: 14 }, // Fecha Reporte
    { key: 'D', width: 16 }, // Dia
    { key: 'E', width: 20 }, // Servicio
    { key: 'F', width: 15 }, // Ingreso
    { key: 'G', width: 18 }, // Total Ingreso
    { key: 'H', width: 3 }, // spacer
    { key: 'I', width: 14 }, // Fecha Registro
    { key: 'J', width: 14 }, // Fecha Reporte
    { key: 'K', width: 16 }, // Dia
    { key: 'L', width: 20 }, // Nombre Gasto
    { key: 'M', width: 15 }, // Gasto
    { key: 'N', width: 18 }, // Total Gasto
    { key: 'O', width: 3 }, // spacer
    { key: 'P', width: 15 }, // Total
  ];

  // --- Row 2: Titles ---
  worksheet.mergeCells('D2:F3');
  worksheet.getCell('D2').value = `INGRESOS DEL TAXI MES ${monthName}`;
  worksheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('D2').font = { bold: true };

  worksheet.mergeCells('K2:M3');
  worksheet.getCell('K2').value = `GASTOS TAXI MES ${monthName}`;
  worksheet.getCell('K2').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('K2').font = { bold: true };

  // --- Row 5: Headers ---
  const headerStyle = {
    font: { bold: true },
    alignment: { vertical: 'middle', horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  const setHeader = (cell, value) => {
    const c = worksheet.getCell(cell);
    c.value = value;
    c.style = headerStyle;
  };

  setHeader('B5', 'Fecha (Registro)');
  setHeader('C5', 'Fecha (Reporte)');
  setHeader('D5', 'Día de la semana');
  setHeader('E5', 'Nombre de servicio');
  setHeader('F5', 'Ingreso');
  setHeader('G5', 'Total Ingresos');

  setHeader('I5', 'Fecha (Registro)');
  setHeader('J5', 'Fecha (Reporte)');
  setHeader('K5', 'Día de la semana');
  setHeader('L5', 'Nombre del gasto');
  setHeader('M5', 'Gastos');
  setHeader('N5', 'Total de gastos');

  setHeader('P5', 'Total Neto');

  // --- Fill Data (starts at Row 6) ---
  const maxRows = Math.max(incomes.length, expenses.length);
  const rowStart = 6;

  for (let i = 0; i < maxRows; i++) {
    const rowNum = rowStart + i;
    const income = incomes[i];
    const expense = expenses[i];

    // Helpers for date formatting
    const formatDate = (isoString) => {
      if (!isoString) return '';
      const d = new Date(isoString);
      if (isNaN(d)) return '';
      return d.toLocaleDateString('es-CO');
    };

    const parseReportDate = (str) => {
      if(!str) return { dayName: '', dateStr: '' };
      const parts = str.split(',');
      if (parts.length === 2) {
        return { dayName: parts[0].trim(), dateStr: parts[1].trim() };
      }
      return { dayName: '', dateStr: str };
    };

    const cellBorder = {
      top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
      right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
    };

    const alignCenter = { vertical: 'middle', horizontal: 'center' };

    // Fill Income
    if (income) {
      const { dayName, dateStr } = parseReportDate(income.date);

      worksheet.getCell(`B${rowNum}`).value = formatDate(income.createdAt);
      worksheet.getCell(`B${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`B${rowNum}`).border = cellBorder;

      worksheet.getCell(`C${rowNum}`).value = dateStr;
      worksheet.getCell(`C${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`C${rowNum}`).border = cellBorder;

      worksheet.getCell(`D${rowNum}`).value = dayName;
      worksheet.getCell(`D${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`D${rowNum}`).border = cellBorder;

      worksheet.getCell(`E${rowNum}`).value = 'Taxi'; // Default
      worksheet.getCell(`E${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`E${rowNum}`).border = cellBorder;

      worksheet.getCell(`F${rowNum}`).value = Number(income.amount);
      worksheet.getCell(`F${rowNum}`).numFmt = '"$"#,##0';
      worksheet.getCell(`F${rowNum}`).font = { color: { argb: 'FF92D050' } }; // Light green
      worksheet.getCell(`F${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`F${rowNum}`).border = cellBorder;
    } else {
      ['B', 'C', 'D', 'E', 'F'].forEach(col => {
        worksheet.getCell(`${col}${rowNum}`).border = cellBorder;
      });
    }

    // Fill Expense
    if (expense) {
      const { dayName, dateStr } = parseReportDate(expense.date);

      worksheet.getCell(`I${rowNum}`).value = formatDate(expense.createdAt);
      worksheet.getCell(`I${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`I${rowNum}`).border = cellBorder;

      worksheet.getCell(`J${rowNum}`).value = dateStr;
      worksheet.getCell(`J${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`J${rowNum}`).border = cellBorder;

      worksheet.getCell(`K${rowNum}`).value = dayName;
      worksheet.getCell(`K${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`K${rowNum}`).border = cellBorder;

      worksheet.getCell(`L${rowNum}`).value = expense.description || 'Gasto';
      worksheet.getCell(`L${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`L${rowNum}`).border = cellBorder;

      worksheet.getCell(`M${rowNum}`).value = Number(expense.amount);
      worksheet.getCell(`M${rowNum}`).numFmt = '"$"#,##0';
      worksheet.getCell(`M${rowNum}`).font = { color: { argb: 'FFFF0000' } }; // Red
      worksheet.getCell(`M${rowNum}`).alignment = alignCenter;
      worksheet.getCell(`M${rowNum}`).border = cellBorder;
    } else {
      ['I', 'J', 'K', 'L', 'M'].forEach(col => {
        worksheet.getCell(`${col}${rowNum}`).border = cellBorder;
      });
    }
  }

  // --- Totals Row (Row 6) ---
  const totalBorder = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Income Total (G6)
  const cellG6 = worksheet.getCell('G6');
  cellG6.value = totalIncome;
  cellG6.numFmt = '"$"#,##0';
  cellG6.font = { color: { argb: 'FF375623' } };
  cellG6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
  cellG6.alignment = { vertical: 'middle', horizontal: 'center' };
  cellG6.border = totalBorder;

  // Expense Total (N6)
  const cellN6 = worksheet.getCell('N6');
  cellN6.value = totalExpense;
  cellN6.numFmt = '"$"#,##0';
  cellN6.font = { color: { argb: 'FFC00000' } };
  cellN6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } };
  cellN6.alignment = { vertical: 'middle', horizontal: 'center' };
  cellN6.border = totalBorder;

  // Net Total (P6)
  const cellP6 = worksheet.getCell('P6');
  cellP6.value = netTotal;
  cellP6.numFmt = '"$"#,##0';
  cellP6.font = { color: { argb: netTotal >= 0 ? 'FF375623' : 'FFC00000' } };
  cellP6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: netTotal >= 0 ? 'FFE2EFDA' : 'FFFCE4D6' } };
  cellP6.alignment = { vertical: 'middle', horizontal: 'center' };
  cellP6.border = totalBorder;

  // =============================================
  // SHEET 2: Comprobantes (embedded receipt images)
  // =============================================
  const photosSheet = workbook.addWorksheet('Comprobantes');

  photosSheet.columns = [
    { width: 3 },   // A spacer
    { width: 20 },  // B Fecha Reporte
    { width: 16 },  // C Día
    { width: 14 },  // D Tipo
    { width: 18 },  // E Monto
    { width: 35 },  // F Descripción
    { width: 50 },  // G Foto
  ];

  // Sheet title
  photosSheet.mergeCells('B2:G2');
  photosSheet.getCell('B2').value = `COMPROBANTES - ${monthName}`;
  photosSheet.getCell('B2').font = { bold: true, size: 13 };
  photosSheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };

  // Headers
  const photoHeaderStyle = {
    font: { bold: true },
    alignment: { vertical: 'middle', horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } },
    border: {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    }
  };
  ['B4', 'C4', 'D4', 'E4', 'F4', 'G4'].forEach((cell, i) => {
    const labels = ['Fecha Reporte', 'Día', 'Tipo', 'Monto', 'Descripción', 'Comprobante'];
    photosSheet.getCell(cell).value = labels[i];
    photosSheet.getCell(cell).style = photoHeaderStyle;
  });

  // Fill rows with images
  const reportsWithImages = sortedReports.filter(r => r.image);
  const IMG_HEIGHT_PX = 160; // approx pixel height per row
  const ROW_HEIGHT_PT = 120; // Excel row height in points

  const formatDateSimple = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('es-CO');
  };
  const getDaySimple = (str) => {
    if (!str) return '';
    const parts = str.split(',');
    return parts[0]?.trim() || str;
  };

  const photoCellBorder = {
    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
  };

  let photoRow = 5;
  for (const report of reportsWithImages) {
    // Fill metadata cells
    const setCell = (col, val, extra = {}) => {
      const c = photosSheet.getCell(`${col}${photoRow}`);
      c.value = val;
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      c.border = photoCellBorder;
      Object.assign(c, extra);
    };

    setCell('B', report.date || '');
    setCell('C', getDaySimple(report.date));
    setCell('D', report.type === 'income' ? 'Ingreso' : 'Gasto');

    const amountCell = photosSheet.getCell(`E${photoRow}`);
    amountCell.value = Number(report.amount);
    amountCell.numFmt = '"$"#,##0';
    amountCell.font = { color: { argb: report.type === 'income' ? 'FF375623' : 'FFC00000' } };
    amountCell.alignment = { vertical: 'middle', horizontal: 'center' };
    amountCell.border = photoCellBorder;

    setCell('F', report.description || '—');
    photosSheet.getCell(`G${photoRow}`).border = photoCellBorder;

    // Set tall row height for image
    photosSheet.getRow(photoRow).height = ROW_HEIGHT_PT;

    // Try to fetch and embed image
    try {
      const response = await fetch(report.image);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const url = report.image.toLowerCase().split('?')[0];
        let extension = 'jpeg';
        if (url.endsWith('.png')) extension = 'png';
        else if (url.endsWith('.gif')) extension = 'gif';
        else if (url.endsWith('.webp')) extension = 'png'; // fallback

        const imageId = workbook.addImage({ buffer: arrayBuffer, extension });
        photosSheet.addImage(imageId, {
          tl: { col: 6, row: photoRow - 1 }, // col G = index 6
          br: { col: 7, row: photoRow },
          editAs: 'oneCell'
        });
      }
    } catch (e) {
      photosSheet.getCell(`G${photoRow}`).value = 'No se pudo cargar';
    }

    photoRow++;
  }

  if (reportsWithImages.length === 0) {
    photosSheet.getCell('B5').value = 'No hay comprobantes con imagen adjunta.';
    photosSheet.getCell('B5').font = { color: { argb: 'FF888888' } };
  }

  // Write file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Reporte_Taxi_${monthName}.xlsx`);
};

