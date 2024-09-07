export default function Card(product){
    return (
        <div className="bg-pink-200 rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <img src={product.image} alt={product.name} />
            <p className="text-xl font-bold">{product.price}</p>
            <p className="text-gray-500">{product.description}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Comprar</button>
        </div>  
    )
}