import Cubo from "./Cubo";

export default function Nav() {
  return (
      <ul className="
            w-full
            flex
            gap-4
            items-center
            justify-end
            mr-20
            text-2xl
            ">
        <li className="border-2 rounded-lg w-[110px]
            p-2 border-blue-500">
          <a href="/login" className="text-blue-500 hover:text-pink-500 hover:font-semibold hover:underline">Login</a>
        </li> 
        <li className="border-2 rounded-lg w-[110px]
            p-2 border-blue-500
            hover:linear-gradient-to-r from-blue-500 to-blue-700
            "> 
          <a href="/register" className="text-blue-500 hover:text-pink-500 hover:font-semibold hover:underline">Register</a>
        </li>

      </ul>
  );
}