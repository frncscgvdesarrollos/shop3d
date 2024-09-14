'use client'
export default function QuieroSerUnMaker() {
  
  
  function handleRegister(){
   window.localStorage.href="/shop/makers/registerPrinter";
  }
    return (
      <div className="p-8 bg-gray-50 text-gray-900 pt-20 lg:pt-8 makerfondo">
        {/* Contenedor principal con ancho máximo */}
        <div className="max-w-3xl mx-auto">
          {/* Descripción de ser un Maker */}
          <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-5xl font-bold mb-8 text-center text-teal-600">¿Qué significa ser un Maker?</h1>
            <div className="flex justify-center mb-10">
              <img src="/printers.png" alt="makers!" className="w-full max-w-4xl object-cover rounded-lg" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ser un Maker en nuestra comunidad te permite usar tus impresoras 3D para fabricar productos que ya han sido pedidos por nuestros clientes.
              Te encargas de imprimir, empaquetar y enviar los productos a través de Andreani, mientras nosotros gestionamos los pagos y la logística.
            </p>
          </section>
  
          {/* Proceso para ser un Maker */}
          <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-4xl font-semibold mb-6 text-teal-500">¿Cómo funciona el proceso?</h2>
            <ol className="list-decimal list-inside text-lg space-y-4 pl-4 text-gray-700 leading-relaxed">
              <li>Registra tu impresora 3D con sus especificaciones (modelo, tamaño de impresión, materiales compatibles, etc.).</li>
              <li>Recibe automáticamente los pedidos que los clientes han realizado en nuestro catálogo.</li>
              <li>Imprime los productos solicitados y empaquétalos con cuidado.</li>
              <li>Envía los productos al cliente a través de Andreani.</li>
              <li>Una vez que el cliente confirma la recepción, recibirás el pago.</li>
            </ol>
          </section>
  
          {/* Registro de impresoras */}
          <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-4xl font-semibold mb-6 text-teal-500">Registro de impresoras</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Antes de comenzar a recibir pedidos, debes registrar tu impresora con la siguiente información:
            </p>
            <ul className="list-disc list-inside text-lg space-y-2 pl-4 text-gray-700 leading-relaxed">
              <li>Marca y modelo de la impresora 3D</li>
              <li>Tamaño máximo de impresión</li>
              <li>Materiales compatibles (PLA, ABS, PETG, etc.)</li>
            </ul>
            <p className="text-lg mt-4 text-gray-700 leading-relaxed">
              Esto nos ayuda a asignarte pedidos acorde a la capacidad de tu impresora.
            </p>
          </section>
  
          {/* Detalles de la suscripción */}
          <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-4xl font-semibold mb-6 text-teal-500">¿Cuánto cuesta unirte?</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Para unirte a nuestra comunidad de Makers, deberás pagar una suscripción mensual de <strong>$50 USD</strong> a través de <strong>Mercado Pago</strong>.
              Esto te permitirá recibir pedidos directamente y empezar a imprimir productos de nuestro catálogo.
            </p>
          </section>
  
          {/* Botón de suscripción */}
          <div className="text-center mb-[60vh] lg:mb-[20vh]">
            <button onClick={() => handleRegister()} className="bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-bold shadow-md hover:bg-teal-600 transition duration-300">
              ¡Regístrate como Maker ahora!
            </button>
          </div>
        </div>
      </div>
    );
  }
  