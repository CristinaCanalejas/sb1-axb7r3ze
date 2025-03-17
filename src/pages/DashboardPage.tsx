import React, { useState } from 'react';
import { PenTool as Tool, AlertTriangle, ShoppingCart, Clock, Truck, HardHat, Users, Fuel, Wrench, Package, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const DashboardPage = () => {
  // Equipment Status Data
  const equipmentStatusData = [
    { name: 'Operativos', value: 12, color: '#22c55e' },
    { name: 'En Mantenimiento', value: 3, color: '#f59e0b' },
    { name: 'No Operativos', value: 2, color: '#ef4444' },
  ];

  // Fuel Consumption Data
  const fuelConsumptionData = Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'dd/MM'),
    diesel: Math.floor(Math.random() * 200 + 400),
    gasolina: Math.floor(Math.random() * 100 + 200),
  }));

  // Maintenance Events
  const maintenanceEvents = [
    {
      title: 'Mantenimiento Camión Volvo FH',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T12:00:00',
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    {
      title: 'Servicio Excavadora CAT 320',
      start: '2024-03-21T14:00:00',
      end: '2024-03-21T17:00:00',
      backgroundColor: '#8b5cf6',
      borderColor: '#8b5cf6',
    },
    {
      title: 'Inspección Cargador Frontal',
      start: '2024-03-22T09:00:00',
      end: '2024-03-22T11:00:00',
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    }
  ];

  // Summary Cards Data
  const summaryCards = [
    {
      title: 'Equipos Activos',
      value: '12',
      change: '+2 esta semana',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Personal en Turno',
      value: '45',
      change: 'de 52 total',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Consumo de Combustible',
      value: '850L',
      change: '-5% vs ayer',
      icon: Fuel,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Mantenimientos Activos',
      value: '3',
      change: '2 programados',
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Solicitudes Pendientes',
      value: '8',
      change: '3 urgentes',
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Eficiencia General',
      value: '94%',
      change: '+2% vs mes anterior',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  // Recent Events
  const recentEvents = [
    {
      time: '10:45',
      title: 'Mantenimiento Programado',
      description: 'Camión Volvo FH iniciando servicio',
      icon: Tool,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      time: '10:30',
      title: 'Alerta de Combustible',
      description: 'Excavadora CAT 320 bajo nivel',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      time: '10:15',
      title: 'Solicitud de Compra',
      description: 'Nuevos repuestos aprobados',
      icon: ShoppingCart,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      time: '10:00',
      title: 'Cambio de Turno',
      description: 'Actualización de personal operativo',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      time: '09:45',
      title: 'Mantenimiento Completado',
      description: 'Excavadora CAT 320 lista para operar',
      icon: Tool,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      time: '09:30',
      title: 'Nuevo Equipo Registrado',
      description: 'Cargador Frontal 966H agregado a la flota',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      time: '09:15',
      title: 'Alerta de Mantenimiento',
      description: 'Camión Volvo FH requiere servicio próximamente',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      time: '09:00',
      title: 'Entrega de EPP',
      description: 'Equipos de protección entregados al personal',
      icon: HardHat,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-600">
                  {card.title}
                </h2>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                  <p className="ml-2 text-sm text-gray-600">
                    {card.change}
                  </p>
                </div>
              </div>
              <div className={`${card.bgColor} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Status Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Estado de Equipos
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Eventos Recientes
          </h2>
          <div className="space-y-6 h-[400px] overflow-y-auto pr-4 scrollbar-thin">
            {recentEvents.map((event, index) => (
              <div 
                key={index} 
                className="flex gap-4 transition-all duration-200 hover:bg-gray-50 p-3 rounded-xl cursor-pointer"
              >
                <div className={`${event.bgColor} p-3 rounded-xl h-fit`}>
                  <event.icon className={`w-5 h-5 ${event.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Consumption Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Consumo de Combustible
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="diesel" 
                  name="Diesel (L)"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="gasolina" 
                  name="Gasolina (L)"
                  stroke="#f59e0b" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Calendario de Mantenimiento
          </h2>
          <div className="h-[400px] overflow-y-auto">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridWeek,timeGridDay'
              }}
              events={maintenanceEvents}
              height="100%"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;