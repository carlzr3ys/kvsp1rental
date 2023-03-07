import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify"
 
export const CartItem = (props) => {

    const { info, setItems } = props;
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(info.quantity || 1)

    const goToProduct = () => {
        navigate("/product/"+info.id)
    }

    const putBack = () => {
        let items = JSON.parse(localStorage.getItem("items"))
        let obji = items.findIndex(item => item.id === info.id)

        if(quantity > 1){
            items.splice(obji,1)
            if(items.length > 0){
                items = [...items,{...info,quantity:quantity-1}]
            }else{
                items = [{...info,quantity:quantity-1}]
            }
            setQuantity(quantity-1)
        }else{
            items.splice(obji,1)
            setItems(items)
            toast.info(`${info.itemName} removed from cart`,{
                autoClose:2500
            })
        }
        localStorage.setItem("items",JSON.stringify(items))
    }
    const addMore = () => {
        let items = JSON.parse(localStorage.getItem("items"))
        let obji = items.findIndex(item => item.id === info.id)

        if(quantity < 10){
            items.splice(obji,1)
            if(items.length > 0){
                items = [...items,{...info,quantity:quantity+1}]
            }else{
                items = [{...info,quantity:quantity+1}]
            }
            setQuantity(quantity+1)
        }else{
            toast.info(`Max quantity for each item is 10`,{
                toastId:"maxQuantity",
                autoClose:2000
            })
        }
        localStorage.setItem("items",JSON.stringify(items))
    }

    return (
        <div className="bg-zinc-400 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-zinc-500">
            <div className="flex items-center">
                <LazyLoadImage
                    style={{maxWidth:"100px"}}
                    src={info.itemImage}
                    alt={info.itemName}
                />
                <p 
                    onMouseOver={e => {
                        e.target.style.color = "Blue";
                        e.target.style.cursor = "pointer"
                        e.target.style.textDecoration = "underline"
                    }}
                    onMouseOut={e => {
                        e.target.style.color = "Black";
                        e.target.style.textDecoration = "none"
                    }}
                    onClick={() => {
                        goToProduct()
                    }}
                    className="ml-2"
                >
                    {info.itemName}
                </p>
            </div>
            <div className="mt-4 sm:mt-0 grid grid-cols-3">
                <button onClick={() => putBack()} className="sm:w-8 text-white text-2xl bg-red-600">-</button>
                <p className="font-bold text-white text-xl text-center">{quantity}</p>
                <button onClick={() => addMore()} className="sm:w-8 text-white text-2xl bg-blue-500">+</button>
            </div>
        </div>
    )
}