'use client';
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getProductos, getUser, createVenta } from "../firebase";
import ProductosMP from "./ProductosMp";
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-poppins' });

function ModalConfirmacion({ producto, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-teal-200 rounded-lg shadow-xl p-6 w-11/12 max-w-lg">
        <div className='flex items-center justify-center'>
          <h2 className="text-3xl font-semibold text-teal-900 mb-4">Confirmar compra</h2>
          <img src="./mascota.png" alt="logo" width={200} height={200} />
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className="w-full lg:w-1/3 h-auto rounded-lg shadow-lg object-cover"
          />

          <div className="flex flex-col items-start lg:items-start">
            <h3 className="text-xl font-semibold text-teal-900 mb-2">{producto.nombre}</h3>
            <p className="text-gray-700 mb-4">{producto.descripcion}</p>
            <p className="text-2xl font-bold text-teal-800 mb-2">${producto.precio}</p>
            <span className="text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-lg">{producto.categoria}</span>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListProducts() {
  const { user } = UserAuth();
  const uid = user?.uid
  const [productosParaMostrar, setProductosParaMostrar] = useState([]);
  const [cliente, setCliente] = useState({});
  const [mercadoPago, setMercadoPago] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [nombre, setNombre] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
      if (user && user?.uid) {
          getUser(user.uid)
              .then(clienteData => {
                  setCliente(clienteData);
              })
              .catch(error => {
                  console.error("Error fetching cliente:", error);
              });
      }
  }, [user]);

  useEffect(() => {
      getProductos()
          .then(productos => {
              setProductosParaMostrar(productos);
          })
          .catch(error => {
              console.error("Error fetching productos:", error);
          });
  }, []);

  const productosFiltrados = productosParaMostrar.filter(producto => {
      return (
          (categoria ? producto.categoria === categoria : true) &&
          (nombre ? producto.nombre.toLowerCase().includes(nombre.toLowerCase()) : true)
      );
  });

  function handleComprar(producto) {
      setProductoSeleccionado(producto);
      setModalVisible(true);
  }

  function confirmarCompra() {
      const producto = productoSeleccionado;
      const venta = {
          producto: {
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio: producto.precio,
              imagen: producto.imagen,
              tiempo: Number(producto.tiempo),
          },
          cliente: {
              id: uid,
              nombre: cliente.nombre || "Nombre No Disponible",
              email: user?.email || "email@ejemplo.com",
          },
          printer: {},
          pago: "pendiente",
          status: "pedido",
          totalSumado: false,
          codigoEnvio: "",
          fecha: new Date(),
      };
      createVenta(venta)
          .then(() => {
              window.location.href = '/shop/venta/success';
          })
          .catch(error => {
              console.error("Error creando la venta:", error);
          });
      
      setModalVisible(false);
  }

  return (
      <div className="imagenfondo2 min-h-screen flex flex-col md:flex-row items-start justify-center bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600">
        <aside className='bg-teal-700 bg-opacity-80 lg:pt-52 h-full shadow-lg w-full md:w-1/6'>
          <div className='flex w-full justify-end items-center md:justify-center py-5 lg:py-0'>
            <h2 className='text-center text-xl font-bold text-white drop-shadow-md'>Los más pedidos</h2>
            <img src='./mascota.png' width={100} height={100} alt='mascota shop3d' className=''/>
          </div>
          <ul className="flex flex-col w-full py-4">
              {productosParaMostrar.map((producto, index) => (
                  <li
                      key={producto.id}
                      className={`flex items-center justify-between w-full p-2 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${
                          index % 2 === 0 ? 'bg-teal-500' : 'bg-teal-700'
                      }`}
                  >
                      <div className="flex items-center gap-4">
                          <img src={producto.imagen} className="w-16 h-16 rounded-lg shadow-md" alt="imagen" />
                          <h3 className="text-xl font-semibold text-blue-900 mb-2">
                              {producto.nombre}
                          </h3>
                      </div>
                      <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                          onClick={() => handleComprar(producto)}
                      >
                          Comprar
                      </button>
                  </li>
              ))}
          </ul>
        </aside>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-right text-teal-100 mb-8 lg:text-left drop-shadow-lg">
            Descubre Nuestros Productos
          </h1>
    
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <input 
                type="text" 
                placeholder="Buscar productos" 
                value={nombre} 
                onChange={e => setNombre(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-600"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <select 
              value={categoria} 
              onChange={e => setCategoria(e.target.value)} 
              className="w-full sm:w-1/3 lg:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-600"
            >
              <option value="">Todas las categorías</option>
              <option value="categoria1">Categoría 1</option>
              <option value="categoria2">Categoría 2</option>
              <option value="categoria3">Categoría 3</option>
            </select>
          </div>
    
          {/* Lista de productos */}
          <ul className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 lg:mt-10">
            {productosFiltrados.map(producto => (
              <li 
                key={producto.id} 
                className="bg-teal-200 hover:bg-shadow-cyan-900 hover:shadow-lg bg-opacity-80 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg flex flex-col"
              >
                <div className="relative w-full aspect-w-10 aspect-h-9 overflow-hidden">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-[200px] object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/400/320'; // Placeholder image if the product image fails to load
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">
                    {producto.nombre}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{producto.descripcion}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${producto.precio}
                    </span>
                    <span className="text-sm font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-lg">
                      {producto.categoria}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleComprar(producto)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                  >
                    Comprar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
    
        {/* Modal de Confirmación */}
        {modalVisible && (
          <ModalConfirmacion 
            producto={productoSeleccionado}
            onClose={() => setModalVisible(false)} 
            onConfirm={confirmarCompra}
          />
        )}
      </div>
    );
  }  
