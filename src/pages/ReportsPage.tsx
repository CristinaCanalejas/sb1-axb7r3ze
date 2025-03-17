import React, { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, Filter, ChevronDown, FileText, Table, FileJson, File as FilePdf } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MasterDataService from '../services/masterDataService';
import WarehouseService from '../services/warehouseService';
import EquipmentService from '../services/equipmentService';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('fuel');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [department, setDepartment] = useState('');
  const [showExportFormats, setShowExportFormats] = useState(false);

  const masterDataService = MasterDataService.getInstance();
  const warehouseService = WarehouseService.getInstance();
  const equipmentService = EquipmentService.getInstance();

  const exportFormats = [
    { id: 'xlsx', name: 'Excel (XLSX)', icon: Table },
    { id: 'csv', name: 'CSV', icon: FileText },
    { id: 'json', name: 'JSON', icon: FileJson },
    { id: 'pdf', name: 'PDF', icon: FilePdf },
  ];

  const reports = [
    {
      id: 'fuel',
      name: 'Consumo de Combustible',
      description: 'Reporte detallado del consumo de combustible por equipo y departamento.',
      columns: ['Fecha', 'Equipo', 'Departamento', 'Operador', 'Tipo Combustible', 'Litros', 'Odómetro'],
    },
    {
      id: 'maintenance',
      name: 'Mantenimientos',
      description: 'Historial de mantenimientos preventivos y correctivos.',
      columns: ['Fecha', 'Equipo', 'Tipo', 'Problemas', 'Repuestos', 'Mecánico', 'Estado'],
    },
    {
      id: 'equipment',
      name: 'Estado de Equipos',
      description: 'Estado actual e historial de disponibilidad de equipos.',
      columns: ['Equipo', 'Estado', 'Última Actualización', 'Tiempo Operativo', 'Incidentes', 'Departamento'],
    },
    {
      id: 'operators',
      name: 'Operadores',
      description: 'Registro de operadores por departamento y equipos asignados.',
      columns: ['Nombre', 'Departamento', 'Equipos Asignados', 'Turnos', 'Contacto'],
    },
    {
      id: 'personnel',
      name: 'Personal',
      description: 'Registro de operadores, mecánicos y supervisores.',
      columns: ['Nombre', 'Departamento', 'Roles', 'Turnos', 'Contacto'],
    },
  ];

  const departments = masterDataService.getDepartments();

  // Mock data for preview
  const previewData = {
    fuel: [
      {
        date: '10/03/2024',
        equipment: 'Camión Volvo FH',
        department: 'TRANSPORTE',
        operator: 'Juan Pérez',
        fuelType: 'Diesel',
        liters: '150.5',
        odometer: '125,000',
      },
      {
        date: '10/03/2024',
        equipment: 'Excavadora CAT 320',
        department: 'EXTRACCIÓN',
        operator: 'María González',
        fuelType: 'Diesel',
        liters: '200.0',
        odometer: '3,500',
      },
    ],
    operators: masterDataService.getOperators().map(operator => ({
      name: operator.name,
      department: operator.department,
      equipments: equipmentService.getWorkingEquipment()
        .filter(eq => eq.operatorId === operator.id)
        .map(eq => eq.equipmentName)
        .join(', ') || 'Sin equipos asignados',
      shifts: masterDataService.getPersonnel(undefined, 'Operador')
        .find(p => p.id === operator.id)?.shifts?.join(', ') || 'Sin turnos asignados',
      contact: masterDataService.getPersonnel(undefined, 'Operador')
        .find(p => p.id === operator.id)?.contact?.phone || '-',
    })),
  };

  const handleGenerateReport = () => {
    console.log('Generating report with filters:', {
      type: selectedReport,
      dateRange,
      department,
    });
  };

  const handleExport = (format: string) => {
    if (format === 'pdf') {
      const currentReport = reports.find(r => r.id === selectedReport);
      if (!currentReport) return;

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text(currentReport.name, 14, 20);

      // Add filters info
      doc.setFontSize(10);
      doc.text(`Fecha: ${dateRange.start} - ${dateRange.end}`, 14, 30);
      doc.text(`Departamento: ${department || 'Todos'}`, 14, 35);

      // Add table
      if (selectedReport === 'fuel' && previewData.fuel) {
        const tableData = previewData.fuel.map(row => [
          row.date,
          row.equipment,
          row.department,
          row.operator,
          row.fuelType,
          row.liters,
          row.odometer,
        ]);

        (doc as any).autoTable({
          head: [currentReport.columns],
          body: tableData,
          startY: 40,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [59, 130, 246] },
        });
      } else if (selectedReport === 'operators' && previewData.operators) {
        const tableData = previewData.operators.map(row => [
          row.name,
          row.department,
          row.equipments,
          row.shifts,
          row.contact,
        ]);

        (doc as any).autoTable({
          head: [currentReport.columns],
          body: tableData,
          startY: 40,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [59, 130, 246] },
        });
      }

      // Save the PDF
      doc.save(`${currentReport.name}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    }

    console.log('Exporting as:', format);
    setShowExportFormats(false);
  };

  const currentReport = reports.find(r => r.id === selectedReport);

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Generación de Reportes
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <button
                key={report.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className={`w-5 h-5 ${
                    selectedReport === report.id ? 'text-blue-500' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{report.name}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {report.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Fechas
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="input"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  className="input"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <select
                className="select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Todos</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={handleGenerateReport}
              >
                <Download className="w-4 h-4" />
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {currentReport && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Vista Previa: {currentReport.name}
                </h2>
              </div>
              <div className="relative">
                <button
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={() => setShowExportFormats(!showExportFormats)}
                >
                  <Download className="w-4 h-4" />
                  Exportar
                  <ChevronDown className={`w-4 h-4 transition-transform ${showExportFormats ? 'rotate-180' : ''}`} />
                </button>

                {/* Export Format Dropdown */}
                {showExportFormats && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    {exportFormats.map((format) => (
                      <button
                        key={format.id}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleExport(format.id)}
                      >
                        <format.icon className="w-4 h-4" />
                        {format.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {currentReport.columns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedReport === 'fuel' && previewData.fuel.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.equipment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.operator}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.fuelType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.liters}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.odometer}</td>
                    </tr>
                  ))}
                  {selectedReport === 'operators' && previewData.operators.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.equipments}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.shifts}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;