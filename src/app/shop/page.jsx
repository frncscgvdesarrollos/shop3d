import { Montserrat } from 'next/font/google';
import ListProductsCliente from "../components/ListProductsCliente";

// Configura la fuente
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});


export default function Shop3d() {
  return (
    <div className="lg:-mt-[5rem]  min-h-screen flex flex-col text-white grid grid-cols-1  ">
      <main className=" col-span-4 mx-auto w-full flex flex-col h-[100%] top-4">
        <ListProductsCliente />
      </main>
    </div>
  );
}
