import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import type { PurchaseOrder, PurchaseRequest, WorkshopDelivery, Equipment, WorkingEquipment } from '../types';

export const generatePurchaseOrderPDF = (order: PurchaseOrder) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(12);
  doc.text('Orden de Compra', 14, 30);

  // Add order details
  doc.setFontSize(10);
  doc.text(`N° Orden: ${order.orderNumber}`, 14, 40);
  doc.text(`Fecha: ${format(order.date, 'dd/MM/yyyy')}`, 14, 45);
  doc.text(`Proveedor: ${order.supplier}`, 14, 50);
  doc.text(`Entrega estimada: ${format(order.expectedDeliveryDate, 'dd/MM/yyyy')}`, 14, 55);

  // Add status info
  const statusText = {
    pending: 'Pendiente',
    sent: 'Enviada',
    received: 'Recibida',
    completed: 'Completada',
    cancelled: 'Cancelada',
  }[order.status];
  doc.text(`Estado: ${statusText}`, 14, 60);

  // Add items table
  const tableData = order.items.map(item => [
    item.itemName,
    item.quantity.toString(),
    item.unit,
    `$${item.unitPrice.toLocaleString()}`,
    `$${item.totalPrice.toLocaleString()}`,
  ]);

  (doc as any).autoTable({
    startY: 70,
    head: [['Ítem', 'Cantidad', 'Unidad', 'Precio Unit.', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 25, halign: 'right' },
      2: { cellWidth: 25 },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  // Add total
  const finalY = (doc as any).lastAutoTable.finalY || 70;
  doc.text(`Total: $${order.totalAmount.toLocaleString()}`, 170, finalY + 10, { align: 'right' });

  // Add notes if any
  if (order.notes) {
    doc.text('Notas:', 14, finalY + 20);
    doc.setFontSize(9);
    doc.text(order.notes, 14, finalY + 25);
  }

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`orden_compra_${order.orderNumber}.pdf`);
};

export const generatePurchaseRequestPDF = (request: PurchaseRequest) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(12);
  doc.text('Solicitud de Compra', 14, 30);

  // Add request details
  doc.setFontSize(10);
  doc.text(`N° Solicitud: ${request.requestNumber}`, 14, 40);
  doc.text(`Fecha: ${format(request.date, 'dd/MM/yyyy')}`, 14, 45);
  doc.text(`Solicitante: ${request.requestedBy}`, 14, 50);
  doc.text(`Departamento: ${request.department}`, 14, 55);

  // Add status and priority info
  const statusText = {
    pending: 'Pendiente',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    completed: 'Completada',
  }[request.status];

  const priorityText = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  }[request.priority];

  doc.text(`Estado: ${statusText}`, 14, 60);
  doc.text(`Prioridad: ${priorityText}`, 14, 65);

  // Add equipment info if available
  if (request.equipmentName) {
    doc.text('Equipo Asignado:', 14, 75);
    doc.text(`${request.equipmentName} (${request.equipmentInternalNumber})`, 14, 80);
  }

  // Add items table
  const tableData = request.items.map(item => [
    item.itemName,
    item.quantity.toString(),
    item.unit,
    item.estimatedPrice ? `$${item.estimatedPrice.toLocaleString()}` : '-',
    item.estimatedPrice ? `$${(item.estimatedPrice * item.quantity).toLocaleString()}` : '-',
  ]);

  (doc as any).autoTable({
    startY: request.equipmentName ? 90 : 75,
    head: [['Ítem', 'Cantidad', 'Unidad', 'Precio Est.', 'Total Est.']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 25, halign: 'right' },
      2: { cellWidth: 25 },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 70;

  // Add approval info if available
  if (request.approvedBy) {
    doc.text('Información de Aprobación:', 14, finalY + 20);
    doc.text(`Aprobado por: ${request.approvedBy}`, 14, finalY + 25);
    doc.text(`Fecha de aprobación: ${format(request.approvalDate!, 'dd/MM/yyyy')}`, 14, finalY + 30);
  }

  // Add notes if any
  if (request.notes) {
    doc.text('Notas:', 14, finalY + (request.approvedBy ? 40 : 20));
    doc.setFontSize(9);
    doc.text(request.notes, 14, finalY + (request.approvedBy ? 45 : 25));
  }

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`solicitud_compra_${request.requestNumber}.pdf`);
};

