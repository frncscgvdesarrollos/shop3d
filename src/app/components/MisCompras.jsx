'use client';
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { MisCompras as obtenerCompras, finalizarCompra, marcarRecibido } from "../firebase";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function MisCompras() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarCompras() {
            try {
                const comprasObtenidas = await obtenerCompras(uid);
                setCompras(comprasObtenidas);
            } catch (error) {
                console.error("Error obteniendo las compras:", error);
            } finally {
                setLoading(false);
            }
        }

        cargarCompras();
    }, [uid]);

    const estados = ["pedido", "imprimiendo", "listo para enviar", "enviado", "recibido"];

    const comprasPorEstado = (estado) => compras.filter(compra => compra.status === estado);

    const handleMarcarRecibido = async (compraId) => {
        try {
            const success = await marcarRecibido(compraId);
            if (success) {
                setCompras(prevCompras => 
                    prevCompras.map(compra => 
                        compra.id === compraId ? {...compra, status: "recibido"} : compra
                    )
                );
            } else {
                console.error("No se pudo marcar como recibido");
            }
        } catch (error) {
            console.error("Error al marcar como recibido:", error);
        }
    };

    const handleFinalizarCompra = async (compraId) => {
        try {
            const success = await finalizarCompra(compraId);
            if (success) {
                setCompras(prevCompras => prevCompras.filter(compra => compra.id !== compraId));
            } else {
                console.error("No se pudo finalizar la compra");
            }
        } catch (error) {
            console.error("Error al finalizar la compra:", error);
        }
    };


    return (
        <div className="w-full lg:max-w-[90vw] min-h-[550vh] lg:min-h-[150vh] mx-auto p-4 flex flex-col gap-10 clientafondo">
            <h1 className="text-3xl font-bold mb-6 text-center">Mis Compras</h1>
            <h2 className="text-xl font-semibold mb-6 text-left">Aqui puedes ver todo el proceso! </h2>
            {loading ? (
                <p className="text-center text-lg">Cargando compras...</p>
            ) : (
                <div className="flex flex-col lg:flex-row justify-center gap-10 text-teal-900 ">
                    {estados.map((estado) => (
                        <div
                            key={estado}
                            className={`flex-col justify-start items-center flex mb-10 w-full lg:w-[20vw] h-fit
                            ${
                                estado === "pedido"
                                    ? "bg-teal-300"
                                    : estado === "imprimiendo"
                                    ? "bg-teal-400"
                                    : estado === "listo para enviar"
                                    ? "bg-teal-500"
                                    : estado === "enviado"
                                    ? "bg-teal-600"
                                    : estado === "recibido"
                                    ? "bg-teal-700"
                                    : ""
                            }`}
                        >
                            <h2 className="text-2xl font-semibold mb-4 capitalize">{estado}</h2>
                            {comprasPorEstado(estado).length === 0 ? (
                                <p className="text-center text-lg">No tienes compras en {estado}.</p>
                            ) : (
                                <div className="flex flex-col w-full lg:w-[16vw] mx-auto gap-6 p-2">
                                    {comprasPorEstado(estado).map((compra) => (
                                        <div
                                            key={compra.id}
                                            className="w-full border border-gray-300 rounded-lg shadow-lg p-4 bg-white h-fit"
                                        >
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={compra.producto.imagen}
                                                    alt={compra.producto.nombre}
                                                    className="w-full h-full object-cover rounded-md mb-4"
                                                />
                                                <h3 className="text-xl font-semibold">{compra.producto.nombre}</h3>
                                                <p className="text-gray-600 mt-2">{compra.producto.descripcion}</p>
                                                <p className="text-lg font-bold mt-2">${compra.producto.precio}</p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-500">
                                                    <strong>Fecha:</strong> {compra.fecha.toDate().toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    <strong>Estado:</strong> {compra.status}
                                                </p>
                                            </div>
                                            {estado === "enviado" && (
                                                <div>
                                                <span> codigo Envio andreani {compra.codigoEnvio}</span>
                                                <button
                                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    onClick={() => marcarRecibido(compra.id)}
                                                >
                                                    Marcar como Recibido
                                                </button>
                                                    </div>
                                            )}
                                            {estado === "recibido" && (
                                                <button
                                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                    onClick={() => finalizarCompra(compra.id)}
                                                >
                                                    Marcar como Finalizado
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
                    <div className="text-teal-300 text-3xl flex flex-col gap-10">
                        <h3>Recuerda seguir tu compra! </h3>
                        <span className="font-bold">Debes marcar las opciones para poder finalizar ! </span>
                    </div>
        </div>
    );
}
