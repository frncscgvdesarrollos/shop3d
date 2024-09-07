export default function Failure(){
    return(
        <>
        <span>error en el pago la venta se a cancelado</span>
        <button onClick={()=> window.location.href = '/shop'}>cancelar</button>
        </>
    )
}
