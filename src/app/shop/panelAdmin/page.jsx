'use client';
import { useState } from 'react';
import ListClient from "@/app/components/ListClient";
import ListaVentas from "@/app/components/ListaVentas";
import ImpresorasPanel from "@/app/components/Impresoras";

export default function PanelAdmin() {
    // Estado para controlar la vista actual (ventas, clientes o productos)
    const [view, setView] = useState('ventas');

    return (
<div className="flex flex-col lg:flex-row -mt-[4rem] w-full h-full">
    <aside className="bg-teal-50 lg:w-1/4 lg:pt-24 flex flex-col space-y-6 border-r border-gray-200 min-w-[25vw]">
        <ImpresorasPanel />
    </aside>

    <main className="flex flex-col w-full lg:flex-row lg:w-3/4">
        <div className="flex flex-col w-full mx-auto">
            <div className="bg-teal-50 text-teal-600 p-4 flex-1">
                <div className="flex flex-col space-y-4 mb-4">
                    <span className="text-teal-600 text-left text-xl lg:text-3xl font-bold mb-6 mt-12">
                        Administración
                    </span>

                    {/* Botones para cambiar entre vistas */}
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 font-semibold ${view === 'ventas' ? 'bg-teal-600 text-white' : 'text-teal-600'} rounded transition-colors duration-300`}
                            onClick={() => setView('ventas')}
                        >
                            Lista de Ventas
                        </button>
                        <button
                            className={`px-4 py-2 font-semibold ${view === 'clientes' ? 'bg-teal-600 text-white' : 'text-teal-600'} rounded transition-colors duration-300`}
                            onClick={() => setView('clientes')}
                        >
                            Lista de Clientes
                        </button>
                        <button
                            className={`px-4 py-2 font-semibold ${view === 'productos' ? 'bg-teal-600 text-white' : 'text-teal-600'} rounded transition-colors duration-300`}
                            onClick={() => setView('productos')}
                        >
                            Lista de Productos
                        </button>
                    </div>
                </div>

                {/* Mostramos la vista seleccionada */}
                <div className='w-full'>
                    {view === 'ventas' && <ListaVentas />}
                    {view === 'clientes' && <ListClient />}
                    {view === 'productos' && (
                        <a href="/shop/panelAdmin/productos" className="text-teal-600 font-semibold rounded mt-2 transition-colors duration-300 hover:underline">
                            Ir a la página de productos
                        </a>
                    )}
                </div>
            </div>
        </div>
    </main>
</div>

    );
}
