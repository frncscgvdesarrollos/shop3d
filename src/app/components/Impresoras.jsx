'use client'
import { useEffect, useState } from 'react';
import {
    getAllImpresoras,
    createImpresora,
    updateImpresora,
    deleteImpresora,
    agregarPedido,
    iniciarProduccion,
    finalizarPedido,
} from '../firebase'; // Importa las funciones desde el archivo de Firebase
import { UserAuth } from '../context/AuthContext';

export default function ImpresorasPanel() {
    const [impresoras, setImpresoras] = useState([]);
    const [newImpresora, setNewImpresora] = useState({});
    const [agregar, setAgregar] = useState(false);
    const handleAgregar = () => {
        setAgregar(!agregar);
    }
    const { user } = UserAuth(); // Obtén el usuario autenticado

    useEffect(() => {
        function fetchImpresoras() {
            getAllImpresoras()
                .then(impresorasList => {
                    setImpresoras(impresorasList);
                })
                .catch(error => {
                    console.error("Error al obtener las impresoras:", error);
                });
        }

        fetchImpresoras();
    }, []);

    function handleAgregarImpresora() {
        createImpresora(newImpresora)
            .then(newDocId => {
                // Actualiza el estado de las impresoras
                setImpresoras([...impresoras, { id: newDocId, ...newImpresora }]);
                setNewImpresora({}); // Limpia el formulario
            })
            .catch(error => {
                console.error("Error al crear la impresora:", error);
            });
    }

    function handleIniciarProduccion(impresoraId) {
        iniciarProduccion(impresoraId)
            .then(updatedImpresora => {
                if (updatedImpresora) {
                    setImpresoras(prevImpresoras =>
                        prevImpresoras.map(impresora =>
                            impresora.id === impresoraId
                                ? { ...impresora, ...updatedImpresora }
                                : impresora
                        )
                    );
                }
            })
            .catch(error => {
                console.error("Error al iniciar la producción:", error);
            });
    }

    function handleFinalizarPedido(impresoraId) {
        finalizarPedido(impresoraId)
            .then(updatedImpresora => {
                if (updatedImpresora) {
                    setImpresoras(prevImpresoras =>
                        prevImpresoras.map(impresora =>
                            impresora.id === impresoraId
                                ? { ...impresora, ...updatedImpresora }
                                : impresora
                        )
                    );
                }
            })
            .catch(error => {
                console.error("Error al finalizar el pedido:", error);
            });
    }

    function handleEliminarImpresora(impresoraId) {
        deleteImpresora(impresoraId)
            .then(deletedId => {
                setImpresoras(prevImpresoras =>
                    prevImpresoras.filter(impresora => impresora.id !== deletedId)
                );
            })
            .catch(error => {
                console.error("Error al eliminar la impresora:", error);
            });
    }

    return (
        <div className="w-full py-10 font-[600]">
            <h1 className="text-4xl font-extrabold mb-10 text-center text-teal-600 drop-shadow-lg">
                Panel de Impresoras
            </h1>

            {/* Listado de impresoras */}
            <div className="max-w-5xl mx-auto">
                <ul className="w-full mx-auto mt-4">
                    {impresoras.map(impresora => (
                        <li
                            key={impresora.id}
                            className="bg-gradient-to-b from-gray-100 to-teal-100 hover:shadow-2xl transition-shadow duration-300 flex justify-evenly"
                        >
                            <div className='w-full px-2'>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">
                                        Impresora: {impresora.id}
                                    </h2>
                                    <span className="text-sm font-medium">
                                        ID: {impresora.id}
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <p className="">
                                        Horas Imprimidas:
                                        <span className="font-bold ml-2">
                                            {impresora.horasImprimidas}
                                        </span>
                                    </p>
                                    <p className="">
                                        Horas Restantes:
                                        <span className="font-bold ml-2">
                                            {impresora.horasRestantes}
                                        </span>
                                    </p>
                                    <p>
                                        <span className=''>
                                            Pedido actual:
                                            {impresora.currentImpresion && Object.keys(impresora.currentImpresion).length > 0 ? (
                                                <span className='font-semibold text-blue-600 ml-2'>
                                                    {impresora.currentImpresion.producto.nombre}<br />
                                                </span>
                                            ) : (
                                                <span className='font-semibold text-red-600 ml-2'>
                                                    No está imprimiendo<br />
                                                </span>
                                            )}
                                        </span>
                                        Última impresión:
                                        {impresora.lastImpresion && Object.keys(impresora.lastImpresion).length > 0 ? (
                                            <span className='font-semibold text-green-600 ml-2'>
                                                {impresora.lastImpresion.producto.nombre} - {impresora.lastImpresion.producto.tiempo} horas
                                            </span>
                                        ) : (
                                            <span className='font-semibold text-gray-600 ml-2'>
                                                No hay información de la última impresión
                                            </span>
                                        )}
                                    </p>
                                    <p>
                                        Pedidos:
                                        <span className='font-bold ml-2'>
                                            {impresora.pedido.length}
                                        </span><br />
                                    </p>

                                </div>
                            </div>
                            {/* <div className="flex lg:flex-col justify-end items-end lg:gap-10 mt-6 p-2">
                                {impresora.currentImpresion && Object.keys(impresora.currentImpresion).length > 0 ? (
                                    <button
                                        onClick={() => handleFinalizarPedido(impresora.id)}
                                        className="w-full bg-red-600 text-white p-2 rounded-lg ml-auto hover:bg-red-800 transition-colors duration-300 transform hover:scale-105 shadow-md"
                                    >
                                        Finalizar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleIniciarProduccion(impresora.id)}
                                        className="w-full bg-lime-600 text-white p-2 rounded-lg ml-auto hover:bg-lime-800 transition-colors duration-300 transform hover:scale-105 shadow-md"
                                    >
                                        Imprimir
                                    </button>
                                )}
                            </div> */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
