'use client'
import { UserAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
// import { createPrinter } from '../../firebase'; // Asegúrate de implementar esta función en tu archivo de Firebase

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
        role: 'printer' // Cambiado a 'printer' en vez de 'client'
    });

    // Use useEffect to update uid when the user changes
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
        e.preventDefault(); // Prevent the default form submission
        // createPrinter(printerInfo)
        //     .then(res => {
        //         console.log('Printer registered with ID:', res);
        //         window.location.href = '/shop'; // Redirige a otra página si es necesario
        //     })
        //     .catch(err => {
        //         console.error('Error registering printer:', err);
        //     });
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
                <div className='flex flex-col'>
                    <label htmlFor="telefono" className="font-semibold text-gray-700">Teléfono</label>
                    <input 
                        type="text" 
                        name="telefono" 
                        value={printerInfo.telefono} 
                        onChange={handleChange} 
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200'
                        placeholder="Ingresa tu teléfono"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="dni" className="font-semibold text-gray-700">D.N.I</label>
                    <input 
                        type="text" 
                        name="dni" 
                        value={printerInfo.dni} 
                        onChange={handleChange}
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200' 
                        placeholder="Ingresa tu D.N.I"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="impresoraModelo" className="font-semibold text-gray-700">Modelo de Impresora</label>
                    <input 
                        type="text" 
                        name="impresoraModelo" 
                        value={printerInfo.impresoraModelo} 
                        onChange={handleChange}
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200' 
                        placeholder="Ingresa el modelo de tu impresora"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="impresoraSerial" className="font-semibold text-gray-700">Número de Serie de la Impresora</label>
                    <input 
                        type="text" 
                        name="impresoraSerial" 
                        value={printerInfo.impresoraSerial} 
                        onChange={handleChange}
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200' 
                        placeholder="Ingresa el número de serie"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="cvu" className="font-semibold text-gray-700">CVU</label>
                    <input 
                        type="text" 
                        name="cvu" 
                        value={printerInfo.cvu} 
                        onChange={handleChange}
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200' 
                        placeholder="Ingresa tu CVU"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="banco" className="font-semibold text-gray-700">Banco</label>
                    <input 
                        type="text" 
                        name="banco" 
                        value={printerInfo.banco} 
                        onChange={handleChange}
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200' 
                        placeholder="Ingresa el nombre de tu banco"
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="direccionBancaria" className="font-semibold text-gray-700">Dirección Bancaria</label>
                    <input 
                        type="text" 
                        name="direccionBancaria" 
                        value={printerInfo.direccionBancaria} 
                        onChange={handleChange}
                        className='mt-2 p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200' 
                        placeholder="Ingresa la dirección de tu banco"
                    />
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
