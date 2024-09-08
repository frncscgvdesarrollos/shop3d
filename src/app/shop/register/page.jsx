'use client'
import { UserAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { createUser } from '@/app/firebase';

export default function Register() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [userRegister, setUserRegister] = useState({
        uid: uid || '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        dni: '',
        role: 'client'
    });

    const [errors, setErrors] = useState({});

    // Use useEffect to update uid when the user changes
    useEffect(() => {
        if (user) {
            setUserRegister(prevState => ({
                ...prevState,
                uid: user.uid
            }));
        }
    }, [user]);

    function handleChange(e) {
        const { name, value } = e.target;
        setUserRegister(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function validateForm() {
        let isValid = true;
        let errors = {};

        // Validate nombre
        if (!userRegister.nombre.trim()) {
            isValid = false;
            errors.nombre = "El nombre es obligatorio";
        }

        // Validate apellido
        if (!userRegister.apellido.trim()) {
            isValid = false;
            errors.apellido = "El apellido es obligatorio";
        }

        // Validate direccion
        if (!userRegister.direccion.trim()) {
            isValid = false;
            errors.direccion = "La dirección es obligatoria";
        }

        // Validate telefono (simple validation for 10 digits)
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(userRegister.telefono)) {
            isValid = false;
            errors.telefono = "Número de teléfono inválido. Debe tener 10 dígitos.";
        }

        // Validate dni (simple validation for 8 digits)
        const dniPattern = /^[0-9]{8}$/;
        if (!dniPattern.test(userRegister.dni)) {
            isValid = false;
            errors.dni = "DNI inválido. Debe tener 8 dígitos.";
        }

        setErrors(errors);
        return isValid;
    }

    function handleSubmit(e) {
        e.preventDefault(); // Prevent the default form submission

        if (validateForm()) {
            createUser(userRegister)
                .then(res => {
                    console.log('User created with ID:', res);
                    window.location.href = '/shop';
                })
                .catch(err => {
                    console.error('Error creating user:', err);
                });
        }
    }

    return (
        <div className='flex flex-col items-center gap-6 p-8 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen'>
            <h2 className='text-4xl font-extrabold text-blue-500 my-4'>¡Únete a nuestra comunidad!</h2>
            <p className='text-lg text-gray-700 mb-6 text-center max-w-lg'>
                Regístrate y comienza a disfrutar de todos los beneficios de ser parte de nuestra red exclusiva. 
                ¡Completa tus datos para poder brindarte el mejor servicio personalizado!
            </p>
            <form onSubmit={handleSubmit} className='bg-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-6'>
                <div className='flex flex-col'>
                    <label htmlFor="nombre" className="font-semibold text-gray-700">Nombre</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        value={userRegister.nombre} 
                        onChange={handleChange} 
                        className={`mt-2 p-3 rounded-lg border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
                        placeholder="Ingresa tu nombre"
                    />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="apellido" className="font-semibold text-gray-700">Apellido</label>
                    <input 
                        type="text" 
                        name="apellido" 
                        value={userRegister.apellido} 
                        onChange={handleChange} 
                        className={`mt-2 p-3 rounded-lg border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
                        placeholder="Ingresa tu apellido"
                    />
                    {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="direccion" className="font-semibold text-gray-700">Dirección</label>
                    <input 
                        type="text" 
                        name="direccion" 
                        value={userRegister.direccion} 
                        onChange={handleChange} 
                        className={`mt-2 p-3 rounded-lg border ${errors.direccion ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
                        placeholder="Ingresa tu dirección"
                    />
                    {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="telefono" className="font-semibold text-gray-700">Teléfono</label>
                    <input 
                        type="text" 
                        name="telefono" 
                        value={userRegister.telefono} 
                        onChange={handleChange} 
                        className={`mt-2 p-3 rounded-lg border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
                        placeholder="Ingresa tu teléfono"
                    />
                    {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="dni" className="font-semibold text-gray-700">D.N.I</label>
                    <input 
                        type="text" 
                        name="dni" 
                        value={userRegister.dni} 
                        onChange={handleChange}
                        className={`mt-2 p-3 rounded-lg border ${errors.dni ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`} 
                        placeholder="Ingresa tu D.N.I"
                    />
                    {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
                </div>
                <div className='flex justify-center mt-4'>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Registrarse
                    </button>
                </div>
            </form>
        </div>
    );
}
