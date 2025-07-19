import { useState, useEffect, useRef } from 'react';
import {useLocation, useNavigate} from 'react-router'
import { 
  TrendingUp, 
  BarChart3, 
  ChevronDown,
  Package,
  Users,
  UserCheck,
  Receipt,
  FileText,
  DollarSign,
  Settings,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useTheme } from '../ui/theme-provider';


export function Navbar() {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState(location.pathname.split('/')[2] || 'dashboard'); 
  
  const [showRegistrosDropdown, setShowRegistrosDropdown] = useState(false);
  const [showFlujoCajaDropdown, setShowFlujoCajaDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);    
  const registrosRef = useRef<HTMLDivElement>(null);
  const flujoCajaRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();  
  useEffect(() => {
    // Actualizar el módulo activo según la ruta actual
    const path = location.pathname.split('/')[2];
    console.log({path})
    if (path) {
      setActiveModule(path);
    } else {
      setActiveModule('dashboard');
    }
  }, [location.pathname])


  const registrosItems = [
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'proveedores', label: 'Proveedores', icon: Users },
    { id: 'empleados', label: 'Empleados', icon: UserCheck },
  ];

  const flujoCajaItems = [
    { id: 'caja', label: 'Caja', icon: DollarSign },
    { id: 'comprobantes', label: 'Comprobantes', icon: Receipt },
  ];

  const profileItems = [
    { id: 'configuracion', label: 'Configuración', icon: Settings },
    { id: 'modo-oscuro', label: theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro', icon: theme === 'dark' ? Sun : Moon },
    { id: 'cerrar-sesion', label: 'Cerrar Sesión', icon: LogOut },
  ];

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (registrosRef.current && !registrosRef.current.contains(event.target as Node)) {
        setShowRegistrosDropdown(false);
      }
      if (flujoCajaRef.current && !flujoCajaRef.current.contains(event.target as Node)) {
        setShowFlujoCajaDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRegistroClick = (itemId: string) => {
    setShowRegistrosDropdown(false);
    navigate(`/dashboard/${itemId}`);
    
  };

  const handleFlujoCajaClick = (itemId: string) => {
      setShowFlujoCajaDropdown(false);
      navigate(`/dashboard/${itemId}`);
  };

  const handleProfileClick = (itemId: string) => {
    if (itemId === 'modo-oscuro') {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      
    } 
    else if (itemId === 'configuracion') {
        //TODO: implementar un popup de configuracion
      console.log('FALTA configuración...');
    //   onModuleChange('configuracion');
    } else if (itemId === 'cerrar-sesion') {
      console.log('FALTA cerrar sesión...');
    }
    setShowProfileDropdown(false);
  };

  return (
    <div className="w-full nav-warm rounded-[48px] shadow-lg p-2 mb-8">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo clickeable */}
        <button
          onClick={() => {
            navigate('/dashboard');
            setActiveModule('dashboard');
          }}
          className="group/buttonHero flex items-center cursor-pointer space-x-3 rounded-full overflow-hidden transition-opacity"
        >
          <div className={`w-20 rounded-full overflow-hidden ${activeModule === 'dashboard' ? "rotate-12" : "rotate-0"}`}>
            <img src="/images/logo-acantilados.webp" alt="Logo hero" className='group-hover/buttonHero:scale-110 transition-transform' />
          </div>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center space-x-8">
          {/* Registros Dropdown */}
          <div className="relative" ref={registrosRef}>
            <button
              onClick={() => {
                setShowRegistrosDropdown(!showRegistrosDropdown);
                setShowFlujoCajaDropdown(false);
                setShowProfileDropdown(false);
              }}
              className={`flex items-center cursor-pointer space-x-2 font-ui font-medium text-lg transition-all duration-200 ${
                ['productos', 'proveedores', 'empleados'].includes(activeModule)
                  ? 'text-foreground underline decoration-2 underline-offset-4' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Registros</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRegistrosDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showRegistrosDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-card rounded-2xl dropdown-shadow border border-border min-w-48 py-2 z-50">
                {registrosItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRegistroClick(item.id)}
                      className={`w-full flex cursor-pointer items-center space-x-3 px-4 py-3 font-ui text-left hover:bg-muted transition-colors ${
                        activeModule === item.id ? 'text-primary bg-primary/5' : 'text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Flujo de Caja Dropdown */}
          <div className="relative" ref={flujoCajaRef}>
            <button
              onClick={() => {
                setShowFlujoCajaDropdown(!showFlujoCajaDropdown);
                setShowRegistrosDropdown(false);
                setShowProfileDropdown(false);
              }}
              className={`flex items-center cursor-pointer space-x-2 font-ui font-medium text-lg transition-all duration-200 ${
                ['caja', 'comprobantes'].includes(activeModule)
                  ? 'text-foreground underline decoration-2 underline-offset-4' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Flujo de caja</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFlujoCajaDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showFlujoCajaDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-card rounded-2xl dropdown-shadow border border-border min-w-48 py-2 z-50">
                {flujoCajaItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleFlujoCajaClick(item.id)}
                      className={`w-full flex cursor-pointer items-center space-x-3 px-4 py-3 font-ui text-left hover:bg-muted transition-colors ${
                        activeModule === item.id ? 'text-primary bg-primary/5' : 'text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reportes */}
          <button
            onClick={() => {
              navigate('/dashboard/reportes');
              setShowRegistrosDropdown(false);
              setShowFlujoCajaDropdown(false);
              setShowProfileDropdown(false);
            }}
            className={`flex items-center cursor-pointer space-x-2 font-ui font-medium text-lg transition-all duration-200 ${
              activeModule === 'reportes'
                ? 'text-foreground underline decoration-2 underline-offset-4' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Reportes</span>
          </button>
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowRegistrosDropdown(false);
              setShowFlujoCajaDropdown(false);
            }}
            className="flex items-center cursor-pointer space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-muted-foreground/30 rounded-full"></div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showProfileDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-card rounded-2xl dropdown-shadow border border-border min-w-48 py-2 z-50">
              {profileItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleProfileClick(item.id)}
                    className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 font-ui text-left hover:bg-muted transition-colors ${
                      item.id === 'cerrar-sesion' ? 'text-destructive hover:bg-destructive/10' : 'text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}