export const generateWorkshopDeliveryPDF = (delivery: WorkshopDelivery) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(16);
  doc.text('Recibo de Entrega de Materiales', 14, 30);

  // Add delivery details
  doc.setFontSize(10);
  doc.text(`N° Entrega: ${delivery.deliveryNumber}`, 14, 45);
  doc.text(`Fecha: ${format(delivery.date, 'dd/MM/yyyy')}`, 14, 50);
  doc.text(`Hora: ${delivery.time}`, 14, 55);
  doc.text(`Departamento: ${delivery.department}`, 14, 60);
  doc.text(`Recibido por: ${delivery.receivedBy}`, 14, 65);

  // Add equipment info if available
  if (delivery.equipmentName) {
    doc.text('Equipo:', 14, 75);
    doc.text(`${delivery.equipmentName} (${delivery.equipmentInternalNumber})`, 14, 80);
  }

  // Add items table
  const tableData = delivery.items.map(item => [
    item.itemName,
    item.quantity.toString(),
    item.unit,
  ]);

  (doc as any).autoTable({
    startY: delivery.equipmentName ? 90 : 75,
    head: [['Ítem', 'Cantidad', 'Unidad']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 35 },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 70;

  // Add notes if any
  if (delivery.notes) {
    doc.text('Notas:', 14, finalY + 20);
    doc.setFontSize(9);
    doc.text(delivery.notes, 14, finalY + 25);
  }

  // Add signature spaces
  const signatureY = finalY + (delivery.notes ? 45 : 30);
  
  doc.setFontSize(10);
  doc.text('Entregado por:', 35, signatureY);
  doc.text('Recibido por:', 120, signatureY);

  doc.setDrawColor(100);
  doc.line(25, signatureY + 25, 85, signatureY + 25); // First signature line
  doc.line(110, signatureY + 25, 170, signatureY + 25); // Second signature line

  doc.setFontSize(8);
  doc.text('Nombre y Firma', 45, signatureY + 30);
  doc.text('Nombre y Firma', 130, signatureY + 30);

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`entrega_taller_${delivery.deliveryNumber}.pdf`);
};

export const generateEquipmentStatusPDF = (status: any) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(16);
  doc.text('Reporte de Estado de Equipo', 14, 30);

  // Add equipment details
  doc.setFontSize(10);
  doc.text(`Equipo: ${status.equipmentId} - ${status.equipmentName}`, 14, 45);
  doc.text(`Estado: ${status.status === 'operational' ? 'Operativo' : 'No Operativo'}`, 14, 50);
  doc.text(`Fecha de Salida: ${format(status.exitDate, 'dd/MM/yyyy')}`, 14, 55);
  doc.text(`Hora de Salida: ${status.exitTime}`, 14, 60);
  doc.text(`Supervisor: ${status.supervisor}`, 14, 65);
  doc.text(`Mecánico: ${status.mechanic}`, 14, 70);

  // Add problems section
  doc.text('Problemas Detectados:', 14, 85);
  status.problems.forEach((problem: string, index: number) => {
    doc.text(`• ${problem}`, 20, 95 + (index * 6));
  });

  // Add spare parts section
  const sparePartsY = 95 + (status.problems.length * 6) + 10;
  doc.text('Repuestos Requeridos:', 14, sparePartsY);
  status.spareParts.forEach((part: string, index: number) => {
    doc.text(`• ${part}`, 20, sparePartsY + 10 + (index * 6));
  });

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`estado_equipo_${status.equipmentId}_${format(status.exitDate, 'yyyyMMdd')}.pdf`);
};

export const generateEquipmentPDF = (equipment: Equipment) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(16);
  doc.text('Ficha de Equipo', 14, 30);

  // Add equipment details
  doc.setFontSize(10);
  doc.text(`N° Interno: ${equipment.internalNumber}`, 14, 45);
  doc.text(`Nombre: ${equipment.name}`, 14, 50);
  doc.text(`Tipo: ${equipment.type}`, 14, 55);
  doc.text(`Departamento: ${equipment.department}`, 14, 60);
  doc.text(`Estado: ${equipment.status === 'operational' ? 'Operativo' : 'No Operativo'}`, 14, 65);

  // Add technical sheet info if available
  if (equipment.technicalSheet) {
    doc.text('Ficha Técnica:', 14, 80);
    doc.text(`Archivo: ${equipment.technicalSheet}`, 20, 85);
  }

  // Add photos info if available
  if (equipment.photos && equipment.photos.length > 0) {
    doc.text('Fotos:', 14, 95);
    equipment.photos.forEach((photo, index) => {
      doc.text(`• ${photo}`, 20, 100 + (index * 5));
    });
  }

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`equipo_${equipment.internalNumber}.pdf`);
};

