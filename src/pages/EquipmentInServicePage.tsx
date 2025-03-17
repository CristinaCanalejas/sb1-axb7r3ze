import React, { useState } from 'react';
import { Wrench, Star, Clock, AlertCircle, Plus, Save, Trash2, ArrowLeftRight, User, FileText, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { generateMaintenanceRecordPDF } from '../utils/pdfGenerator';

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: Date;
  estimatedEndDate: Date;
  mechanicId: string;
  mechanicName: string;
  type: 'preventive' | 'corrective';
  status: 'in-progress' | 'paused' | 'completed';
  description: string;
  tasks: {
    id: string;
    description: string;
    completed: boolean;
  }[];
  spareParts: {
    name: string;
    quantity: number;
  }[];
}

const EquipmentInServicePage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: '1',
      equipmentId: 'EQ001',
      equipmentName: 'Camión Volvo FH',
      startDate: new Date('2024-03-15T08:00:00'),
      estimatedEndDate: new Date('2024-03-15T16:00:00'),
      mechanicId: '1',
      mechanicName: 'Carlos Rodríguez',
      type: 'preventive',
      status: 'in-progress',
      description: 'Mantenimiento preventivo de 10,000 km',
      tasks: [
        { id: '1', description: 'Cambio de aceite', completed: true },
        { id: '2', description: 'Cambio de filtros', completed: true },
        { id: '3', description: 'Revisión de frenos', completed: false },
        { id: '4', description: 'Alineación y balanceo', completed: false },
      ],
      spareParts: [
        { name: 'Aceite de motor', quantity: 40 },
        { name: 'Filtro de aceite', quantity: 1 },
        { name: 'Filtro de aire', quantity: 1 },
      ],
    },
    {
      id: '2',
      equipmentId: 'EQ002',
      equipmentName: 'Excavadora CAT 320',
      startDate: new Date('2024-03-15T09:30:00'),
      estimatedEndDate: new Date('2024-03-16T14:00:00'),
      mechanicId: '2',
      mechanicName: 'Ana Martínez',
      type: 'corrective',
      status: 'in-progress',
      description: 'Reparación sistema hidráulico',
      tasks: [
        { id: '1', description: 'Diagnóstico de fuga', completed: true },
        { id: '2', description: 'Reemplazo de manguera hidráulica', completed: false },
        { id: '3', description: 'Prueba de presión', completed: false },
      ],
      spareParts: [
        { name: 'Manguera hidráulica', quantity: 1 },
        { name: 'Aceite hidráulico', quantity: 20 },
      ],
    },
  ]);

  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [error, setError] = useState('');

  const equipment = [
    { id: 'EQ001', name: 'Camión Volvo FH' },
    { id: 'EQ002', name: 'Excavadora CAT 320' },
    { id: 'EQ003', name: 'Cargador Frontal 966H' },
  ];

  const mechanics = [
    { id: '1', name: 'Carlos Rodríguez' },
    { id: '2', name: 'Ana Martínez' },
    { id: '3', name: 'Luis García' },
  ];

  const commonTasks = [
    'Cambio de aceite',
    'Cambio de filtros',
    'Revisión de frenos',
    'Alineación y balanceo',
    'Diagnóstico general',
    'Revisión sistema eléctrico',
    'Revisión sistema hidráulico',
    'Calibración de válvulas',
  ];

  const commonSpareParts = [
    'Aceite de motor',
    'Filtro de aceite',
    'Filtro de aire',
    'Filtro de combustible',
    'Aceite hidráulico',
    'Manguera hidráulica',
    'Pastillas de freno',
    'Correa de distribución',
  ];

  const handleAddTask = () => {
    if (!editingRecord) return;
    setEditingRecord({
      ...editingRecord,
      tasks: [
        ...editingRecord.tasks,
        {
          id: Date.now().toString(),
          description: '',
          completed: false,
        },
      ],
    });
  };

  const handleRemoveTask = (taskId: string) => {
    if (!editingRecord) return;
    setEditingRecord({
      ...editingRecord,
      tasks: editingRecord.tasks.filter(task => task.id !== taskId),
    });
  };

  const handleAddSparePart = () => {
    if (!editingRecord) return;
    setEditingRecord({
      ...editingRecord,
      spareParts: [
        ...editingRecord.spareParts,
        {
          name: '',
          quantity: 1,
        },
      ],
    });
  };

  const handleRemoveSparePart = (index: number) => {
    if (!editingRecord) return;
    setEditingRecord({
      ...editingRecord,
      spareParts: editingRecord.spareParts.filter((_, i) => i !== index),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRecord) return;

    if (
      !editingRecord.equipmentId ||
      !editingRecord.mechanicId ||
      !editingRecord.type ||
      !editingRecord.description ||
      !editingRecord.tasks.length
    ) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setMaintenanceRecords(currentRecords => {
      const index = currentRecords.findIndex(r => r.id === editingRecord.id);
      if (index >= 0) {
        return [
          ...currentRecords.slice(0, index),
          editingRecord,
          ...currentRecords.slice(index + 1),
        ];
      }
      return [...currentRecords, { ...editingRecord, id: Date.now().toString() }];
    });

    setEditingRecord(null);
    setError('');
  };

  const handleDelete = (id: string) => {
    setMaintenanceRecords(currentRecords => currentRecords.filter(record => record.id !== id));
  };

  const handlePrint = (record: MaintenanceRecord) => {
    generateMaintenanceRecordPDF(record);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Equipos en Mantenimiento
            </h1>
            {!editingRecord && (
              <button
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setEditingRecord({
                  id: '',
                  equipmentId: '',
                  equipmentName: '',
                  startDate: new Date(),
                  estimatedEndDate: new Date(),
                  mechanicId: '',
                  mechanicName: '',
                  type: 'preventive',
                  status: 'in-progress',
                  description: '',
                  tasks: [],
                  spareParts: [],
                })}
              >
                <Plus className="w-4 h-4" />
                Nuevo Registro
              </button>
            )}
          </div>

          {editingRecord && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipo
                  </label>
                  <select
                    className="select"
                    value={editingRecord.equipmentId}
                    onChange={(e) => {
                      const selectedEquipment = equipment.find(eq => eq.id === e.target.value);
                      setEditingRecord({
                        ...editingRecord,
                        equipmentId: e.target.value,
                        equipmentName: selectedEquipment?.name || '',
                      });
                    }}
                  >
                    <option value="">Seleccionar Equipo</option>
                    {equipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.id} - {eq.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mecánico Asignado
                  </label>
                  <select
                    className="select"
                    value={editingRecord.mechanicId}
                    onChange={(e) => {
                      const selectedMechanic = mechanics.find(m => m.id === e.target.value);
                      setEditingRecord({
                        ...editingRecord,
                        mechanicId: e.target.value,
                        mechanicName: selectedMechanic?.name || '',
                      });
                    }}
                  >
                    <option value="">Seleccionar Mecánico</option>
                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Mantenimiento
                  </label>
                  <select
                    className="select"
                    value={editingRecord.type}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      type: e.target.value as 'preventive' | 'corrective',
                    })}
                  >
                    <option value="preventive">Preventivo</option>
                    <option value="corrective">Correctivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={format(editingRecord.startDate, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      startDate: new Date(e.target.value),
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Estimada Término
                  </label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={format(editingRecord.estimatedEndDate, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      estimatedEndDate: new Date(e.target.value),
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    className="select"
                    value={editingRecord.status}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      status: e.target.value as 'in-progress' | 'paused' | 'completed',
                    })}
                  >
                    <option value="in-progress">En Progreso</option>
                    <option value="paused">Pausado</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    className="input h-24 resize-none"
                    value={editingRecord.description}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      description: e.target.value,
                    })}
                    placeholder="Describa el trabajo a realizar..."
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Tareas
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary text-sm w-full sm:w-auto"
                      onClick={handleAddTask}
                    >
                      <Plus className="w-4 h-4" /> Agregar Tarea
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingRecord.tasks.map((task, index) => (
                      <div key={task.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="input flex-1"
                          value={task.description}
                          onChange={(e) => {
                            const newTasks = [...editingRecord.tasks];
                            newTasks[index].description = e.target.value;
                            setEditingRecord({ ...editingRecord, tasks: newTasks });
                          }}
                          placeholder="Descripción de la tarea..."
                        />
                        <button
                          type="button"
                          className="p-2 hover:bg-red-100 rounded-lg"
                          onClick={() => handleRemoveTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tareas Comunes
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      {commonTasks.map((task) => (
                        <button
                          key={task}
                          type="button"
                          className="text-sm p-2 border rounded-lg hover:bg-gray-50 text-left"
                          onClick={() => {
                            if (!editingRecord.tasks.some(t => t.description === task)) {
                              const newTask = {
                                id: Date.now().toString(),
                                description: task,
                                completed: false
                              };
                              setEditingRecord({
                                ...editingRecord,
                                tasks: [...editingRecord.tasks, newTask]
                              });
                            }
                          }}
                        >
                          {task}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Repuestos
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary text-sm w-full sm:w-auto"
                      onClick={handleAddSparePart}
                    >
                      <Plus className="w-4 h-4" /> Agregar Repuesto
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingRecord.spareParts.map((part, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <input
                          type="text"
                          className="input flex-1"
                          value={part.name}
                          onChange={(e) => {
                            const newParts = [...editingRecord.spareParts];
                            newParts[index].name = e.target.value;
                            setEditingRecord({ ...editingRecord, spareParts: newParts });
                          }}
                          placeholder="Nombre del repuesto..."
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="number"
                            className="input w-24"
                            min="1"
                            value={part.quantity}
                            onChange={(e) => {
                              const newParts = [...editingRecord.spareParts];
                              newParts[index].quantity = parseInt(e.target.value);
                              setEditingRecord({ ...editingRecord, spareParts: newParts });
                            }}
                          />
                          <button
                            type="button"
                            className="p-2 hover:bg-red-100 rounded-lg"
                            onClick={() => handleRemoveSparePart(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repuestos Comunes
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      {commonSpareParts.map((part) => (
                        <button
                          key={part}
                          type="button"
                          className="text-sm p-2 border rounded-lg hover:bg-gray-50 text-left"
                          onClick={() => {
                            if (!editingRecord.spareParts.some(p => p.name === part)) {
                              handleAddSparePart();
                              const newParts = [...editingRecord.spareParts];
                              newParts[newParts.length - 1].name = part;
                              setEditingRecord({ ...editingRecord, spareParts: newParts });
                            }
                          }}
                        >
                          {part}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={() => {
                    setEditingRecord(null);
                    setError('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  Guardar Registro
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {!editingRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {maintenanceRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {record.equipmentName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'completed' ? 'bg-green-100 text-green-800' :
                      record.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status === 'completed' ? 'Completado' :
                       record.status === 'paused' ? 'Pausado' : 'En Progreso'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Wrench className="w-4 h-4" />
                    <span className="text-sm capitalize">{record.type === 'preventive' ? 'Preventivo' : 'Correctivo'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setEditingRecord(record)}
                    title="Editar"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => handlePrint(record)}
                    title="Imprimir"
                  >
                    <Printer className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => handlePrint(record)}
                    title="Descargar PDF"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => handleDelete(record.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{record.mechanicName}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {format(record.startDate, 'dd/MM/yyyy HH:mm')} - {format(record.estimatedEndDate, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </h4>
                  <p className="text-sm text-gray-600">
                    {record.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Tareas ({record.tasks.filter(t => t.completed).length}/{record.tasks.length})
                  </h4>
                  <div className="space-y-1">
                    {record.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            const newRecord = { ...record };
                            const taskIndex = newRecord.tasks.findIndex(t => t.id === task.id);
                            newRecord.tasks[taskIndex].completed = !task.completed;
                            setMaintenanceRecords(current =>
                              current.map(r => r.id === record.id ? newRecord : r)
                            );
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {record.spareParts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Repuestos
                    </h4>
                    <div className="space-y-1">
                      {record.spareParts.map((part, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm text-gray-600"
                        >
                          <span>{part.name}</span>
                          <span className="font-medium">{part.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentInServicePage;