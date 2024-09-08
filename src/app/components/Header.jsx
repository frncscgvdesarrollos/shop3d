'use client';
import { useState, useEffect } from "react";
import Cubo from "./Cubo";
import { UserAuth } from "../context/AuthContext";
import { getUser } from "../firebase";
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, googleSignIn, logOut } = UserAuth();
  const router = useRouter();
  const uid = user?.uid;
  const [misdatos, setMisDatos] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (uid) {
        // Obtener datos del cliente
        getUser(uid)
          .then(data => {
            setClientData(data);
            setLoading(false);
            // Redirigir según el estado de los datos del cliente
            if (!data && router.pathname !== '/shop/register') {
              router.push('/shop/register');
            }
          })
          .catch(error => {
            console.error("Error obteniendo datos del usuario:", error);
            if (router.pathname !== '/shop/register') {
              router.push('/shop/register');
            }
          });
      } else {
        if (router.pathname !== '/shop/register') {
          router.push('/shop/register');
        }
        setLoading(false);
      }
    } else {
      // Redirigir a /shop solo si no estás en /shop o subrutas
      const isShopPage = /^\/shop/.test(router.pathname);
      if (!isShopPage && router.pathname !== '/') {
        router.push('/shop');
      }
      setLoading(false);
    }
  }, [user, uid, router]);

  const handleSignIn = () => {
    if (googleSignIn) {
      googleSignIn()
        .then(result => {
          console.log('Sign-in result:', result);
          // Redirigir a /shop si hay un usuario después del inicio de sesión
          if (router.pathname === '/') {
            router.push('/shop');
          }
        })
        .catch((error) => {
          console.error("Error durante el inicio de sesión:", error);
        });
    } else {
      console.error('googleSignIn no está definido o no devuelve una promesa.');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    }
  };

  const handleAdmin = () => {
    router.push('/shop/panelAdmin');
  };

  // No renderizar nada mientras se está cargando
  if (loading) return null;


  return (
    <header className="relative py-2 h-[3rem] text-white flex flex-col lg:flex-row items-end py-8 px-4 lg:px-16 z-[999]">
      <Cubo />

      <div onClick={() => setMisDatos(!misdatos)} className="absolute top-2 right-2 text-xl flex flex-col items-center gap-2 justify-end ">
        <div className="flex items-center gap-2 rounded-lg transition-transform transform hover:scale-105 cursor-pointer">
          {user ? (
            <>
              <span className="text-sm lg:text-lg font-medium text-teal-800">Hola, {user.displayName || "Usuario"}</span>
              <button onClick={handleLogout} className="bg-teal-500 hover:bg-teal-600 text-teal-800 font-semibold py-2 px-2 rounded ml-4 text-sm lg:text-lg">Cerrar Sesión</button>
            </>
          ) : (
            <div>
              <span className="text-white p-2 hidden lg:visible">Inicia sesión para poder comprar</span>
              <button onClick={handleSignIn} className="bg-teal-500 hover:bg-teal-600 text-orange-600 font-semibold py-2 px-4 rounded">
                Login
              </button>
            </div>
          )}
        </div>
        <nav className="w-full flex items-end justify-end lg:justify-center gap-2 bg-teal-900 px-2">
          <a href="/shop/nosotros" className="text-orange-400 hover:text-orange-600 font-semibold text-sm lg:text-lg">Nosotros</a>
          <a href="/shop/printers" className="text-orange-400 hover:text-orange-600 font-semibold text-sm lg:text-lg">Makers</a>
          <a href="/shop/contacto" className="text-orange-400 hover:text-orange-600 font-semibold text-sm lg:text-lg">Diseño</a>
        </nav>
      </div>

      {misdatos && user && clientData && (
        <div className="absolute top-0 right-0 bg-teal-200 text-teal-900 p-6 rounded-lg shadow-lg shadow-gray-600 z-10 w-full lg:w-auto">
          <div className="flex lg:flex-row items-center justify-between mb-4">
            <h6 className="text-xl font-semibold py-4 px-4">Mis datos</h6>
            <button className="bg-teal-500 font-semibold py-2 px-4 rounded flex items-center gap-2">Editar
              <svg className="w-4 h-4 text-white bg-orange-500 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            <button className="bg-teal-500 font-semibold py-2 px-4 rounded ml-4 h-full" onClick={() => setMisDatos(false)}>X</button>
          </div>
          <div className="flex flex-col items-center justify-between gap-2 text-sm">
            <span><strong>Nombre:</strong> {clientData.nombre} {clientData.apellido}</span>
            <span><strong>Teléfono:</strong> {clientData.telefono}</span>
            <span><strong>Dirección:</strong> {clientData.direccion}</span>
            <span><strong>DNI:</strong> {clientData.dni}</span>
            {clientData.role === "admin" && (
              <button className="bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded mt-4" onClick={handleAdmin}>Panel Admin</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
