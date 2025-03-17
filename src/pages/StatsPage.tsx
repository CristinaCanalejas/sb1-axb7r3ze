import React, { useEffect, useState } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { 
  Fuel, 
  Truck, 
  AlertTriangle, 
  Users, 
  ClipboardList, 
  Wrench,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import WarehouseService from '../services/warehouseService';
import EquipmentService from '../services/equipmentService';
import type { PurchaseRequest, PurchaseOrder, WorkingEquipment } from '../types';

const StatsPage = () => {
  const [purchaseStats, setPurchaseStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalOrders: 0,
    completedOrders: 0,
  });

  const [equipmentStats, setEquipmentStats] = useState({
    inMaintenance: 0,
    inOperation: 0,
  });

  const [monthlyPurchases, setMonthlyPurchases] = useState<{ month: string; requests: number; orders: number }[]>([]);
  const [requestsByPriority, setRequestsByPriority] = useState<{ name: string; value: number }[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<{ name: string; value: number }[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showExportFormats, setShowExportFormats] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const warehouseService = WarehouseService.getInstance();
    const equipmentService = EquipmentService.getInstance();
    const requests = warehouseService.getPurchaseRequests();
    const orders = warehouseService.getPurchaseOrders();
    const workingEquipment = equipmentService.getWorkingEquipment();

    // Calculate basic stats
    setPurchaseStats({
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      approvedRequests: requests.filter(r => r.status === 'approved').length,
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
    });

    // Calculate equipment stats
    setEquipmentStats({
      inMaintenance: workingEquipment.filter(eq => eq.status === 'detenido_mantenimiento').length,
      inOperation: workingEquipment.filter(eq => eq.status === 'operando').length,
    });

    // Calculate monthly stats
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'MMM');
      return {
        month: monthKey,
        requests: requests.filter(r => format(r.date, 'MMM') === monthKey).length,
        orders: orders.filter(o => format(o.date, 'MMM') === monthKey).length,
      };
    }).reverse();
    setMonthlyPurchases(last6Months);

    // Calculate requests by priority
    const priorityStats = [
      { name: 'Urgente', value: requests.filter(r => r.priority === 'urgent').length },
      { name: 'Alta', value: requests.filter(r => r.priority === 'high').length },
      { name: 'Media', value: requests.filter(r => r.priority === 'medium').length },
      { name: 'Baja', value: requests.filter(r => r.priority === 'low').length },
    ];
    setRequestsByPriority(priorityStats);

    // Calculate orders by status
    const statusStats = [
      { name: 'Completada', value: orders.filter(o => o.status === 'completed').length },
      { name: 'Recibida', value: orders.filter(o => o.status === 'received').length },
      { name: 'Enviada', value: orders.filter(o => o.status === 'sent').length },
      { name: 'Pendiente', value: orders.filter(o => o.status === 'pending').length },
    ];
    setOrdersByStatus(statusStats);
  }, []);

  // Mock data for other charts
  const fuelConsumptionData = [
    { date: format(subDays(new Date(), 6), 'dd/MM'), liters: 450, efficiency: 85 },
    { date: format(subDays(new Date(), 5), 'dd/MM'), liters: 380, efficiency: 88 },
    { date: format(subDays(new Date(), 4), 'dd/MM'), liters: 520, efficiency: 82 },
    { date: format(subDays(new Date(), 3), 'dd/MM'), liters: 490, efficiency: 84 },
    { date: format(subDays(new Date(), 2), 'dd/MM'), liters: 420, efficiency: 87 },
    { date: format(subDays(new Date(), 1), 'dd/MM'), liters: 480, efficiency: 86 },
    { date: format(new Date(), 'dd/MM'), liters: 460, efficiency: 85 },
  ];

  const equipmentStatusData = [
    { name: 'Operativos', value: equipmentStats.inOperation, color: '#22c55e' },
    { name: 'En Mantenimiento', value: equipmentStats.inMaintenance, color: '#f59e0b' },
    { name: 'No Operativos', value: 3, color: '#ef4444' },
  ];

  const summaryCards = [
    {
      title: 'Consumo Total de Combustible',
      value: '3,200 L',
      change: '+5.3%',
      trend: 'up',
      icon: Fuel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Equipos en Mantenimiento',
      value: equipmentStats.inMaintenance.toString(),
      change: '-2 vs semana anterior',
      trend: 'down',
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Equipos en Operación',
      value: equipmentStats.inOperation.toString(),
      change: '+1 vs semana anterior',
      trend: 'up',
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Eficiencia Operacional',
      value: '94%',
      change: '+2.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Refresh data...
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Estadísticas</h1>
              <p className="text-sm text-gray-500 mt-1">
                Última actualización: {format(lastUpdate, 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  className="bg-transparent border-none text-sm focus:ring-0"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                >
                  <option value="day">Hoy</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mes</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="year">Este Año</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="bg-transparent border-none text-sm focus:ring-0"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <option value="all">Todas las Métricas</option>
                  <option value="equipment">Equipos</option>
                  <option value="fuel">Combustible</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="purchases">Compras</option>
                </select>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleRefresh}
                title="Actualizar datos"
              >
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative">
                <button
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={() => setShowExportFormats(!showExportFormats)}
                >
                  <Download className="w-4 h-4" />
                  Exportar
                  <ChevronDown className={`w-4 h-4 transition-transform ${showExportFormats ? 'rotate-180' : ''}`} />
                </button>
                {showExportFormats && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Excel (XLSX)
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      CSV
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <FilePdf className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`${card.bgColor} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                {card.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Purchase Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Actividad de Compras</h2>
              <p className="text-sm text-gray-500 mt-1">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-xs text-gray-600">Solicitudes</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                <span className="text-xs text-gray-600">Órdenes</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPurchases}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#fbbf24"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#60a5fa"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Status Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Estado de Equipos</h2>
              <p className="text-sm text-gray-500 mt-1">Distribución actual</p>
            </div>
            <div className="flex items-center gap-4">
              {equipmentStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-xs text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
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
                >
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Consumption Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Consumo de Combustible</h2>
              <p className="text-sm text-gray-500 mt-1">Últimos 7 días</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-xs text-gray-600">Consumo (L)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-600">Eficiencia (%)</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelConsumptionData}>
                <defs>
                  <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="liters"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ stroke: '#22c55e', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purchase Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Métricas de Compras</h2>
              <p className="text-sm text-gray-500 mt-1">Estado actual</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Solicitudes Pendientes</span>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-2xl font-semibold mt-2">{purchaseStats.pendingRequests}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Solicitudes Aprobadas</span>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-semibold mt-2">{purchaseStats.approvedRequests}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Órdenes en Proceso</span>
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-semibold mt-2">
                  {purchaseStats.totalOrders - purchaseStats.completedOrders}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Órdenes Completadas</span>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-semibold mt-2">{purchaseStats.completedOrders}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tasa de Aprobación</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      {((purchaseStats.approvedRequests / purchaseStats.totalRequests) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                  <div
                    style={{ width: `${(purchaseStats.approvedRequests / purchaseStats.totalRequests) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Distribución por Prioridad</h2>
              <p className="text-sm text-gray-500 mt-1">Solicitudes activas</p>
            </div>
          </div>
          <div className="space-y-4">
            {requestsByPriority.map((priority) => (
              <div key={priority.name} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{priority.name}</span>
                  <span className="text-sm font-medium">{priority.value}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{
                        width: `${(priority.value / requestsByPriority.reduce((acc, curr) => acc + curr.value, 0)) * 100}%`,
                        backgroundColor: priority.name === 'Urgente' ? '#ef4444' :
                                      priority.name === 'Alta' ? '#f97316' :
                                      priority.name === 'Media' ? '#f59e0b' : '#84cc16'
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;