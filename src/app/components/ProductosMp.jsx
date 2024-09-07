"use server";
import {MercadoPagoConfig, Preference} from "mercadopago";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({accessToken:`${process.env.NEXT_PUBLIC_ACCESSTOKEN}`});
export default async function ProductosMP({producto}) {
    const {id,nombre,precio} = producto;
    const preference = await new Preference(client).create({
      body: {
      items: [
        {
          id: id,
          title: "IMPRESION 3D SHOP3D" + nombre,
          quantity: 1,
          unit_price: Number(precio),
        },
      ],
      back_urls: {
        success: "https://3000-idx-shop3d-1720792856990.cluster-iesosxm5fzdewqvhlwn5qivgry.cloudworkstations.dev/shop/venta/success",
        failure: "https://3000-idx-shop3d-1720792856990.cluster-iesosxm5fzdewqvhlwn5qivgry.cloudworkstations.dev/shop/venta/error",
        pending: "https://3000-idx-shop3d-1720792856990.cluster-iesosxm5fzdewqvhlwn5qivgry.cloudworkstations.dev/shop/venta/pending",
      },
      auto_return: "approved",
      notification_url: "https://3000-idx-shop3d-1720792856990.cluster-iesosxm5fzdewqvhlwn5qivgry.cloudworkstations.dev/api/ventaMp"
      }
    });

    redirect(preference.init_point);
  return (
    <div>
      <p>productoMP</p>
    </div>
  )
}
