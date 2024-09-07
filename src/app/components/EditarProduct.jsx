'use client'

import { useState, useEffect } from "react";
import { getProductos, updateProduct } from "../firebase";

export default function EditarProduct() {
    const [productos, setProductos] = useState([]);
    const [idProducto, setIdProducto] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [status, setStatus] = useState('');
    const [imagen, setImagen] = useState('');
    const [tiempo, setTiempo] = useState('');

    useEffect(() => {
        // Función para obtener productos y actualizar el estado
        const fetchProductos = async () => {
            const productos = await getProductos();
            setProductos(productos);
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        // Buscar el producto seleccionado por ID
        const producto = productos.find(prod => prod.id === parseInt(idProducto));
        if (producto) {
            setProductoSeleccionado(producto);
            setNombre(producto.nombre || '');
            setDescripcion(producto.descripcion || '');
            setPrecio(producto.precio || '');
            setStatus(producto.status || '');
            setImagen(producto.imagen || '');
            setTiempo(producto.tiempo || '');
        } else {
            setProductoSeleccionado(null);
        }
    }, [idProducto, productos]);

    const handleChange = (e) => {
        setIdProducto(e.target.value);
    };

    const handleUpdate = () => {
        if (productoSeleccionado) {
            const updatedData = {
                nombre,
                descripcion,
                precio,
                status,
                imagen,
                tiempo
            };
            updateProduct(productoSeleccionado.id, updatedData)
                .then(() => {
                    alert("Producto actualizado con éxito");
                })
                .catch((error) => {
                    console.error("Error al actualizar el producto: ", error);
                });
        }
    };

    return (
        <div className="p-6 w-full mx-auto bg-gray-100 rounded-lg shadow-md">
            <h5>Actualizar producto</h5>
            <input
                type="number"
                placeholder="ID del producto"
                value={idProducto}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            {productoSeleccionado && (
                <div>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre del producto"
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción"
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="Precio"
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="Estado"
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="text"
                        value={imagen}
                        onChange={(e) => setImagen(e.target.value)}
                        placeholder="URL de la imagen"
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <input
                        type="text"
                        value={tiempo}
                        onChange={(e) => setTiempo(e.target.value)}
                        placeholder="Tiempo"
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button onClick={handleUpdate}>Actualizar</button>
                </div>
            )}
        </div>
    );
}
