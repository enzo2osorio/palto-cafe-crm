import { Outlet } from "react-router"
import { Navbar } from "../../components/Layout/Navbar"
import { useEffect, useState } from "react";

export const DashboardLayout = () => {

  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia de modo oscuro del localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Aplicar o quitar la clase dark en el HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
        <main className="mt-10 mb-20 mx-4 md:mx-12">
          <Outlet/>
        </main>
    </div>
  )
}
