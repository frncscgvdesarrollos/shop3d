import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore , collection, addDoc , getDocs, getDoc ,setDoc,  deleteDoc ,query, where, doc , updateDoc, arrayUnion , orderBy, limit ,writeBatch ,arrayRemove, runTransaction, increment } from "firebase/firestore";
import { getStorage , ref,  uploadBytes, getDownloadURL, getBytes  } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
export  const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)


export default app;

export async function agregarComentario(texto, nombre, userId, ventaId) {
  if (!texto || texto.trim() === '') {
    return { success: false, error: 'Comentario inválido. No se puede agregar sin texto.' };
  }

  const listaPalabrasInapropiadas = [
    'tonto', 'idiota', 'estúpido', 'imbécil', 'maldito', 'tarado', 'mierda',
    'pendejo', 'puto', 'cabrón', 'gilipollas', 'chingar', 'hijo de puta',
    'zorra', 'puta', 'caca', 'mocoso', 'concha', 'maricón', 'lesbiana'
  ];
  const listaPalabrasPositivas = [
    'excelente', 'genial', 'fantástico', 'perfecto', 'impresionante', 'maravilloso',
    'increíble', 'brillante', 'formidable', 'magnífico', 'estupendo', 'positivo',
    'admirable', 'asombroso', 'sensacional', 'sorprendente', 'extraordinario',
    'espléndido', 'notable', 'marcado', 'excepcional'
  ];

  const textoComentario = texto.toLowerCase();

  const contienePalabrasInapropiadas = listaPalabrasInapropiadas.some(palabra =>
    textoComentario.includes(palabra)
  );

  const contienePalabrasPositivas = listaPalabrasPositivas.some(palabra =>
    textoComentario.includes(palabra)
  );

  const esPositivo = contienePalabrasPositivas && !contienePalabrasInapropiadas;

  const nuevoComentario = {
    texto,
    fecha: new Date().toISOString(),
    nombre,
    userId,
    ventaId,
    esPositivo
  };

  try {
    const comentarioCollection = collection(db, 'comentarios');
    const docRef = await addDoc(comentarioCollection, nuevoComentario);
    return { success: true, id: docRef.id, esPositivo };
  } catch (error) {
    console.error("Error agregando comentario:", error);
    return { success: false, error: error.message };
  }
}

export async function obtenerComentarios() {
  const comentariosRef = collection(db, 'comentarios');
  const comentariosSnapshot = await getDocs(comentariosRef);
  const comentariosList = comentariosSnapshot.docs.map(doc => doc.data());
  return comentariosList;
}

/*--------------------------------------------------*/
/* USER CRUD */
export async function createUser(user){
    const c = collection(db, 'users');
    const docRef = await addDoc(c, user);
    return docRef.id;
}

export async function getUser(uid) {
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let user = {};
  querySnapshot.forEach((doc) => {
    user = doc.data();
  });
  return user;
}

