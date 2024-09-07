'use client';
import { useState } from 'react';
import { deleteProduct } from '../firebase';

export default function EliminarProducto() {
    const [id, setId] = useState('');

    // Function to handle deletion when button is clicked
    function handleEliminar() {
        if (!id) {
            return alert("Por favor, ingrese un ID válido.");
        }

        deleteProduct(Number(id)) // Asegúrate de convertir el id a número si es necesario
            .then(() => {
                const successMessage = `Producto con ID ${id} eliminado con éxito.`;
                console.log(successMessage);
                alert(successMessage);
            })
            .catch((error) => {
                console.error('Error al eliminar el producto:', error);
                alert('Hubo un error al eliminar el producto. Por favor, intente de nuevo.');
            });
    }

    return (
        <div className="w-full">
                <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Ingrese el ID para eliminar el producto</h2>
                    <input
                        type="number"
                        placeholder="ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                    />
                    <button
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                        onClick={handleEliminar} // Llama a la función directamente
                    >
                        Eliminar
                    </button>
                </div>
        </div>
    );
}
