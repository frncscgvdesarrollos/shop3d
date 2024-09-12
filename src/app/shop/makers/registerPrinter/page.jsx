'use client'
import { UserAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { createImpresora } from '@/app/firebase';

export default function RegisterPrinter() {
    const { user } = UserAuth();

    const [printerInfo, setPrinterInfo] = useState({
        uid: user?.uid , // Solo vamos a usar el uid del usuario autenticado
        currentImpresion: {},
        horasImprimidas: 0,
        horasRestantes: 0,
        id: 1, // Asigna el id de impresora de manera dinámica si es necesario
        lastImpresion: {},
        pedido: [],
        pedidosTotales:0
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
                Haz clic en el botón para registrar tu impresora utilizando tu cuenta de usuario.
            </p>
            <form onSubmit={handleSubmit} className='bg-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-6'>
                <div className='flex justify-center mt-4'>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Registrar Impresora
                    </button>
                </div>
            </form>
        </div>
    );
}
