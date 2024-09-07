'use client';
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getProductos, getUser, createVenta } from "../firebase";
import ProductosMP from "./ProductosMp";

export default function ListProducts() {
    const { user } = UserAuth(); // Obtener el usuario autenticado
    const [productosParaMostrar, setProductosParaMostrar] = useState([]);
    const [cliente, setCliente] = useState({});
    const [mercadoPago, setMercadoPago] = useState(false);

    // Obtener los datos del cliente una vez que el componente se ha montado
    useEffect(() => {
        if (user && user.uid) {
            getUser(user.uid)
                .then(clienteData => {
                    setCliente(clienteData);
                })
                .catch(error => {
                    console.error("Error fetching cliente:", error);
                });
        }
    }, [user]);

    // Obtener los productos
    useEffect(() => {
        getProductos()
            .then(productos => {
                setProductosParaMostrar(productos);
            })
            .catch(error => {
                console.error("Error fetching productos:", error);
            });
    }, []);

    // Manejar la compra
    function handleComprar(producto) {
        // Crear el objeto de la venta
        const venta = {
            producto: {
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                imagen: producto.imagen,
                tiempo: Number(producto.tiempo)
            },
            cliente: {
                id: cliente.uid || user.uid, // ID del usuario autenticado
                nombre: cliente.nombre || "Nombre No Disponible", // Nombre del cliente
                email: user?.email || "email@ejemplo.com", // Email del cliente
            },
            pago: "pendiente",
            status: "pedido",
            totalSumado:false,
            fecha: new Date(),
        };

        createVenta(venta)
            .then(() => {
                window.location.href = '/shop/venta/success' 
                // setMercadoPago(!mercadoPago);
            })
            .catch(error => {
                console.error("Error creando la venta:", error);
            });
    }

    return (
        <div className="w-full">
            <h5 className="text-3xl font-extrabold text-left text-teal-600">
                Lista de Productos 
                {/* 📦 */}
            </h5>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 mt-4">
                {productosParaMostrar.map(producto => (
                    <li key={producto.id} className="bg-gradient-to-br from-gray-200 via-teal-200 to-gray-100 border border-teal-300 rounded-lg shadow-lg p-6 flex flex-col justify-between overflow-y-visible">
                        <h6 className="text-2xl font-bold text-teal-600 mb-2">{producto.nombre}</h6>
                        <p className="text-teal-700 mb-4">{producto.descripcion}</p>
                        <img src={producto.imagen} alt="productos" className="h-[20vh] rounded-lg" />
                        <span className="text-xl font-semibold text-lime-600">Precio ${producto.precio}</span>
                        <span>Estado: {producto.status}</span>
                        <span>Identificador: {producto.id}</span>
                        <button 
                            className="bg-teal-500 hover:bg-teal-600 text-lime-300 font-semibold py-2 px-4 rounded"
                            onClick={() => handleComprar(producto)}
                        >
                            Comprar
                        </button>
                        {mercadoPago ?
                            <ProductosMP producto={producto} />
                            : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}
