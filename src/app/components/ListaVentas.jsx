'use client';
import { useState, useEffect } from 'react';
import { getVentas, getDatosCliente } from '../firebase'; // Ajusta la ruta según tu estructura de proyecto

export default function ListaVentas() {
    const [ventas, setVentas] = useState([]);
    const [datosCliente, setDatosCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Obtener datos de ventas
                const ventasData = await getVentas();
                setVentas(ventasData);

                // Obtener datos del cliente
                const datosClienteData = await getDatosCliente(); // Nota el cambio de nombre aquí
                setDatosCliente(datosClienteData);

                // Finalizar la carga
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setError("Error al obtener los datos.");
                setLoading(false);
            }
        }

        fetchData();
    }, []); // El array vacío asegura que useEffect se ejecute solo una vez al montar el componente

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='flex-1 min-h-[60vh] bg-teal-50'>
            <h1 className='text-3xl font-bold mb-6 text-center  text-teal-600'>Lista de Ventas</h1>
            {/* Mostrar datos del cliente si están disponibles */}
            {datosCliente && (
                <div className='mb-6 bg-teal-50'>
                    <h2 className='text-xl font-semibold text-teal-600'>Datos del Cliente</h2>
                    <p><strong>Compras Cliente:</strong> {datosCliente.comprasCliente}</p>
                    <p><strong>Total Horas Impresas:</strong> {datosCliente.totalHorasImpresas}</p>
                    <p><strong>Total Vendido:</strong> ${datosCliente.totalVendido}</p>
                </div>
            )}
            <div>
                {ventas.length === 0 && <p>No hay ventas disponibles.</p>}
            </div>
            <div className='overflow-x-auto w-full'>
                <table className='min-w-full bg-teal-50 border border-gray-200'>
                    <thead className='bg-teal-600 text-white'>
                        <tr>
                            <th className='py-3 px-2 text-left text-sm font-medium'>ID</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Producto</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Descripción</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Precio</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Cliente</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Email</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Estado de Pago</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Status</th>
                            <th className='py-3 px-2 text-left text-sm font-medium'>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta , index) => (
                            <tr key={venta.id} className={`border-b ${index % 2 === 0 ? 'bg-teal-50' : 'bg-teal-100'}`}>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.id}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.producto.nombre}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.producto.descripcion}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>${venta.producto.precio}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.cliente.nombre}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.cliente.email}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.pago}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>{venta.status}</td>
                                <td className='py-4 px-2 text-sm text-gray-700'>
                                    {venta.pago === 'pagadoMP' && (
                                        <button
                                            onClick={() => handleFinalizarVenta(venta.id)}
                                            className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700'
                                        >
                                            Finalizar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