export async function getUsers(){
  const q = query(collection(db,'users') , where("role","!=", "admin"));
  const querySnapshot = await getDocs(q);
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
}
/*--------------------------------------------------*/
/* PRODUCTOS CRUD */
export async function getProductos(){
  const q = query(collection(db,'products') , where("status","!=", "no disponible"));
  const querySnapshot = await getDocs(q);
  let productos = [];
  querySnapshot.forEach((doc) => {
    productos.push(doc.data());
  });
  return productos;
}
export async function createProduct(producto) {
  const ref = collection(db, 'products');
  
  // Consulta para obtener el documento con el mayor valor en la propiedad 'id'
  const q = query(ref, orderBy('id', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  
  let maxId = 0;
  
  // Si existe al menos un documento, obtiene el valor de la propiedad 'id'
  querySnapshot.forEach((doc) => {
    maxId = doc.data().id;
  });
  
  // Incrementa el mayor ID en 1 y lo asigna al nuevo producto
  producto.id = maxId + 1;
  
  // Agrega el nuevo producto a la colección
  const docRef = await addDoc(ref, producto);
  return docRef.id;
}
export function updateProduct(id, updatedData) {
  const q = query(collection(db, 'products'), where("id", "==", id));
  
  return getDocs(q)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        return updateDoc(docRef, updatedData)
          .then(() => {
            console.log("Product updated successfully");
          });
      } else {
        throw new Error("Product not found");
      }
    })
    .catch((error) => {
      console.error("Error updating product: ", error);
    });
}
export async function deleteProduct(id){
  const q = query(collection(db,'products') , where("id", "==", id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  })
  
}
/*CRUD VENTAS */
export async function getMayorId() {
  const q = query(collection(db, "ventas"), orderBy("id", "desc"));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0];
      return lastDoc.data().id; // Retorna el mayor ID existente
  }
  return 0; // Si no hay documentos, retorna 0
}
export async function createVenta(venta) {
  try {
    const mayorId = await getMayorId();
    const nuevoId = mayorId + 1; // Generar un nuevo ID mayor

    // Agregar el ID al objeto venta
    const ventaConId = { ...venta, id: nuevoId };

    // Crear el registro de la venta en la colección "ventas"
    const c = collection(db, "ventas");
    const docRef = await addDoc(c, ventaConId);

    // Referencia al documento de la impresora
    const impresoraRef = doc(db, "impresoras", "impresora1");

    // Ejecutar una transacción para asegurar la consistencia de los datos
    await runTransaction(db, async (transaction) => {
      const impresoraDoc = await transaction.get(impresoraRef);

      if (!impresoraDoc.exists()) {
        throw new Error("El documento de la impresora no existe");
      }

      const impresoraData = impresoraDoc.data();

      // Asegurarse de que "pedido" sea un array
      const pedidoActual = impresoraData.pedido || [];

      // Sumar el tiempo del producto a la propiedad horasRestantes
      const nuevasHorasRestantes = impresoraData.horasRestantes + venta.producto.tiempo;

      // Agregar el registro de la venta a la propiedad pedido (que es un array)
      const nuevoPedido = [...pedidoActual, ventaConId];

      // Actualizar el documento de la impresora
      transaction.update(impresoraRef, {
        horasRestantes: nuevasHorasRestantes,
        pedido: nuevoPedido,
      });
    });

    return nuevoId; // Retorna el nuevo ID
  } catch (error) {
    console.error("Error creando la venta:", error);
    throw error;
  }
}
export async function updateStatusVenta(idVenta){
  const q = query(collection(db,'ventas') , where("id", "==", idVenta));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    updateDoc(doc.ref, {
      status: "pagoConMp"
    })
  })
  return true;
}
export async function cancelarVenta(idVenta){
  const q = query(collection(db,'ventas') , where("id", "==", idVenta));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    updateDoc(doc.ref, {
      status: "cancelado"
    })
  })
  return true;
}
export async function getVentas(){
  const q = query(collection(db,'ventas'));
  const querySnapshot = await getDocs(q);
  let ventas = [];
  querySnapshot.forEach((doc) => {
    ventas.push(doc.data());
  });
  return ventas;
}