export const generateMaintenanceRecordPDF = (record: any) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(16);
  doc.text('Registro de Mantenimiento', 14, 30);

  // Add equipment details
  doc.setFontSize(10);
  doc.text(`Equipo: ${record.equipmentId} - ${record.equipmentName}`, 14, 45);
  doc.text(`Tipo: ${record.type === 'preventive' ? 'Preventivo' : 'Correctivo'}`, 14, 50);
  doc.text(`Estado: ${record.status}`, 14, 55);
  doc.text(`Mecánico: ${record.mechanicName}`, 14, 60);
  doc.text(`Fecha Inicio: ${format(record.startDate, 'dd/MM/yyyy HH:mm')}`, 14, 65);
  doc.text(`Fecha Estimada Término: ${format(record.estimatedEndDate, 'dd/MM/yyyy HH:mm')}`, 14, 70);

  // Add description
  doc.text('Descripción:', 14, 80);
  doc.setFontSize(9);
  doc.text(record.description, 14, 85);

  // Add tasks table
  doc.setFontSize(10);
  doc.text('Tareas:', 14, 100);

  const taskData = record.tasks.map((task: any) => [
    task.description,
    task.completed ? 'Completada' : 'Pendiente'
  ]);

  (doc as any).autoTable({
    startY: 105,
    head: [['Tarea', 'Estado']],
    body: taskData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
  });

  // Add spare parts table
  const finalY = (doc as any).lastAutoTable.finalY || 105;
  doc.text('Repuestos:', 14, finalY + 15);

  const sparePartsData = record.spareParts.map((part: any) => [
    part.name,
    part.quantity.toString()
  ]);

  (doc as any).autoTable({
    startY: finalY + 20,
    head: [['Repuesto', 'Cantidad']],
    body: sparePartsData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
  });

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`mantenimiento_${record.equipmentId}_${format(record.startDate, 'yyyyMMdd')}.pdf`);
};

export const generateWorkingEquipmentPDF = (equipment: WorkingEquipment) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(16);
  doc.text('Reporte de Equipo en Operación', 14, 30);

  // Add equipment details
  doc.setFontSize(10);
  doc.text(`Equipo: ${equipment.equipmentId} - ${equipment.equipmentName}`, 14, 45);
  doc.text(`Departamento: ${equipment.department}`, 14, 50);
  doc.text(`Operador: ${equipment.operatorName}`, 14, 55);
  doc.text(`Ubicación: ${equipment.location}`, 14, 60);
  doc.text(`Actividad: ${equipment.activity}`, 14, 65);
  doc.text(`Estado: ${equipment.status}`, 14, 70);
  doc.text(`Inicio: ${format(equipment.startTime, 'dd/MM/yyyy HH:mm')}`, 14, 75);
  doc.text(`Término Estimado: ${format(equipment.estimatedEndTime, 'dd/MM/yyyy HH:mm')}`, 14, 80);

  // Add notes if any
  if (equipment.notes) {
    doc.text('Notas:', 14, 90);
    doc.setFontSize(9);
    doc.text(equipment.notes, 14, 95);
  }

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`equipo_operacion_${equipment.equipmentId}_${format(equipment.startTime, 'yyyyMMdd')}.pdf`);
};

export const generateAllWorkingEquipmentPDF = (equipmentList: WorkingEquipment[]) => {
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.text('FleetCo Mining', 14, 20);
  doc.setFontSize(16);
  doc.text('Reporte de Equipos en Operación', 14, 30);

  // Add date
  doc.setFontSize(10);
  doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 40);
  doc.text(`Total de Equipos: ${equipmentList.length}`, 14, 45);

  // Create table data
  const tableData = equipmentList.map(equipment => [
    equipment.equipmentName,
    equipment.department,
    equipment.operatorName,
    equipment.location,
    equipment.activity,
    equipment.status,
    format(equipment.startTime, 'dd/MM/yyyy HH:mm'),
    format(equipment.estimatedEndTime, 'dd/MM/yyyy HH:mm')
  ]);

  // Add table
  (doc as any).autoTable({
    startY: 55,
    head: [['Equipo', 'Departamento', 'Operador', 'Ubicación', 'Actividad', 'Estado', 'Inicio', 'Término Est.']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
    },
  });

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text('FleetCo Mining - Sistema de Gestión de Flota', 14, pageHeight - 10);
  doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });

  // Save the PDF
  doc.save(`reporte_equipos_operacion_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
};