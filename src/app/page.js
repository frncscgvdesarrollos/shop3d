'use client';
import { useEffect, useState } from 'react';
import Header from "./components/Header";
import {  obtenerComentarios } from './firebase'; 
import { motion } from 'framer-motion'; 
import Image from 'next/image';
import { UserAuth } from './context/AuthContext';

export default function Home() {
  // const { user } = UserAuth();
  // const uid = user?.uid;

  // const [datosCliente, setDatosCliente] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Efecto para obtener los datos del cliente y redirigir si no existe
  // useEffect(() => {
  //   if (uid) {
  //     getUser(uid).then((data) => {
  //       setDatosCliente(data);
  //       // Puedes añadir lógica adicional aquí si es necesario
  //     }).catch(error => {
  //       // Redirige al usuario a la página de registro si ocurre un error
  //       window.location.href = "/shop/register";
  //     });
  //   } else {
  //     // Si no hay un UID, redirige a la página de registro
  //     window.location.href = "/shop/register";
  //   }
  // }, [uid]);

  // Efecto para obtener los comentarios al cargar el componente
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

  // Efecto para cambiar los slides automáticamente
  useEffect(() => {
    if (comentarios.length > 0) {
      const interval = setInterval(() => {
        if (!isHovered) {
          setCurrentSlide((prev) => (prev + 1) % comentarios.length);
        }
      }, 3000); // Cambia de slide cada 3 segundos

      return () => clearInterval(interval);
    }
  }, [isHovered, comentarios.length]);


  return (
    <div className="min-w-screen min-h-screen bg-teal-800">
      <Header />
      <main className="bg-teal-900 min-h-screen relative top-0 z-[900]">
<section className="imagenfondo w-full h-[95vh] lg:h-[105vh] flex flex-col lg:flex-row justify-center lg:justify-around bg-teal-800 bg-opacity-80">
<div className="py-36 h-full lg:py-20 rounded-lg w-full lg:w-[40vw] flex flex-col items-center lg:items-start lg:ml-auto lg:mr-[12.5vw] md:items-start md:ml-0 md:mr-0">
  <div className="flex flex-col lg:flex-row items-center lg:items-end px-4 lg:px-0 py-10 lg:py-20 lg:mr-[4rem] md:items-start md:ml-4 md:mr-0">
    <h1 className="text-orange-400 font-bold text-3xl sm:text-4xl lg:text-5xl text-center lg:text-right mb-4 md:text-left md:mb-4 md:text-center">
      Bienvenido a Makers<i className="text-teal-100 font-bold -rotate-12 text-4xl sm:text-5xl lg:text-6xl">3</i>D
    </h1>
    <Image 
      src="/mascota.png" 
      alt="Mascota" 
      className="w-32 sm:w-40 lg:w-60 lg:ml-[5rem] md:ml-0"
      width={640} 
      height={480} 
    />
  </div>
  <p className="text-2xl sm:text-3xl lg:text-4xl text-right lg:text-right font-bold text-orange-300 mt-6 lg:mt-10 lg:ml-[10rem] md:text-left md:ml-4 md:mt-6 md:text-center">
    Impresiones a pedido <br /> y a medida.
  </p>
  <section className="mt-8 lg:mt-20 flex flex-col items-center gap-8 px-6 lg:px-0 lg:w-[40vw] md:items-start md:ml-0 md:mr-0">
    <div className="relative w-full flex flex-col items-center"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-6 text-center lg:text-left lg:ml-auto lg:mr-[5rem] md:text-left md:ml-4 md:text-center">
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
                    &quot;{comentario.texto}&quot;
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


  
<section className="flex flex-col lg:flex-row bg-teal-900 py-12 px-4 sm:px-6 lg:px-8 h-auto quienesSomos">
  <div className="lg:w-1/3 lg:mr-auto lg:ml-[20vw] lg:pr-20 mx-auto flex flex-col items-start justify-center bg-teal-800 bg-opacity-70 rounded-lg shadow-lg p-5">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-300 mb-6 text-center lg:text-left">
      ¿Quiénes Somos?
    </h2>
    <p className="text-lg text-teal-200 mb-6 text-center lg:text-left leading-relaxed">
      En Makers3D, nuestra misión es revolucionar el mundo de la impresión 3D ofreciendo soluciones innovadoras y accesibles. Nos especializamos en transformar tus ideas en productos físicos con una calidad excepcional y a precios competitivos.
    </p>
    <p className="text-lg text-teal-200 mb-6 text-center lg:text-left leading-relaxed">
      Conectamos a nuestros clientes con una red diversa de impresoras, tanto propias como de terceros, para garantizar que cada proyecto se lleve a cabo con precisión y cuidado. Desde artículos prácticos hasta piezas decorativas, nuestro objetivo es hacer realidad tus proyectos con la mejor tecnología disponible.
    </p>
    <p className="text-lg text-teal-200 mb-6 text-center lg:text-left leading-relaxed">
      Nos enorgullece ser un puente entre la tecnología avanzada y las necesidades de nuestros clientes, facilitando una experiencia de impresión 3D sin igual. Descubre cómo SHOP3D puede ayudarte a llevar tus ideas al siguiente nivel.
    </p>
    <a href="#contact" className="text-orange-300 font-semibold hover:underline text-lg text-center lg:text-left">
      ¡Explora nuestras soluciones y únete a la revolución de la impresión 3D hoy mismo!
    </a>
  </div>
</section>


  
<section className="bg-teal-800 py-12 px-4 sm:px-6 lg:px-8 clienteFeliz">
  <div className="max-w-3xl mx-auto text-left lg:text-left lg:ml-auto lg:mr-[8vw] bg-teal-800 bg-opacity-70 rounded-lg shadow-lg p-5">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-300 mb-8 text-center">
      ¿Cómo Funciona Makers3D?
    </h2>
    <p className="text-lg text-teal-200 mb-8 text-center">
      En Makers3D, nuestro proceso es simple y eficiente para que puedas disfrutar de nuestros productos y servicios sin complicaciones. A continuación te mostramos cómo funciona todo:
    </p>
    <div className="space-y-8">
      <div className="flex items-center space-x-4 bg-orange-300 bg-opacity-60 rounded-lg p-4">
        <div className="w-16 h-16 flex items-center justify-center bg-teal-700 text-white rounded-full shadow-lg text-2xl">
          $
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">Compra</h3>
          <p className="text-teal-200">
            Realiza tu compra en Makers3D seleccionando entre nuestros productos o servicios. Asegúrate de revisar los detalles antes de confirmar tu pedido.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4  bg-orange-300 bg-opacity-60 rounded-lg p-4 rounded-lg ">
        <div className="w-16 h-16 flex items-center justify-center bg-teal-700 text-white rounded-full shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3h-2v7H4v2h7v7h2v-7h7v-2h-7z"></path>
          </svg>
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">Impresión</h3>
          <p className="text-teal-200">
            Una vez realizada la compra, nuestra impresora imprimirá el producto según tus especificaciones. Utilizamos tecnología de punta para garantizar calidad.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4  bg-orange-300 bg-opacity-60 rounded-lg p-4 rounded-lg p-4">
        <div className="w-16 h-16 flex items-center justify-center bg-teal-700 text-white rounded-full shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9 5 9-5v11l-9 5-9-5V7z"></path>
          </svg>
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">Empaque</h3>
          <p className="text-teal-200">
            Después de la impresión, empaquetamos cuidadosamente tu producto para asegurar que llegue en perfectas condiciones.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4  bg-orange-300 bg-opacity-60 rounded-lg p-4 rounded-lg p-4">
        <div className="w-16 h-16 flex items-center justify-center bg-teal-700 text-white rounded-full shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16h-6v-1H4v5h14v-4zM17 9V4h-4v5h-1V4H8v5H7v5h10z"></path>
          </svg>
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">Entrega</h3>
          <p className="text-teal-200">
            Finalmente, tu producto será entregado en la dirección que proporcionaste. Asegúrate de estar disponible para recibirlo.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


        <section className='relative h-auto lg:h-[80vh] w-full flex flex-col lg:flex-row justify-center items-center bg-teal-50 p-6'>
          <div className='relative z-20 text-center lg:text-left lg:w-1/2 space-y-6 p-6 lg:p-10 mt-8 lg:mt-0 bg-teal-100 bg-opacity-70 rounded-lg shadow-lg lg:mr-[20vw]'>
            <h2 className='text-3xl sm:text-4xl font-bold text-teal-800'>¿Eres dueño de una impresora?</h2>
            <h3 className='text-xl sm:text-2xl font-semibold text-teal-600'>¡Únete a nuestra red de impresión!</h3>
            <p className='text-teal-700'>
              Aprovecha la oportunidad de maximizar el uso de tu impresora al formar parte de nuestro exclusivo 
              grupo de impresoras. Al pagar una membresía, formaras parte del pull de impresoras de manera fácil y rápida.
            </p>
            <p className='text-teal-600'>
              No pierdas la oportunidad de convertir tu impresora en una fuente de ingresos. ¡Actúa ahora y únete a 
              nosotros para comenzar a ganar dinero mientras ayudas a otros con sus necesidades de impresión!
            </p>
            <a 
              href="#contact" 
              className='inline-block px-6 py-3 bg-orange-400 hover:bg-orange-600 text-white font-bold rounded-full transition duration-300 ease-in-out'>
              Quiero ser un Maker!
            </a>
          </div>
          
          <div className='relative lg:absolute lg:right-0 lg:top-1/2 lg:w-1/2 lg:-translate-y-1/2 lg:-mt-20'>
            <img src='./printers.png' alt="printer" className='rounded-lg shadow-lg w-full lg:w-3/4 object-cover' />
          </div>
        </section>

      </main>
    </div>
  );
  
}
