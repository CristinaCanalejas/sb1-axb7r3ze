import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Fuel, 
  Truck, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Settings, 
  FileSpreadsheet, 
  ChevronDown, 
  Building2, 
  Clock, 
  Wrench, 
  Boxes,
  PenTool as Tool,
  HardHat,
  Package,
  ClipboardList,
  ShoppingCart,
  Shirt,
  LayoutDashboard
} from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  text: string;
  path?: string;
  submenu?: {
    text: string;
    path: string;
    icon: React.ElementType;
  }[];
}

const Sidebar = ({ onMobileClose }: { onMobileClose?: () => void }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
    { 
      icon: Truck, 
      text: 'Flota',
      submenu: [
        { icon: Fuel, text: 'Combustible', path: '/fuel' },
        { icon: AlertTriangle, text: 'Estado de Equipos', path: '/equipment-status' },
        { icon: Boxes, text: 'Equipos', path: '/equipment' },
        { icon: Tool, text: 'Equipos en Mantenimiento', path: '/equipment-in-service' },
        { icon: HardHat, text: 'Equipos en Operación', path: '/equipment-working' },
      ]
    },
    { 
      icon: Users, 
      text: 'Personal',
      submenu: [
        { icon: Users, text: 'Gestión de Personal', path: '/personnel' },
        { icon: Shirt, text: 'Solicitud Vestimenta/EPP', path: '/clothing-ppe' },
        { icon: Clock, text: 'Turnos', path: '/shifts' },
        { icon: Wrench, text: 'Mecánicos', path: '/mechanics' },
      ]
    },
    {
      icon: Package,
      text: 'Bodega',
      submenu: [
        { icon: Package, text: 'Inventario', path: '/warehouse' },
        { icon: ClipboardList, text: 'Solicitudes de Compra', path: '/purchase-requests' },
        { icon: ShoppingCart, text: 'Órdenes de Compra', path: '/purchase-orders' },
      ]
    },
    { icon: BarChart3, text: 'Estadísticas', path: '/stats' },
    { icon: FileSpreadsheet, text: 'Reportes', path: '/reports' },
    { icon: Settings, text: 'Configuración', path: '/settings' },
  ];

  const toggleMenu = (text: string) => {
    setExpandedMenus(prev => 
      prev.includes(text)
        ? prev.filter(item => item !== text)
        : [...prev, text]
    );
  };

  const isMenuExpanded = (text: string) => expandedMenus.includes(text);

  const handleNavigation = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold">FleetManager</h2>
            <p className="text-xs text-gray-400">Sistema de Gestión de Flota</p>
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.text}>
                {item.submenu ? (
                  <div className="mb-2">
                    <button
                      onClick={() => toggleMenu(item.text)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-700 ${
                        isMenuExpanded(item.text) ? 'bg-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.text}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isMenuExpanded(item.text) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        isMenuExpanded(item.text)
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <ul className="pl-4 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <li key={subitem.path}>
                            <NavLink
                              to={subitem.path}
                              onClick={handleNavigation}
                              className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`
                              }
                            >
                              <subitem.icon className="w-4 h-4" />
                              <span className="text-sm">{subitem.text}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.path!}
                    onClick={handleNavigation}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-700'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.text}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-700">
          <div className="px-3 py-2">
            <p className="text-xs text-gray-400">Versión 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;