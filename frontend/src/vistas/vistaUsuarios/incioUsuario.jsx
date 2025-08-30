import React from 'react';

// Componente de ícono (requiere Font Awesome)
const Icon = ({ name, className }) => (
    <i className={`fas fa-${name} ${className || ''}`}></i>
);

// Componente para las tarjetas de estadísticas
const StatCard = ({ title, value, icon, color }) => {
    const bgColor = `bg-${color}-500`;

    return (
        <div className={`transform hover:scale-105 transition-transform duration-300 ${bgColor} text-white p-6 rounded-xl shadow-lg flex items-center justify-between`}>
            <div>
                <p className="text-lg font-semibold text-gray-200">{title}</p>
                <p className="text-4xl font-bold">{value}</p>
            </div>
            <div className="text-5xl opacity-50">
                <Icon name={icon} />
            </div>
        </div>
    );
};

export default function Dashboard() {
    const stats = {
        pacientes: 124,
        personal: 15,
        inventario: 256,
        citasHoy: 8,
    };
    const userName = "Dr. Ramirez";

    return (
        <div className="container mx-auto p-8 bg-gray-50">
            {/* Encabezado */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Bienvenido de nuevo, {userName}</h1>
                <p className="text-lg text-gray-500 mt-1">Aquí tienes un resumen del estado del centro de salud.</p>
            </header>

            {/* Grid de Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Pacientes Registrados" value={stats.pacientes} icon="users" color="blue" />
                <StatCard title="Personal Activo" value={stats.personal} icon="user-md" color="green" />
                <StatCard title="Items en Inventario" value={stats.inventario} icon="boxes" color="purple" />
                <StatCard title="Citas para Hoy" value={stats.citasHoy} icon="calendar-check" color="orange" />
            </div>

            {/* Sección de Acciones Rápidas */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta de Acción */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                        <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center">
                            <Icon name="user-plus" className="text-2xl" />
                        </div>
                        <h3 className="font-semibold text-lg mt-4 text-gray-800">Registrar Nuevo Paciente</h3>
                        <p className="text-gray-500 text-sm mt-1">Añade un nuevo paciente al sistema de forma rápida.</p>
                        <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors">
                            Registrar
                        </button>
                    </div>
                    {/* Tarjeta de Acción */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                        <div className="bg-green-100 text-green-600 rounded-full h-16 w-16 flex items-center justify-center">
                            <Icon name="calendar-plus" className="text-2xl" />
                        </div>
                        <h3 className="font-semibold text-lg mt-4 text-gray-800">Agendar Cita</h3>
                        <p className="text-gray-500 text-sm mt-1">Busca un paciente y programa su próxima consulta.</p>
                        <button className="mt-4 bg-green-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-600 transition-colors">
                            Agendar
                        </button>
                    </div>
                    {/* Tarjeta de Acción */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                        <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center">
                            <Icon name="pills" className="text-2xl" />
                        </div>
                        <h3 className="font-semibold text-lg mt-4 text-gray-800">Ver Inventario</h3>
                        <p className="text-gray-500 text-sm mt-1">Consulta el stock de medicamentos y suministros.</p>
                        <button className="mt-4 bg-purple-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-purple-600 transition-colors">
                            Consultar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}