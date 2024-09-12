'use client'
import { UserAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { createPrinter } from '../../firebase'; // Asegúrate de implementar esta función

export default function RegisterPrinter() {
    const { user } = UserAuth();

    const [printerInfo, setPrinterInfo] = useState({
        uid: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        dni: '',
        impresoraModelo: '',
        impresoraSerial: '',
        cvu: '',
        banco: '',
        direccionBancaria: '',
        role: 'printer', // rol por defecto
        // Valores por defecto para la impresora
        currentImpresion: {},
        horasImprimidas: 0,
        horasRestantes: 0,
        id: 1, // Asigna el id de impresora de manera dinámica si es necesario
        lastImpresion: {},
        pedido: [],
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
        createPrinter(printerInfo)
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
                Completa este formulario para registrarte como impresor y empezar a colaborar con nosotros. 
                Necesitamos información detallada sobre tu impresora y datos de contacto para asegurar una comunicación efectiva.
            </p>
            <form onSubmit={handleSubmit} className='bg-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-6'>
                <div className='flex flex-col'>
                    <label htmlFor="nombre" className="font-semibold text-gray-700">Nombre</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        value={printerInfo.nombre} 
                        onChange={handleChange} 
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200'
                        placeholder="Ingresa tu nombre"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="apellido" className="font-semibold text-gray-700">Apellido</label>
                    <input 
                        type="text" 
                        name="apellido" 
                        value={printerInfo.apellido} 
                        onChange={handleChange} 
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200'
                        placeholder="Ingresa tu apellido"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="direccion" className="font-semibold text-gray-700">Dirección</label>
                    <input 
                        type="text" 
                        name="direccion" 
                        value={printerInfo.direccion} 
                        onChange={handleChange} 
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200'
                        placeholder="Ingresa tu dirección"
                    />
                </div>
                {/* Continúa con los demás campos del formulario */}
                <div className='flex justify-center mt-4'>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Registrar Impresora
                    </button>
                </div>
            </form>
        </div>
    );
}
