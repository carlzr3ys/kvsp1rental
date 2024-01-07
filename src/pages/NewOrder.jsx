import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { db } from '../firebase'
import { onSnapshot, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const NewOrder = () => {

    const navigate = useNavigate()

    const [nameError, setNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [orderData,setOrderData] = useState({
        ordererName:"",
        ordererPhone:"",
    })
    const [items,setItems] = useState(JSON.parse(localStorage.getItem("items")) || null)
    const [quantity,setQuantity] = useState(0)
    const [totalPrice,setTotalPrice] = useState(0)

    const [ownerTelegramUserID, setOwnerTelegramUserID] = useState()

    useEffect(() => {
        let storage  = JSON.parse(localStorage.getItem("items"))
        if(storage.length < 1){
            navigate("/cart")
            toast.error("Can't checkout with no items in the cart!",{toastId:"noItems"})
        }
        onSnapshot(doc(db,"admins","mathaikallkhuzairee@gmail.com"), adminSnapshot => {
            setOwnerTelegramUserID(adminSnapshot.data().TelegramUserID)
        })
    },[])

    useEffect(()=>{

        let tempQuantity = 0
        for(let i=0;i<items.length;i++){
            tempQuantity += items[i].quantity
        }

        let tempTotal = 0
        for(let i=0;i<items.length;i++){
            tempTotal += (items[i].itemPrice*items[i].quantity)
        }

        console.log(tempQuantity, tempTotal)

        setQuantity(tempQuantity)
        setTotalPrice(tempTotal)
    },[items])


    const handleSubmit = (e) => {
        e.preventDefault()

        if(orderData.ordererName === ""){
            setNameError(true)
            toast.error("You must provide your name",{autoClose:2000,toastId:"provideName"})
            return
        }else{
            setNameError(false)
        }

        if(orderData.ordererPhone === "" || /[a-zA-Z]/g.test(orderData.ordererPhone)){
            setPhoneError(true)
            if(orderData.ordererPhone === ""){
                toast.error("You must provide your phone number",{autoClose:2000,toastId:"provideNumber"})

            }else if(/[a-zA-Z]/g.test(orderData.ordererPhone)){
                toast.error("Phone number must be numbers",{autoClose:2000,toastId:"numbersOnly"})
            }
            return
        }else{
            setPhoneError(false)
        }

        newOrder()

    }

    const newOrder = async() => {
        const msg = `
        <b>**NEW ORDER**</b>\n
<b>CUSTOMER INFORMATION</b>
Customer Name: ${orderData.ordererName}
Customer Phone: <a href="tel:${orderData.ordererPhone}">${orderData.ordererPhone}</a>

<b>ORDER INFORMATION</b>
${items.map((item,i) => 
`
<b>ITEM ${i+1}</b>
Item Name: <b>${item.itemName}</b>
Item ID: ${item.id}
Quantity: <b>${item.quantity}</b>
Price per Unit: <b>RM${item.itemPrice}</b>
`
).join("")}

TOTAL PRICE: <b>RM${totalPrice}</b>
        `

        const url = `https://api.telegram.org/bot5838916312:AAG8mXHScIh7o2bVJUvm_sDXYYL6GeUiMgM/sendMessage?chat_id=${ownerTelegramUserID}&text=${encodeURIComponent(msg)}&parse_mode=html`
        fetch(url)
        .catch(err => {
            toast.error("Couldn't send order:\n"+err)
        })
        .then(() => {
            toast.success("Order has been sent")
            navigate("/cart")
            let empty = []
            localStorage.setItem("items",JSON.stringify(empty))

        })
    }

    return (
        <div className="flex items-center flex-col ui-page py-5">
            <br/>
            <form noValidate onSubmit={e => handleSubmit(e)} className="bg-white w-11/12 lg:w-3/5 rounded p-3">
                <h2 className="text-xl font-bold mb-3">Personal Information</h2>
                <TextField 
                    onChange={(e) => setOrderData({...orderData,ordererName:e.target.value})} 
                    value={orderData.ordererName} 
                    fullWidth 
                    label="Your Name"
                    variant="filled"
                    required
                    error={nameError}
                    helperText={
                        nameError?
                        "You must provide your name"
                        :""
                    }
                />
                <br/><br/>

                <TextField
                    onChange={(e) => setOrderData({...orderData,ordererPhone:e.target.value})} 
                    value={orderData.ordererPhone} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Your Phone Number"
                    variant="filled"
                    helperText="Must be numbers | Includes country code"
                    required
                    error={phoneError}
                />
                <br/><br/>

                <h2 className="text-xl font-bold mb-3">Order Information</h2>
                {items && items.length > 0 && items.map((item,i) => {
                    return (
                        <div key={i} className="flex items-center justify-between mb-4 gap-2">
                            <div className="flex items-center gap-2">
                                <LazyLoadImage
                                    style={{maxWidth:"60px"}}
                                    src={item.itemImage}
                                    alt={item.itemName}
                                />
                                <div className="flex flex-col justify-center">
                                    {item.itemName}<br/>
                                    <span className="text-gray-400 text-xs">{item.id}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-col-reverse sm:flex-row">
                                <span>x{item.quantity}</span>
                                <span>RM{(item.itemPrice*item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    )
                })}
                <br/>
                <div className="flex justify-end">
                    <h2 className="text-lg font-bold mb-3">
                        {quantity} Items |
                        RM {totalPrice}
                    </h2>
                </div>
                <br/>
                <Button style={{float:"right"}} type="submit" variant="contained">ORDER</Button>
            </form>
        </div>
        
    )
}