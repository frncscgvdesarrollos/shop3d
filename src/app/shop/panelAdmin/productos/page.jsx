'use client';

import { useState } from 'react';
import CreateProductForm from "@/app/components/CreateProduct";
import EditarProducto from "@/app/components/EditarProduct";
import EliminarProducto from "@/app/components/EliminarProduct";
import ListProducts from "@/app/components/ListProducts";

export default function ProductosPage() {
    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [showEditarProducto, setShowEditarProducto] = useState(false);
    const [showEliminarProducto, setShowEliminarProducto] = useState(false);

    // Funciones manejadoras de estado
    function handleCreateProduct() {
        setShowCreateProduct(!showCreateProduct);
    }

    function handleEditarProducto() {
        setShowEditarProducto(!showEditarProducto);
    }

    function handleEliminarProducto() {
        setShowEliminarProducto(!showEliminarProducto);
    }

    return (
        <div className="flex flex-col lg:flex-row w-full h-full bg-teal-50 text-teal-600 p-4">
            {/* Aside - Controles de productos */}
            <aside className="lg:w-1/4 w-full flex flex-col space-y-6 p-4 border-r border-gray-200">
                <h2 className="text-teal-600 text-left text-xl lg:text-2xl font-bold mb-6 mt-4">Administración de Productos</h2>
                
                {/* Crear Producto */}
                <div className="rounded-lg flex flex-col justify-start items-start transition-transform duration-300 transform hover:scale-105 hover:mb-4">
                    {showCreateProduct && <CreateProductForm />}
                    <button
                        className={`px-4 py-2 font-semibold transition-colors duration-300 rounded ${showCreateProduct ? 'bg-teal-600 text-white' : 'text-teal-600 bg-white'}`}
                        onClick={handleCreateProduct}
                    >
                        {showCreateProduct ? 'Cerrar' : 'Crear Producto'}
                    </button>
                </div>

                {/* Editar Producto */}
                <div className="rounded-lg flex flex-col justify-start items-start transition-transform duration-300 transform hover:scale-105 hover:mb-4">
                    {showEditarProducto && <EditarProducto />}
                    <button
                        className={`px-4 py-2 font-semibold transition-colors duration-300 rounded ${showEditarProducto ? 'bg-teal-600 text-white' : 'text-teal-600 bg-white'}`}
                        onClick={handleEditarProducto}
                    >
                        {showEditarProducto ? 'Cerrar' : 'Editar Producto'}
                    </button>
                </div>

                {/* Eliminar Producto */}
                <div className="rounded-lg flex flex-col justify-start items-start transition-transform duration-300 transform hover:scale-105 hover:mb-4">
                    {showEliminarProducto && <EliminarProducto />}
                    <button
                        className={`px-4 py-2 font-semibold transition-colors duration-300 rounded ${showEliminarProducto ? 'bg-teal-600 text-white' : 'text-teal-600 bg-white'}`}
                        onClick={handleEliminarProducto}
                    >
                        {showEliminarProducto ? 'Cerrar' : 'Eliminar Producto'}
                    </button>
                </div>
            </aside>

            {/* Main - Lista de productos */}
            <main className="lg:w-3/4 w-full p-6">
                <ListProducts />
            </main>
        </div>
    );
}
