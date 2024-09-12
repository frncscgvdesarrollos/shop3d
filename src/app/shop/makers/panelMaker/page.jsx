'use client'
import { UserAuth } from "@/app/context/AuthContext";
import { getImpresoraByUid, iniciarProduccion, finalizarPedido } from "@/app/firebase"; 
import { useEffect, useState } from "react";

export default function PanelMaker() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [isMaker, setIsMaker] = useState(false);
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        if (uid) {
            getImpresoraByUid(uid)
                .then((data) => {
                    console.log("Datos de impresoras: ", data);
                    setPrinters(data);
                    setIsMaker(true);  // Simula que el usuario es Maker para mostrar el panel
                })
                .catch((error) => {
                    console.log("Error obteniendo impresoras: ", error);
                });
        }
    }, [uid]);

    useEffect(() => {
        if (selectedPrinter) {
            // Filtrar los pedidos que están en estado "pedido"
            const pedidosEnCola = selectedPrinter.pedido.filter(pedido => pedido.status === 'pedido');
            setQueue(pedidosEnCola);
        }
    }, [selectedPrinter]);

    // Función para manejar la selección de impresora
    const handleSelectPrinter = (printer) => {
        console.log("Impresora seleccionada: ", printer);
        setSelectedPrinter(printer);
    }

    // Función para iniciar la producción de un pedido
    const handleStartProduction = async () => {
        if (selectedPrinter) {
            const result = await iniciarProduccion(selectedPrinter.id);
            if (result) {
                console.log("Producción iniciada: ", result);
                // Actualizar el estado de la impresora después de iniciar la producción
                setSelectedPrinter(prevState => ({
                    ...prevState,
                    currentImpresion: result.currentImpresion,
                    pedido: result.pedido,
                    horasRestantes: result.horasRestantes
                }));
            }
        }
    }

    // Función para finalizar el pedido actual
    const handleFinishOrder = async () => {
        if (selectedPrinter) {
            const result = await finalizarPedido(selectedPrinter.id);
            if (result) {
                console.log("Pedido finalizado: ", result);
    
                // Actualizar el estado de la impresora después de finalizar el pedido
                setSelectedPrinter(prevState => ({
                    ...prevState,
                    currentImpresion: result.currentImpresion,
                    lastImpresion: result.lastImpresion,
                    horasImprimidas: result.horasImprimidas,
                    pedidosTotales: result.pedidosTotales,
                    pedido: result.pedido,  // Actualiza la lista completa de pedidos
                }));
    
                // Crear una nueva lista de pedidos en cola con fecha de entrega calculada
                const nuevosPedidosEnCola = result.pedido.map(pedido => {
                    // Si el estado del pedido es 'pedido', calcular la fecha de entrega
                    if (pedido.status === 'pedido') {
                        const fechaPedido = new Date(pedido.fecha.toDate());
                        const fechaEntrega = new Date(fechaPedido);
                        fechaEntrega.setDate(fechaEntrega.getDate() + 15); // Añadir 15 días
    
                        return {
                            ...pedido,
                            fechaEntrega: fechaEntrega // Agregar la fecha de entrega calculada
                        };
                    }
                    return pedido; // Si no es 'pedido', devolver el pedido tal cual
                });
    
                setQueue(nuevosPedidosEnCola);
            }
        }
    }
    
    

    if (!isMaker) {
        return <h3>No tienes acceso a esta sección</h3>;
    }

    // Determina si hay un pedido actual en producción
    const hasCurrentImpresion = selectedPrinter?.currentImpresion && Object.keys(selectedPrinter.currentImpresion).length > 0;

    return (
        <div className="flex h-screen">
            {/* Sidebar de impresoras */}
            <aside className="w-1/4 bg-gray-800 text-white p-4 pt-16">
                <h2 className="text-xl font-bold mb-4">Tus Impresoras</h2>
                {printers.length > 0 ? (
                    <ul className="space-y-2">
                        {printers.map((printer, index) => (
                            <li
                                key={index}
                                className={`p-2 cursor-pointer rounded transition-colors duration-200 ${selectedPrinter?.id === printer.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                onClick={() => handleSelectPrinter(printer)}
                            >
                                Impresora {printer.id || "Sin ID"}
                            </li>
                        ))}
                        <a href="/shop/makers/registerPrinter" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                            Agregar Impresora
                        </a>
                    </ul>
                ) : (
                    <div>
                        <p className="mt-4 text-gray-400">No tienes impresoras. ¡Agrega tu primera impresora!</p>
                        <a href="/shop/makers/registerPrinter" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                            Agregar Impresora
                        </a>
                    </div>

                )}
            </aside>
    
            {/* Main Panel de Información */}
            <main className="w-3/4 bg-white p-6 overflow-y-auto">
                {selectedPrinter ? (
                    <div>
                        <div className="flex gap-8">
                            {/* Información de la impresora */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4">Impresora {selectedPrinter.id || "Sin ID"}</h2>
                                <p className="text-lg"><strong>Horas Imprimidas:</strong> {selectedPrinter.horasImprimidas || "No disponible"}</p>
                                <p className="text-lg"><strong>Horas Restantes:</strong> {selectedPrinter.horasRestantes || "No disponible"}</p>
                                <p className="text-lg"><strong>Última Impresión:</strong> {selectedPrinter.lastImpresion?.status || "No disponible"}</p>
                                <p className="text-lg"><strong>Pedidos Totales:</strong> {selectedPrinter.pedidosTotales || 0}</p>
                            </div>
    
                            {/* Detalles de la impresión actual */}
                            <div className="flex-1">
                            {selectedPrinter.currentImpresion && selectedPrinter.currentImpresion.producto ? (
                                <div className="bg-gray-100 p-4 rounded shadow-md">
                                    <h3 className="text-xl font-semibold mb-2">Detalles de la Actual Impresión</h3>
                                    <p><strong>Descripción del Producto:</strong> {selectedPrinter.currentImpresion.producto.descripcion}</p>
                                    <p><strong>Nombre del Producto:</strong> {selectedPrinter.currentImpresion.producto.nombre}</p>
                                    <p><strong>Precio del Producto:</strong> ${selectedPrinter.currentImpresion.producto.precio}</p>
                                    <p><strong>Tiempo de Producción:</strong> {selectedPrinter.currentImpresion.producto.tiempo} horas</p>
                                    <p><strong>Status del Pedido:</strong> {selectedPrinter.currentImpresion.producto.status}</p>
                                    <img src={selectedPrinter.currentImpresion.producto.imagen} alt="pedido actual" className="mt-2 rounded" width={200} height={200} />
                                </div>
                            ) : (
                                <p className="text-gray-600 mt-4">No hay impresión actual.</p>
                            )}
                        </div>

                        </div>
    
                        {/* Botones para iniciar y finalizar la producción */}
                        <div className="mt-6 flex justify-between gap-4">
                            {hasCurrentImpresion ? (
                                <button
                                    onClick={handleFinishOrder}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                >
                                    Finalizar Pedido
                                </button>
                            ) : (
                                <button
                                    onClick={handleStartProduction}
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Iniciar Producción
                                </button>
                            )}
                        </div>
    
                        {/* Sección de pedidos en cola */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4">Pedidos en Cola</h3>
                            {queue.length > 0 ? (
                                <ul className="space-y-4">
                                    {queue.map((pedido) => {
                                        const fechaPedido = new Date(pedido.fecha.toDate());
                                        const fechaEntrega = new Date(fechaPedido);
                                        fechaEntrega.setDate(fechaEntrega.getDate() + 15);
    
                                        return (
                                            <li key={pedido.id} className="border p-4 rounded shadow-md flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <p><strong>Pedido ID:</strong> {pedido.id}</p>
                                                    <p><strong>Fecha de Pedido:</strong> {fechaPedido.toLocaleDateString()}</p>
                                                    <p><strong>Fecha de Entrega:</strong> {fechaEntrega.toLocaleDateString()}</p>
                                                    <p><strong>Producto:</strong> {pedido.producto.nombre}</p>
                                                    <p><strong>Descripción:</strong> {pedido.producto.descripcion}</p>
                                                    <p><strong>Precio:</strong> ${pedido.producto.precio}</p>
                                                    <p><strong>Tiempo de Producción:</strong> {pedido.producto.tiempo} horas</p>
                                                </div>
                                                <img src={pedido.producto.imagen} alt="imagen pedido" className="w-32 h-32 object-cover rounded" />
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No hay pedidos en cola.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <h2 className="text-xl font-bold">Selecciona una impresora para ver sus detalles</h2>
                )}
            </main>
        </div>
    );
    
}
