import React, { useState } from 'react';
import { Wrench, Star, Phone, Mail, Calendar, Plus, Save, AlertCircle, Edit, Trash2, Clock, CheckCircle2, XCircle, PenTool as Tool } from 'lucide-react';

interface Mechanic {
  id: string;
  name: string;
  specialties: string[];
  contact: {
    email: string;
    phone: string;
  };
  shift: string;
  experience: number;
  certifications: string[];
  availability: 'available' | 'busy' | 'off';
}

const MechanicsPage = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([
    {
      id: '1',
      name: 'Carlos Rodríguez',
      specialties: ['Motor', 'Transmisión', 'Sistema Eléctrico'],
      contact: {
        email: 'carlos.rodriguez@fleetco.cl',
        phone: '+56 9 1234 5678',
      },
      shift: 'Mañana (6:00 - 14:00)',
      experience: 8,
      certifications: ['Técnico Automotriz', 'Especialista Volvo', 'Certificación CAT'],
      availability: 'available',
    },
    {
      id: '2',
      name: 'Ana Martínez',
      specialties: ['Sistema Hidráulico', 'Frenos', 'Diagnóstico'],
      contact: {
        email: 'ana.martinez@fleetco.cl',
        phone: '+56 9 8765 4321',
      },
      shift: 'Tarde (14:00 - 22:00)',
      experience: 5,
      certifications: ['Técnico Maquinaria Pesada', 'Certificación Komatsu'],
      availability: 'busy',
    },
  ]);

  const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);
  const [error, setError] = useState('');

  const specialtiesList = [
    'Motor',
    'Transmisión',
    'Sistema Eléctrico',
    'Sistema Hidráulico',
    'Frenos',
    'Dirección',
    'Suspensión',
    'Diagnóstico',
    'Aire Acondicionado',
    'Soldadura',
  ];

  const certificationsList = [
    'Técnico Automotriz',
    'Técnico Maquinaria Pesada',
    'Especialista Volvo',
    'Especialista Mercedes-Benz',
    'Certificación CAT',
    'Certificación Komatsu',
    'Certificación John Deere',
    'Soldador Certificado',
  ];

  const shifts = [
    'Mañana (6:00 - 14:00)',
    'Tarde (14:00 - 22:00)',
    'Noche (22:00 - 6:00)',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMechanic) return;

    if (
      !editingMechanic.name ||
      !editingMechanic.contact.email ||
      !editingMechanic.contact.phone ||
      !editingMechanic.shift ||
      editingMechanic.specialties.length === 0
    ) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setMechanics(currentMechanics => {
      const index = currentMechanics.findIndex(m => m.id === editingMechanic.id);
      if (index >= 0) {
        return [
          ...currentMechanics.slice(0, index),
          editingMechanic,
          ...currentMechanics.slice(index + 1),
        ];
      }
      return [...currentMechanics, { ...editingMechanic, id: Date.now().toString() }];
    });

    setEditingMechanic(null);
    setError('');
  };

  const handleDelete = (id: string) => {
    setMechanics(currentMechanics => currentMechanics.filter(mechanic => mechanic.id !== id));
  };

  const getAvailabilityInfo = (availability: string) => {
    switch (availability) {
      case 'available':
        return { color: 'bg-green-100 text-green-800', text: 'Disponible', icon: CheckCircle2 };
      case 'busy':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'En Servicio', icon: Tool };
      case 'off':
        return { color: 'bg-red-100 text-red-800', text: 'Fuera de Turno', icon: XCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Desconocido', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Gestión de Mecánicos
            </h1>
            {!editingMechanic && (
              <button
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setEditingMechanic({
                  id: '',
                  name: '',
                  specialties: [],
                  contact: {
                    email: '',
                    phone: '',
                  },
                  shift: '',
                  experience: 0,
                  certifications: [],
                  availability: 'available',
                })}
              >
                <Plus className="w-4 h-4" />
                Nuevo Mecánico
              </button>
            )}
          </div>

          {editingMechanic && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingMechanic.name}
                    onChange={(e) => setEditingMechanic({
                      ...editingMechanic,
                      name: e.target.value,
                    })}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Años de Experiencia
                  </label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={editingMechanic.experience}
                    onChange={(e) => setEditingMechanic({
                      ...editingMechanic,
                      experience: parseInt(e.target.value),
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={editingMechanic.contact.email}
                    onChange={(e) => setEditingMechanic({
                      ...editingMechanic,
                      contact: {
                        ...editingMechanic.contact,
                        email: e.target.value,
                      },
                    })}
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={editingMechanic.contact.phone}
                    onChange={(e) => setEditingMechanic({
                      ...editingMechanic,
                      contact: {
                        ...editingMechanic.contact,
                        phone: e.target.value,
                      },
                    })}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turno
                  </label>
                  <select
                    className="select"
                    value={editingMechanic.shift}
                    onChange={(e) => setEditingMechanic({
                      ...editingMechanic,
                      shift: e.target.value,
                    })}
                  >
                    <option value="">Seleccionar Turno</option>
                    {shifts.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    className="select"
                    value={editingMechanic.availability}
                    onChange={(e) => setEditingMechanic({
                      ...editingMechanic,
                      availability: e.target.value as 'available' | 'busy' | 'off',
                    })}
                  >
                    <option value="available">Disponible</option>
                    <option value="busy">En Servicio</option>
                    <option value="off">Fuera de Turno</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidades
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {specialtiesList.map((specialty) => (
                      <label
                        key={specialty}
                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={editingMechanic.specialties.includes(specialty)}
                          onChange={(e) => {
                            const newSpecialties = e.target.checked
                              ? [...editingMechanic.specialties, specialty]
                              : editingMechanic.specialties.filter(s => s !== specialty);
                            setEditingMechanic({
                              ...editingMechanic,
                              specialties: newSpecialties,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificaciones
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {certificationsList.map((cert) => (
                      <label
                        key={cert}
                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={editingMechanic.certifications.includes(cert)}
                          onChange={(e) => {
                            const newCertifications = e.target.checked
                              ? [...editingMechanic.certifications, cert]
                              : editingMechanic.certifications.filter(c => c !== cert);
                            setEditingMechanic({
                              ...editingMechanic,
                              certifications: newCertifications,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-700">{cert}</span>
                      </label>
                    ))}
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
                    setEditingMechanic(null);
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
                  {editingMechanic.id ? 'Actualizar Mecánico' : 'Guardar Mecánico'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {!editingMechanic && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanics.map((mechanic) => {
            const availabilityInfo = getAvailabilityInfo(mechanic.availability);
            const AvailabilityIcon = availabilityInfo.icon;

            return (
              <div
                key={mechanic.id}
                className="bg-white rounded-lg shadow p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {mechanic.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${availabilityInfo.color}`}>
                        <AvailabilityIcon className="w-3 h-3" />
                        {availabilityInfo.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">{mechanic.experience} años de experiencia</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-1 hover:bg-gray-100 rounded-lg"
                      onClick={() => setEditingMechanic(mechanic)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded-lg"
                      onClick={() => handleDelete(mechanic.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{mechanic.shift}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{mechanic.contact.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{mechanic.contact.phone}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Especialidades
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {mechanic.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Certificaciones
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {mechanic.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MechanicsPage;