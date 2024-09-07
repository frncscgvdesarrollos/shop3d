'use client'
import { useState } from "react";
import { createProduct } from "../firebase";

export default function CreateProductForm() {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: 0,
        status: "",
        imagen: "",
        tiempo: 0,
        masVendido: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación simple (puedes expandirla según tus necesidades)
        if (!formData.nombre || !formData.precio || !formData.status) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }
        
        try {
            // Llamada a la función asíncrona
            const id = await createProduct(formData);
            console.log("Producto creado con ID:", id);

            // Limpiar formulario
            setFormData({
                nombre: "",
                descripcion: "",
                precio: 0,
                status: "",
                imagen: "",
                tiempo: 0,
            });

            // Mostrar mensaje de éxito
            alert("Producto creado con éxito!");
        } catch (error) {
            console.error("Error al crear el producto:", error);
            alert("Hubo un problema al crear el producto. Inténtelo de nuevo.");
        }
    };

    return (
        <div className="p-6 w-full text-teal-600 mx-auto bg-gray-100 rounded-lg shadow-md">
            <h5 className="text-2xl font-bold mb-4">Crear Producto</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Descripción</label>
                    <input
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Precio</label>
                    <input
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Estado</label>
                    <input
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">URL de la Imagen</label>
                    <input
                        name="imagen"
                        value={formData.imagen}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Tiempo</label>
                    <input
                        name="tiempo"
                        value={formData.tiempo}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-teal-600 p-2 rounded-md hover:bg-blue-600 transition">
                    Cargar
                </button>
            </form>
        </div>
    );
}
