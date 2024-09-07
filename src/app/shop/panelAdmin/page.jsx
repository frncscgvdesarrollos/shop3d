'use client'
import { useState } from 'react';
import ListClient from "@/app/components/ListClient";
import ListProducts from "@/app/components/ListProducts";
import CreateProductForm from "@/app/components/CreateProduct";
import EliminarProducto from "@/app/components/EliminarProduct";
import EditarProducto from "@/app/components/EditarProduct";
import ListaVentas from "@/app/components/ListaVentas";
import ImpresorasPanel from "@/app/components/Impresoras";

export default function PanelAdmin() {
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
        <div className="flex flex-col lg:flex-row -mt-[4rem]">
            <aside className="bg-teal-50 lg:w-2/6  lg:pt-24 flex flex-col space-y-6 border-r border-gray-200 lg:min-w-[25vw]">
                    <ImpresorasPanel />
                <div>
             </div>
            </aside>

            <main className="flex flex-col lg:flex-row w-full lg:w-full">
                <div className="flex flex-col lg:flex-row w-full mx-auto">
                    <div className="bg-teal-50 lg:min-w-[50vw] lg:max-w-[50vw] ">
                        <ListaVentas />
                        <ListClient /> 
                     </div>   
                    <div className="bg-teal-50 text-teal-600  p-4 flex-2 min-w-[25vw]">
                    <div className="flex flex-col space-y-4 mb-4">
                        <span className='text-teal-600 text-left text-xl lg:text-3xl font-bold mb-6 mt-12'>Productos</span>
                        <div className="rounded-lg  flex flex-col justify-start items-start pl-2 transition-transform duration-300 transform hover:scale-105 hover:mb-4">
                            {showCreateProduct ? <CreateProductForm /> : null}
                            <button 
                                className={`text-teal-600 font-semibold rounded mt-2 transition-colors duration-300 `}
                                onClick={() => handleCreateProduct()}
                            >
                                {showCreateProduct ? 'Cerrar' :'Crear Producto' }
                            </button>
                        </div>
                        <div className="rounded-lg flex flex-col justify-start items-start pl-2 transition-transform duration-300 transform hover:scale-105 hover:mb-4">
                            {showEditarProducto ? <EditarProducto /> : null}
                            <button 
                                className={`text-teal-600 font-semibold  rounded mt-2 transition-colors duration-300`}
                                onClick={() => handleEditarProducto()}
                            >
                                {showEditarProducto ?'Cerrar' : 'Editar Producto' }
                            </button>
                        </div>
                        <div className="rounded-lg  flex flex-col justify-start items-start pl-2 transition-transform duration-300 transform hover:scale-105 hover:mb-4">
                            {showEliminarProducto ? <EliminarProducto /> : null}
                            <button 
                                className={`text-teal-600 font-semibold rounded mt-2 transition-colors duration-300`}
                                onClick={() => handleEliminarProducto()}
                            >
                                {showEliminarProducto ? 'Cerrar' : 'Eliminar Producto'}
                            </button>
                         </div>
                    </div>
                        <ListProducts />
                    </div>
                </div>
            </main>
        </div>
    );
}