export async function ventaPagoPendiente(uid) {
  try {
    // Buscar ventas pendientes para el cliente dado
    const q = query(
      collection(db, 'ventas'),
      where("cliente.id", "==", uid),
      where("pago", "==", "pendiente"),
      where("totalSumado", "==", false) // Solo selecciona ventas que no hayan sido sumadas aún
    );

    const querySnapshot = await getDocs(q);
    
    // Depurar los resultados de la consulta
    console.log('Consulta de ventas pendientes:', querySnapshot.empty ? 'Vacío' : 'Datos encontrados');

    if (querySnapshot.empty) {
      console.log('No hay ventas pendientes para este cliente o ya fueron sumadas.');
      return null; // No hay ventas pendientes para este cliente o ya fueron sumadas
    }

    // Asumimos que puede haber solo una venta pendiente, por lo que tomamos la primera
    const ventaDoc = querySnapshot.docs[0];
    console.log('Venta encontrada:', ventaDoc.id);
    const ventaId = ventaDoc.id;
    const ventaRef = ventaDoc.ref;
    const ventaData = ventaDoc.data();
    console.log('Datos de la venta:', ventaData);

    // Obtener la referencia y los datos de 'datosClientes'
    const datosClientesRef = doc(db, 'datos', 'datosClientes');
    const datosClientesSnapshot = await getDoc(datosClientesRef);
    const datosClientesData = datosClientesSnapshot.data();
    
    console.log('Datos de clientes:', datosClientesData);

    if (datosClientesData) {
      const newComprasCliente = (datosClientesData.comprasCliente || 0) + 1;
      const newTotalVendido = (Number(datosClientesData.totalVendido) || 0) + (Number(ventaData.producto?.precio) || 0);

      // Actualizar los datos del cliente
      await updateDoc(datosClientesRef, {
        comprasCliente: newComprasCliente,
        totalVendido: newTotalVendido
      });

      // Marcar la venta como sumada y actualizar el estado del pago
      await updateDoc(ventaRef, {
        totalSumado: true,
        pago: 'pagadoMP'
      });

      return ventaId; // Devolver el ID de la venta actualizada
    } else {
      console.log('No se encontraron datos de clientes.');
      return null;
    }

  } catch (error) {
    console.error('Error al actualizar el estado de la venta:', error);
    return null;
  }
}
export async function updateProductoMasVendido(productoId, valor) {
  if (!productoId) {
    console.error("Error: Producto ID no proporcionado");
    return;
  }

  try {
    // Crear referencia a la colección 'products'
    const productosRef = collection(db, "products");

    // Crear la consulta para encontrar el producto con el id en su propiedad
    const q = query(productosRef, where("id", "==", productoId));
    
    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    // Verificar si encontramos algún documento
    if (!querySnapshot.empty) {
      // Obtener el primer documento que coincida con el id
      const productoDoc = querySnapshot.docs[0];
      const productoRef = productoDoc.ref; // Referencia al documento específico

      // Actualizar el campo 'masVendido' del documento
      await updateDoc(productoRef, {
        masVendido: increment(valor)
      });

      console.log(`Producto ${productoId} actualizado. masVendido incrementado en ${valor}.`);
    } else {
      console.error(`No se encontró ningún producto con el ID: ${productoId}.`);
    }
  } catch (error) {
    console.error("Error al actualizar masVendido:", error);
  }
}
export async function finalizarVenta(ventaId) {
  try {
    // Asegúrate de que ventaId sea del tipo esperado
    console.log("ID de venta recibido:", ventaId);

    // Crea una consulta para encontrar el documento con el id correspondiente
    const ventasRef = collection(db, 'ventas');
    const q = query(ventasRef, where('id', '==', ventaId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Venta no encontrada.");
    }

    // Asumimos que solo hay un documento que coincide
    const ventaDoc = querySnapshot.docs[0];
    const ventaData = ventaDoc.data();

    // Obtén la referencia del documento de venta
    const ventaRef = doc(db, 'ventas', ventaDoc.id);

    // Actualiza el estado de la venta
    await updateDoc(ventaRef, {
      status: 'finalizada'
    });

    // Si hay un ID de impresora, actualiza la impresora
    if (ventaData.impresoraId) {
      const impresoraRef = doc(db, 'impresoras', ventaData.impresoraId);
      const impresoraSnapshot = await getDoc(impresoraRef);
      const impresoraData = impresoraSnapshot.data();

      if (impresoraData) {
        const tiempoTotalPedidos = ventaData.producto.tiempo; // Sumar el tiempo del producto a las horas restantes
        const nuevoHorasRestantes = impresoraData.horasRestantes - tiempoTotalPedidos;

        await updateDoc(impresoraRef, {
          horasRestantes: nuevoHorasRestantes
        });

        console.log(`Impresora ${ventaData.impresoraId} actualizada con nuevas horas restantes.`);
      }
    }

    return true; // Indica que la venta fue finalizada con éxito

  } catch (error) {
    console.error("Error finalizando la venta:", error);
    throw error;
  }
}
/*crud impresoras*/
/*crear*/
export async function createImpresora(impresora) {
  const c = collection(db, 'impresoras');
  const querySnapshot = await getDocs(c);

  // Calcular el siguiente ID numérico para la impresora
  let maxId = 0;

  // Recorre todos los documentos en la colección
  querySnapshot.forEach((doc) => {
    // Obtiene los datos del documento
    const data = doc.data();
    // Obtiene el ID numérico del documento
    const id = data.id;

    // Actualiza el ID máximo si se encuentra uno mayor
    if (id > maxId) {
      maxId = id;
    }
  });

  // Asignar el siguiente ID numérico
  const newId = maxId + 1;
  const newImpresoraId = `impresora${newId}`;

  // Crear el nuevo documento de impresora con el id adecuado
  try {
    const docRef = await addDoc(collection(db, 'impresoras'), {
      ...impresora,
      id: newId, // Asigna el ID numérico generado
      volumenImpresion: `${impresora.volumenImpresion.ancho}x${impresora.volumenImpresion.alto}x${impresora.volumenImpresion.profundidad}` // Formato del volumen
    });
    console.log('Impresora creada con ID: ', newImpresoraId);
  } catch (error) {
    console.error('Error al crear la impresora: ', error);
  }
}
/* Actualizar una impresora */
export async function updateImpresora(impresoraId, updatedData) {
  const impresoraRef = doc(db, 'impresoras', impresoraId);
  await updateDoc(impresoraRef, updatedData);
  return impresoraId; // Devuelve el ID de la impresora actualizada
}
/* Eliminar una impresora */
export async function deleteImpresora(impresoraId) {
  const impresoraRef = doc(db, 'impresoras', impresoraId);
  await deleteDoc(impresoraRef);
  return impresoraId; // Devuelve el ID de la impresora eliminada
}
/* Obtener todas las impresoras */
export async function getAllImpresoras() {
  const impresorasCollection = collection(db, 'impresoras');
  const impresorasSnapshot = await getDocs(impresorasCollection);
  const impresorasList = impresorasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return impresorasList;
}

export async function agregarPedido(impresoraId, pedido) {
  try {
    // Obtener la referencia del documento de la impresora
    const impresoraRef = doc(db, 'impresoras', impresoraId);
    const impresoraSnapshot = await getDoc(impresoraRef);

    if (!impresoraSnapshot.exists()) {
      console.error(`No se encontró la impresora con ID ${impresoraId}`);
      return null;
    }

    const impresoraData = impresoraSnapshot.data();
    const { horasRestantes = 0, pedido: pedidosPrevios = [] } = impresoraData || {};

    const tiempoImpresion = pedido.producto.tiempo;

    // Verificar si el pedido ya existe en la impresora
    const pedidoExistente = pedidosPrevios.some(p => p.producto?.id === pedido.producto?.id);

    if (pedidoExistente) {
      console.warn(`El pedido con ID ${pedido.producto.id} ya existe en la impresora.`);
      return null; // Evitar agregar el pedido duplicado
    }

    // Sumar el tiempo de impresión a las horas restantes
    const newHorasRestantes = horasRestantes + tiempoImpresion;

    // Crear el nuevo pedido
    const newPedido = {
      producto: pedido.producto,
      cliente: pedido.cliente,
      tiempo: tiempoImpresion
    };

    // Actualizar el array de pedidos con el nuevo pedido
    const newPedidos = [...pedidosPrevios, newPedido];

    // Actualizar la impresora con los nuevos valores
    await updateDoc(impresoraRef, {
      horasRestantes: newHorasRestantes,
      pedido: newPedidos,
      currentImpresion: pedido.producto.id,
      lastFinalProduct: newPedidos.length ? newPedidos[newPedidos.length - 1].producto.id : null,
    });

    // Actualizar las estadísticas globales del cliente
    const datosClientesRef = doc(db, 'datos', 'datosClientes');
    const datosClientesSnapshot = await getDoc(datosClientesRef);
    const datosClientesData = datosClientesSnapshot.data();

    if (datosClientesData) {
      const newComprasCliente = datosClientesData.comprasCliente + 1;
      const newTotalHorasImpresas = datosClientesData.totalHorasImpresas + tiempoImpresion;
      const newTotalVendido = datosClientesData.totalVendido + (pedido.producto.precio || 0);

      await updateDoc(datosClientesRef, {
        comprasCliente: newComprasCliente,
        totalHorasImpresas: newTotalHorasImpresas,
        totalVendido: newTotalVendido
      });
    } else {
      console.error('No se encontraron datos de clientes.');
    }

    return {
      horasRestantes: newHorasRestantes,
      pedido: newPedidos,
      currentImpresion: pedido.producto.id,
      lastFinalProduct: newPedidos.length ? newPedidos[newPedidos.length - 1].producto.id : null,
    };
  } catch (error) {
    console.error('Error al agregar el pedido:', error);
    return null;
  }
}

export async function iniciarProduccion(impresoraId) {
  // Construir la consulta
  const q = query(collection(db, 'impresoras'), where("id", "==", impresoraId));
  
  // Obtener los documentos que coinciden con la consulta
  const querySnapshot = await getDocs(q);

  // Asegurarse de que la consulta devuelve al menos un documento
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]; // Tomar el primer documento si hay más de uno
    const impresoraData = doc.data();

    // Verifica si `pedido` es un array y tiene elementos
    if (Array.isArray(impresoraData.pedido) && impresoraData.pedido.length > 0) {
      // Tomar el primer pedido en la lista
      const currentPedido = impresoraData.pedido[0];

      // Quitar el pedido de la lista de pedidos
      const newPedidos = impresoraData.pedido.slice(1);

      // Restar las horas del producto en producción de las horas restantes de la impresora
      const tiempoProduccion = currentPedido.producto.tiempo; // Asumiendo que 'tiempo' está dentro del objeto 'producto' en el pedido
      const nuevasHorasRestantes = impresoraData.horasRestantes - tiempoProduccion;

      // Asegurarse de que las horas restantes no sean negativas
      const horasRestantesFinal = nuevasHorasRestantes >= 0 ? nuevasHorasRestantes : 0;

      // Actualizar la impresora con el pedido actual en producción y las horas restantes
      await updateDoc(doc.ref, {
        currentImpresion: currentPedido, // Guardar el objeto completo del pedido
        pedido: newPedidos,
        horasRestantes: horasRestantesFinal, // Actualizar las horas restantes
      });

      return {
        currentImpresion: currentPedido,
        pedido: newPedidos,
        horasRestantes: horasRestantesFinal,
      };
    } else {
      console.error("El array 'pedido' está vacío o no es un array.");
      return null; // Si no hay pedidos o datos, retornar null
    }
  } else {
    console.error("No se encontró ninguna impresora con el ID proporcionado.");
    return null; // Si no se encuentra el documento, retornar null
  }
}
export async function actualizarTotalHorasImpresas(tiempoImpresion) {
  try {
    // Referencia al documento específico de datosClientes
    const docRef = doc(db, 'datos', 'datosClientes');
    
    // Obtener el documento actual
    const docSnapshot = await getDoc(docRef);
  
    if (docSnapshot.exists()) {
      const datosCliente = docSnapshot.data();
      const totalHorasImpresas = datosCliente.totalHorasImpresas || 0; // Aseguramos un valor predeterminado

      // Sumar el tiempo de impresión del pedido al totalHorasImpresas
      const newTotalHorasImpresas = totalHorasImpresas + tiempoImpresion;

      // Actualizar el campo totalHorasImpresas en el documento
      await updateDoc(docRef, {
        totalHorasImpresas: newTotalHorasImpresas,
      });

      console.log('totalHorasImpresas actualizado correctamente.');
    } else {
      console.warn("El documento 'datosClientes' no existe.");
    }
  } catch (error) {
    console.error("Error al actualizar totalHorasImpresas:", error);
  }
}

