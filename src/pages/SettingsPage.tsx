import React, { useState } from 'react';
import { Save, AlertCircle, Building2, Users, Fuel, Bell, Lock, Mail } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [companySettings, setCompanySettings] = useState({
    name: 'FleetCo Mining',
    address: 'Av. Principal 1234',
    phone: '+56 2 2345 6789',
    email: 'contacto@fleetco.cl',
    logo: '',
    timezone: 'America/Santiago',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
    statusUpdates: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [departmentSettings, setDepartmentSettings] = useState({
    departments: ['EXTRACCIÓN', 'TRANSPORTE', 'ADMINISTRACIÓN'],
    newDepartment: '',
  });

  const [userSettings, setUserSettings] = useState({
    defaultRole: 'operator',
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 60,
  });

  const [fuelSettings, setFuelSettings] = useState({
    fuelTypes: ['Diesel', 'Gasolina 95', 'Gasolina 97'],
    newFuelType: '',
    alertThreshold: 100,
    measurementUnit: 'liters',
  });

  const tabs = [
    { id: 'company', name: 'Empresa', icon: Building2 },
    { id: 'departments', name: 'Departamentos', icon: Users },
    { id: 'fuel', name: 'Combustible', icon: Fuel },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'security', name: 'Seguridad', icon: Lock },
  ];

  const timezones = [
    'America/Santiago',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Lima',
    'America/Bogota',
  ];

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', {
      companySettings,
      notificationSettings,
      departmentSettings,
      userSettings,
      fuelSettings,
    });

    setSuccess('Configuración guardada exitosamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddDepartment = () => {
    if (!departmentSettings.newDepartment.trim()) {
      setError('Por favor ingrese un nombre de departamento');
      return;
    }

    if (departmentSettings.departments.includes(departmentSettings.newDepartment.trim())) {
      setError('Este departamento ya existe');
      return;
    }

    setDepartmentSettings({
      ...departmentSettings,
      departments: [...departmentSettings.departments, departmentSettings.newDepartment.trim()],
      newDepartment: '',
    });
    setError('');
  };

  const handleRemoveDepartment = (dept: string) => {
    setDepartmentSettings({
      ...departmentSettings,
      departments: departmentSettings.departments.filter(d => d !== dept),
    });
  };

  const handleAddFuelType = () => {
    if (!fuelSettings.newFuelType.trim()) {
      setError('Por favor ingrese un tipo de combustible');
      return;
    }

    if (fuelSettings.fuelTypes.includes(fuelSettings.newFuelType.trim())) {
      setError('Este tipo de combustible ya existe');
      return;
    }

    setFuelSettings({
      ...fuelSettings,
      fuelTypes: [...fuelSettings.fuelTypes, fuelSettings.newFuelType.trim()],
      newFuelType: '',
    });
    setError('');
  };

  const handleRemoveFuelType = (type: string) => {
    setFuelSettings({
      ...fuelSettings,
      fuelTypes: fuelSettings.fuelTypes.filter(t => t !== type),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Configuración del Sistema
          </h1>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Company Settings */}
          {activeTab === 'company' && (
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="input mt-1"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="input mt-1"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zona Horaria
                </label>
                <select
                  className="select mt-1"
                  value={companySettings.timezone}
                  onChange={(e) => setCompanySettings({ ...companySettings, timezone: e.target.value })}
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo de la Empresa
                </label>
                <div className="mt-1 flex items-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                  >
                    Subir Logo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Departments Settings */}
          {activeTab === 'departments' && (
            <div className="mt-6">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Nuevo departamento..."
                  value={departmentSettings.newDepartment}
                  onChange={(e) => setDepartmentSettings({ ...departmentSettings, newDepartment: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDepartment();
                    }
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddDepartment}
                >
                  Agregar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentSettings.departments.map((dept) => (
                  <div
                    key={dept}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span>{dept}</span>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveDepartment(dept)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fuel Settings */}
          {activeTab === 'fuel' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unidad de Medida
                  </label>
                  <select
                    className="select mt-1"
                    value={fuelSettings.measurementUnit}
                    onChange={(e) => setFuelSettings({ ...fuelSettings, measurementUnit: e.target.value })}
                  >
                    <option value="liters">Litros</option>
                    <option value="gallons">Galones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Umbral de Alerta (Litros)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={fuelSettings.alertThreshold}
                    onChange={(e) => setFuelSettings({ ...fuelSettings, alertThreshold: parseInt(e.target.value) })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipos de Combustible
                  </label>
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Nuevo tipo de combustible..."
                      value={fuelSettings.newFuelType}
                      onChange={(e) => setFuelSettings({ ...fuelSettings, newFuelType: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFuelType();
                        }
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleAddFuelType}
                    >
                      Agregar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fuelSettings.fuelTypes.map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <span>{type}</span>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveFuelType(type)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notificaciones por Correo</h3>
                  <p className="text-sm text-gray-500">Recibir notificaciones vía email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Alertas de Mantenimiento</h3>
                  <p className="text-sm text-gray-500">Notificaciones sobre mantenimientos programados</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.maintenanceAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      maintenanceAlerts: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Alertas de Combustible</h3>
                  <p className="text-sm text-gray-500">Notificaciones sobre niveles bajos de combustible</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.fuelAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      fuelAlerts: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Actualizaciones de Estado</h3>
                  <p className="text-sm text-gray-500">Notificaciones sobre cambios en el estado de los equipos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.statusUpdates}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      statusUpdates: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Reportes Diarios</h3>
                  <p className="text-sm text-gray-500">Recibir resumen diario de operaciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.dailyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      dailyReports: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Reportes Semanales</h3>
                  <p className="text-sm text-gray-500">Recibir resumen semanal de operaciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Reportes Mensuales</h3>
                  <p className="text-sm text-gray-500">Recibir resumen mensual de operaciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.monthlyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      monthlyReports: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rol por Defecto
                </label>
                <select
                  className="select mt-1"
                  value={userSettings.defaultRole}
                  onChange={(e) => setUserSettings({ ...userSettings, defaultRole: e.target.value })}
                >
                  <option value="operator">Operador</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitud Mínima de Contraseña
                </label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  className="input mt-1"
                  value={userSettings.passwordMinLength}
                  onChange={(e) => setUserSettings({ ...userSettings, passwordMinLength: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiempo de Sesión (minutos)
                </label>
                <input
                  type="number"
                  min="15"
                  className="input mt-1"
                  value={userSettings.sessionTimeout}
                  onChange={(e) => setUserSettings({ ...userSettings, sessionTimeout: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={userSettings.requireEmailVerification}
                    onChange={(e) => setUserSettings({
                      ...userSettings,
                      requireEmailVerification: e.target.checked,
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Requerir Verificación de Email
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;