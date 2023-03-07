import { useEffect, useState } from "react"
import { CartItem } from "../components/CartItem"
import Button from "@mui/material/Button"
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export const Cart = () => {

    const [items, setItems] = useState(JSON.parse(localStorage.getItem("items")) || null)

    useEffect(() => {
        document.title = "KVSP1 | Cart"
    },[])

    const checkout = () => {
        console.log("checkout")
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white">Cart</h1>
            {items && items.length > 0 ?
                <div>
                    <br/>
                    {items.map((item,i) => <CartItem key={i} info={item} setItems={setItems}/>)}
                    <br/>
                    <div className="flex justify-end">
                        <Button onClick={() => checkout()} variant="contained" color="success" endIcon={<ShoppingCartCheckoutIcon/>}>
                            Checkout
                        </Button>
                    </div>
                </div>
                
            : <p className="text-gray-400 text-lg">No items in the cart</p>}
        </div>
    )
}