export async function finalizarPedido(impresoraId) {
  try {
    // Crear una consulta para encontrar el documento de la impresora con el ID especificado
    const q = query(collection(db, 'impresoras'), where('id', '==', impresoraId));
    
    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Tomar el primer documento que coincide (asumimos que solo hay uno)
      const impresoraDoc = querySnapshot.docs[0];
      const impresoraData = impresoraDoc.data();

      if (impresoraData && impresoraData.currentImpresion) {
        const { currentImpresion, horasImprimidas = 0, pedidosTotales = 0 } = impresoraData; // Aseguramos valores predeterminados
        const tiempoImpresion = currentImpresion.producto.tiempo || 0; // Aseguramos un valor predeterminado

        // Actualizamos las horas imprimidas sumando el tiempo del pedido actual
        const newHorasImprimidas = horasImprimidas + tiempoImpresion;

        // Incrementamos el contador de pedidos totales
        const newPedidosTotales = pedidosTotales + 1;

        // Guardar la impresión actual en `lastImpresion` antes de limpiarla
        const lastImpresion = currentImpresion;

        // Limpiar la propiedad `currentImpresion` ya que el pedido ha finalizado
        await updateDoc(impresoraDoc.ref, {
          currentImpresion: {},
          lastImpresion: lastImpresion, // Guardar la impresión anterior
          horasImprimidas: newHorasImprimidas,
          pedidosTotales: newPedidosTotales, // Actualizamos el total de pedidos
        });

        // Actualizar el estatus de la venta a "listo para enviar"
        const ventaId = currentImpresion.id; // Asumimos que el ID de la venta está en `currentImpresion`
        const ventaQuery = query(collection(db, 'ventas'), where('id', '==', ventaId));
        const ventaSnapshot = await getDocs(ventaQuery);

        if (!ventaSnapshot.empty) {
          const ventaRef = ventaSnapshot.docs[0].ref;
          await updateDoc(ventaRef, {
            status: 'listo para enviar',
          });
        } else {
          console.error("No se encontró ninguna venta con el ID proporcionado.");
        }

        // Actualizar totalHorasImpresas en datosCliente
        await actualizarTotalHorasImpresas(tiempoImpresion);

        return {
          currentImpresion: {},
          lastImpresion: lastImpresion,
          horasImprimidas: newHorasImprimidas,
          pedidosTotales: newPedidosTotales,
        };
      } else {
        console.warn('No hay una impresión actual en esta impresora.');
      }
    } else {
      console.error('No se encontró ninguna impresora con el ID proporcionado.');
    }

    return null; // Si no se encuentra la impresora o no hay impresión actual, retornar null
  } catch (error) {
    console.error('Error al finalizar el pedido:', error);
    return null;
  }
}

export async function confirmacionEnvio(codigoEnvio, ventaId) {
  const q = query(collection(db, "ventas"), where("status", "==", "listo para enviar"));
  
  const querySnapshot = await getDocs(q);
  
  // Recorre los documentos que coincidan con la consulta
  querySnapshot.forEach((doc) => {
    if (doc.id === ventaId) {
      updateDoc(doc.ref, {
        status: "enviado",
        codigoEnvio: codigoEnvio,
      });
    }
  });

  return null;
}

export async function getImpresoraByUid(uid) {
  const q = query(collection(db, 'impresoras'), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let impresoras = [];
  querySnapshot.forEach((doc) => {
    impresoras.push({ id: doc.id, ...doc.data() }); // Incluye el id del documento
  });
  return impresoras;
}




/*datos*/

export async function getDatosCliente() {
  try {
    // Referencia al documento específico
    const docRef = doc(db, 'datos', 'datosClientes');
    
    // Obtener el documento
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // Devolver los datos del documento
      return docSnapshot.data();
    } else {
      // Si el documento no existe
      console.warn("El documento 'datosClientes' no existe.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los datos del cliente:", error);
    return null;
  }
}