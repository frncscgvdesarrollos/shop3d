'use client';
import { useState, useEffect } from 'react';
import { getUsers } from "../firebase";

export default function ListClient() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para obtener los clientes
        function fetchClientes() {
            getUsers()
                .then(clientesData => {
                    setClientes(clientesData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al obtener los clientes:", error);
                    setError("Error al obtener los clientes.");
                    setLoading(false);
                });
        }

        fetchClientes();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Cargando clientes...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (clientes.length === 0) return <p className="text-center text-gray-600">No hay clientes registrados.</p>;

    return (
        <div className="overflow-x-auto w-full">
            <h2 className="text-2xl font-bold text-left bg-gradient-to-r from-blue-500 to-blue-800 text-white p-4">Lista de Clientes</h2>
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-lg">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Apellido</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {clientes.map(cliente => (
                        <tr key={cliente.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.nombre}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{cliente.apellido}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
