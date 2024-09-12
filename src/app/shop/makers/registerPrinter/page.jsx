'use client'
import { UserAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { createImpresora } from '@/app/firebase';

export default function RegisterPrinter() {
    const { user } = UserAuth();

    const [printerInfo, setPrinterInfo] = useState({
        uid: user?.uid, // Solo vamos a usar el uid del usuario autenticado
        currentImpresion: {},
        horasImprimidas: 0,
        horasRestantes: 0,
        id: 1, // Asigna el id de impresora de manera dinámica si es necesario
        lastImpresion: {},
        pedido: [],
        pedidosTotales: 0,
        modelo: '', // Agregar modelo de impresora
        volumenImpresion: '', // Volumen de impresión de la impresora
        materiales: '', // Materiales soportados
        tipo: '' // Tipo de impresora (SLA, DLP, MSLA, etc.)
    });

    // Actualiza el uid cuando el usuario cambia
    useEffect(() => {
        if (user) {
            setPrinterInfo(prevState => ({
                ...prevState,
                uid: user.uid
            }));
        }
    }, [user]);

    // Maneja los cambios de entrada en el formulario
    function handleChange(e) {
        const { name, value } = e.target;
        setPrinterInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Llamada a la función para crear la impresora en Firebase
        createImpresora(printerInfo)
            .then(res => {
                console.log('Impresora registrada con éxito:', res);
                window.location.href = '/shop'; // Redirige a otra página si es necesario
            })
            .catch(err => {
                console.error('Error al registrar la impresora:', err);
            });
    }

    return (
        <div className='flex flex-col items-center gap-6 p-8 bg-gradient-to-b from-green-50 to-gray-100 min-h-screen'>
            <h2 className='text-4xl font-extrabold text-green-500 my-4'>¡Registra tu impresora con nosotros!</h2>
            <p className='text-lg text-gray-700 mb-6 text-center max-w-lg'>
                Completa las especificaciones de tu impresora 3D a continuación.
            </p>
            <form onSubmit={handleSubmit} className='bg-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-6'>
                {/* Campo para el modelo de impresora */}
                <div>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='modelo'>Modelo de Impresora</label>
                    <input 
                        type='text' 
                        name='modelo' 
                        value={printerInfo.modelo} 
                        onChange={handleChange}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300' 
                        placeholder='Introduce el modelo de tu impresora'
                        required 
                    />
                </div>

                {/* Campo para el volumen de impresión */}
                <div>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='volumenImpresion'>Volumen de Impresión (mm)</label>
                    <input 
                        type='text' 
                        name='volumenImpresion' 
                        value={printerInfo.volumenImpresion} 
                        onChange={handleChange}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300' 
                        placeholder='Ej. 120x120x120 mm'
                        required 
                    />
                </div>

                {/* Campo para los materiales soportados */}
                <div>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='materiales'>Materiales soportados</label>
                    <input 
                        type='text' 
                        name='materiales' 
                        value={printerInfo.materiales} 
                        onChange={handleChange}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300' 
                        placeholder='Ej. Resina, ABS, PLA, etc.'
                        required 
                    />
                </div>

                {/* Campo para el tipo de impresora (SLA, DLP, MSLA) */}
                <div>
                    <label className='block text-gray-700 font-bold mb-2' htmlFor='tipo'>Tipo de Impresora</label>
                    <select 
                        name='tipo' 
                        value={printerInfo.tipo} 
                        onChange={handleChange} 
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300'
                        required
                    >
                        <option value=''>Selecciona el tipo de impresora</option>
                        <option value='SLA'>SLA (Estereolitografía)</option>
                        <option value='DLP'>DLP (Proyección de Luz Digital)</option>
                        <option value='MSLA'>MSLA (Máscara de Sombra de Matriz de Píxeles)</option>
                    </select>
                </div>

                <div className='flex justify-center mt-4'>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Registrar Impresora
                    </button>
                </div>
            </form>
        </div>
    );
}
