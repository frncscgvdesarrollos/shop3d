'use client';
import { useState, useEffect } from 'react';
import { ventaPagoPendiente, agregarPedido, agregarComentario, updateProductoMasVendido } from '../../../firebase';
import { UserAuth } from "@/app/context/AuthContext";
import { doc, getDoc ,getDocs, collection, query ,where} from "firebase/firestore";
import { db } from '../../../firebase';

export default function Success() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [comentario, setComentario] = useState('');
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    if (!uid) {
      console.error('UID del usuario no disponible');
      return;
    }

    async function updatePayment() {
      try {
        const ventaId = await ventaPagoPendiente(uid);
        console.log('Venta ID obtenida:', ventaId);

        if (ventaId) {
          // Obtén el documento de la venta directamente usando la referencia
          const ventaRef = doc(db, 'ventas', ventaId);
          const ventaSnapshot = await getDoc(ventaRef);

          if (ventaSnapshot.exists()) {
            const ventaData = ventaSnapshot.data();

            if (ventaData && ventaData.producto) {
              const productoId = ventaData.producto.id;
              const tiempo = ventaData.producto.tiempo;
              const impresoraId = ventaData.impresoraId;

              // Actualizamos el campo masVendido del producto
              await updateProductoMasVendido(productoId, 1);

              // Creamos el pedido y lo agregamos a la impresora
              const pedido = {
                producto: {
                  id: productoId,
                  tiempo: tiempo
                },
                cliente: {
                  id: ventaData.cliente.id,
                  nombre: ventaData.cliente.nombre,
                  email: ventaData.cliente.email,
                }
              };

              // Verifica que los datos sean válidos antes de llamar a agregarPedido
              if (pedido.producto.id && pedido.cliente.id && impresoraId) {
                await agregarPedido(impresoraId, pedido);
                setProducto(ventaData.producto);

                console.log(`Venta con ID ${ventaId} ha sido actualizada a 'pagadoMP' y la impresora ha sido actualizada.`);
              } else {
                console.error('Datos del pedido no válidos:', pedido);
              }
            } else {
              console.error('Datos del producto no encontrados en la venta.');
            }
          } else {
            console.error('No se encontró ninguna venta con el ID especificado.');
          }
        } else {
          console.error('No se pudo obtener el ID de la venta.');
        }
      } catch (error) {
        console.error('Error al actualizar el estado de la venta:', error);
      }
    }

    updatePayment();
  }, [uid]);

  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();

    if (!uid || !comentario) {
      console.error('Comentario o usuario no válido.');
      return;
    }

    try {
      const ventasRef = collection(db, 'ventas');
      const q = query(ventasRef, where('cliente.id', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const ventaSnapshot = querySnapshot.docs[0];
        const ventaData = ventaSnapshot.data();

        if (ventaData && ventaData.cliente) {
          const cliente = ventaData.cliente;

          const comentarioData = {
            texto: comentario,
            fecha: new Date().toISOString(),
            nombre: cliente.nombre,
            userId: uid,
            ventaId: ventaSnapshot.id
          };

          if (comentarioData.texto) {
            const result = await agregarComentario(comentarioData.texto, comentarioData.nombre, comentarioData.userId, comentarioData.ventaId);

            if (result.success) {
              setComentario('');
              console.log('Comentario guardado exitosamente.');
            } else {
              console.error('Error al guardar el comentario:', result.error);
            }
          } else {
            console.error('Comentario inválido. No se puede agregar sin texto.');
          }
        } else {
          console.error('No se encontraron datos del cliente en la venta.');
        }
      } else {
        console.error('No se encontró ninguna venta asociada al usuario.');
      }
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
    }
  };

  return (
    <div className="imagenfondo2 flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h1>
        <p className="text-lg text-gray-700 mb-6">Tu pago ha sido procesado con éxito.</p>

        {producto && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Detalles del Producto</h2>
            <div className="flex items-center justify-center mb-4">
              <img src={producto.imagen} alt={producto.nombre} className="w-32 h-32 object-cover rounded-lg" />
            </div>
            <p className="text-lg font-semibold">Nombre: {producto.nombre}</p>
            <p className="text-lg">Descripción: {producto.descripcion}</p>
            <p className="text-lg font-semibold">Precio: ${producto.precio}</p>
            <p className="text-lg">Tiempo de Impresión: {producto.tiempo} minutos</p>
          </div>
        )}

        <form onSubmit={handleComentarioSubmit} className="mb-6">
          <textarea
            value={comentario}
            onChange={handleComentarioChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            placeholder="Deja tu comentario aquí..."
          />
          <button 
            type="submit"
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            Enviar Comentario
          </button>
        </form>

        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          onClick={() => window.location.href = '/shop'}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}
