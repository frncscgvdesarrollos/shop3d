'use client'
import { UserAuth } from "@/app/context/AuthContext";
import { getImpresoraByUid, iniciarProduccion, finalizarPedido, updateCodigoEnvio, updateStatusVenta, deleteLastImpresion, uploadFileToStorage , getFileDownloadURL } from "@/app/firebase";
import { useEffect, useState } from "react";

export default function PanelMaker() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [isMaker, setIsMaker] = useState(false);
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState(null);
    const [queue, setQueue] = useState([]);
    const [codigoEnvio, setCodigoEnvio] = useState('');

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
            // Verificar que 'selectedPrinter.pedido' sea un array antes de filtrar
            const pedidosEnCola = Array.isArray(selectedPrinter.pedido)
                ? selectedPrinter.pedido.filter(pedido => pedido.status === 'pedido')
                : [];
            setQueue(pedidosEnCola);
            setCodigoEnvio(''); // Reiniciar el código de envío al cambiar de impresora
        }
    }, [selectedPrinter]);
    const handleDownloadFile = async () => {
        const filePath = 'archivos/mobile phone desktop stand.zip'; // Ruta en Firebase Storage
        
        try {
            // Obtén la URL de descarga del archivo
            const url = await getFileDownloadURL(filePath);
            
            // Crear un elemento <a> temporal para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.download = 'mobile phone desktop stand.zip'; // Nombre del archivo a descargar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            // Manejar el error aquí
        }
    };
    
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

// Función para confirmar el envío
const handleConfirmShipment = async (orderId) => {
    // Verificar que codigoEnvio no esté vacío
    if (!codigoEnvio.trim()) {
        console.error("El código de envío no puede estar vacío.");
        return;
    }

    try {
        // Actualizar el codigoEnvio en la base de datos
        const result = await updateCodigoEnvio(orderId, codigoEnvio);

        if (result) {
            console.log("Código de envío actualizado para el pedido ID:", orderId);
            
            // Actualizar el estado de la venta
            await updateStatusVenta(orderId);

            // Eliminar la última impresión de la impresora asociada
            const impresoraId = selectedPrinter.id; // Suponiendo que selectedPrinter tiene el ID de la impresora
            await deleteLastImpresion(impresoraId);

            console.log("Última impresión eliminada para la impresora ID:", impresoraId);

            // Aquí puedes actualizar el estado del pedido si es necesario
            // Por ejemplo, puedes actualizar la lista de pedidos en cola para reflejar el cambio
        } else {
            console.error("Error al actualizar el código de envío para el pedido ID:", orderId);
        }
    } catch (error) {
        console.error("Error al confirmar el envío:", error);
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
                                    
                                    {/* Botón de descarga */}
                                    {selectedPrinter.currentImpresion.producto.archivoImpresion && (
                                        <button
                                            onClick={handleDownloadFile}
                                            className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                                        >
                                            Descargar Archivo de Impresión
                                        </button>
                                    )}
                                </div>
                                ) : (
                                    <p className="text-gray-600 mt-4">No hay impresión actual.</p>
                                )}
                            </div>
                        </div>
    
         {/* Detalles de la última impresión */}
                        {selectedPrinter.lastImpresion !== null && (
                            <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
                                <h3 className="text-xl font-semibold mb-2">Detalles de la Última Impresión</h3>
                                <p><strong>Cliente:</strong> {selectedPrinter.lastImpresion.cliente?.nombre || "Desconocido"}</p>
                                <p><strong>Email:</strong> {selectedPrinter.lastImpresion.cliente?.email || "Desconocido"}</p>
                                <p><strong>Producto:</strong> {selectedPrinter.lastImpresion.producto?.nombre || "Desconocido"}</p>
                                <p><strong>Precio:</strong> ${selectedPrinter.lastImpresion.producto?.precio || "Desconocido"}</p>
                                <p><strong>Estado:</strong> {selectedPrinter.lastImpresion.producto?.status || "Desconocido"}</p>
                                <p><strong>Fecha de Entrega:</strong> 
                                    {selectedPrinter.lastImpresion.fechaEntrega
                                        ? new Date(selectedPrinter.lastImpresion.fechaEntrega?.toDate()).toLocaleDateString()
                                        : "No disponible"}
                                </p>
                                <img 
                                    src={selectedPrinter.lastImpresion.producto?.imagen} 
                                    alt="última impresión" 
                                    className="mt-2 rounded" 
                                    width={200} 
                                    height={200} 
                                />
                                
                                {/* Campo de código de envío */}
                                <div className="mt-4">
                                    <label htmlFor="codigoEnvio" className="block text-lg font-semibold mb-2">Código de Envío:</label>
                                    <input
                                        id="codigoEnvio"
                                        type="text"
                                        value={codigoEnvio}
                                        onChange={(e) => setCodigoEnvio(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                    <button
                                        onClick={() => handleConfirmShipment(selectedPrinter.lastImpresion.id)}
                                        className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                                    >
                                        Confirmar Envío
                                    </button>
                                </div>
                            </div>
                        )}

    
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleStartProduction}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Iniciar Producción
                            </button>
                            <button
                                onClick={handleFinishOrder}
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Selecciona una impresora para ver los detalles.</p>
                )}
<div>
    {selectedPrinter && selectedPrinter.pedido ? (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {selectedPrinter.pedido.map(e => (
                    <tr key={e.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img 
                                src={e.producto.imagen} 
                                alt={e.producto.nombre} 
                                className="w-16 h-16 object-cover rounded" 
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{e.producto.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{e.fecha.toDate().toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{e.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>No hay pedidos en cola.</p>
    )}
</div>



            </main>


        </div>
    );
}
