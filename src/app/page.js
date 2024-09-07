'use client';
import { useEffect, useState } from 'react';
import Header from "./components/Header";
import { obtenerComentarios } from './firebase'; 
import { motion } from 'framer-motion'; 

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchComentarios() {
      try {
        const comentariosList = await obtenerComentarios();
        setComentarios(comentariosList);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    }

    fetchComentarios();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % comentarios.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, comentarios.length]);

  return (
    <div className="min-w-screen min-h-screen bg-teal-800">
      <Header />
      <main className="bg-teal-900 min-h-screen relative top-0 z-[900]">
        <section className="imagenfondo w-full h-[95vh] flex flex-col lg:flex-row justify-around bg-teal-800 bg-opacity-80">
          <div className="lg:ml-auto lg:mr-[12.5vw] py-10 h-[100vh] lg:py-20 rounded-lg w-full lg:w-[40vw]">
            <div className="flex justify-center lg:justify-center items-center px-4 lg:px-0 py-20">
              <h1 className="text-orange-400 font-bold text-3xl sm:text-4xl lg:text-5xl text-center mb-4">
                Bienvenido a SHOP<i className="text-teal-100 font-bold -rotate-12 text-4xl sm:text-5xl lg:text-6xl">3</i>D.
              </h1>
              <img src="./mascota.png" className="w-32 sm:w-40 lg:w-60 lg:mr-[5vw]" alt="mascota.png" />
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-orange-300 mt-6 lg:mt-10 lg:ml-[1rem]">
              Impresiones a pedido <br/>y a medida.
            </p>
            <section className="mt-8 lg:mt-12 flex flex-col items-center gap-8 px-6 lg:w-[40vw]">
              <div className="relative w-full flex flex-col items-center"
                   onMouseEnter={() => setIsHovered(true)}
                   onMouseLeave={() => setIsHovered(false)}>
                <h2 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-6 text-right lg:ml-auto lg:mr-[5rem]">
                  Gracias por elegirnos.
                </h2>
                <div className="overflow-hidden w-full">
                  <motion.div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {comentarios.map((comentario, index) => {
                      const fechaFormateada = new Date(comentario.fecha).toLocaleString();
                      return (
                        <div key={index} className="flex-none text-center w-full">
                          <div className="border border-teal-300 rounded-lg shadow-md p-4 bg-gradient-to-r from-orange-500 to-teal-900">
                            <p className="text-teal-100 text-lg font-semibold mb-4">
                              "{comentario.texto}"
                            </p>
                            <span className="block text-teal-600 font-semibold">{comentario.nombre}</span>
                            <span className="text-teal-900">{fechaFormateada}</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        </section>
        
        {/* Sección ¿Cómo funciona? */}
        <section className="bg-teal-800 py-12 px-4 sm:px-6 lg:px-8 clienteFeliz">
          <div className="max-w-3xl lg:ml-auto lg:mr-[8vw] text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-300 mb-8">¿Cómo Funciona SHOP3D?</h2>
            {/* Contenido omitido */}
          </div>
        </section>

        {/* Última sección */}
        <section className='relative h-[90vh] w-full flex flex-col lg:flex-row justify-center items-center bg-teal-50 p-6'>
          <div className='relative z-20 text-center lg:text-left lg:w-1/2 space-y-6 p-10 mt-[5rem] bg-teal-100 bg-opacity-70 rounded-lg shadow-lg lg:mr-[20vw]'>
            <h2 className='text-4xl font-bold text-teal-800'>¿Eres dueño de una impresora?</h2>
            <h3 className='text-2xl font-semibold text-teal-600'>¡Únete a nuestra red de impresión!</h3>
            <p className='text-teal-700'>
              Aprovecha la oportunidad de maximizar el uso de tu impresora al formar parte de nuestro exclusivo grupo de impresoras. Al pagar una membresía, formarás parte del pull de impresoras de manera fácil y rápida.
            </p>
            <button className='ml-auto bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out'>
              ¡Quiero ser un printer!
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
