import { Context } from "../Context"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { auth, storage, db } from '../firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const NewOrder= () => {

    const navigate = useNavigate()
    const { id } = useParams()

    const [nameError, setNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [quantityError, setQuantityError] = useState(false)

    const [orderData,setOrderData] = useState({
        ordererName:"",
        ordererPhone:"",
        quantity:"",
        orderProductId:id,
        orderDescription:"",
    
    })

    const [productInfo,setProductInfo] = useState({
        itemName:"",
        itemImage:"",
        id:""
    })

    const [ownerTelegramUserID, setOwnerTelegramUserID] = useState()

    useEffect(() => {
        onSnapshot(doc(db,"items",id),snapshot => {
            setProductInfo({...snapshot.data(),id:snapshot.id})
            onSnapshot(doc(db,"admins",snapshot.data().retailerEmail), adminSnapshot => {
                setOwnerTelegramUserID(adminSnapshot.data().TelegramUserID)
            })
        })
    },[])


    const handleSubmit = (e) => {
        e.preventDefault()

        if(orderData.ordererName === ""){
            setNameError(true)
            toast.error("You must provide your name",{autoClose:2000})
            return
        }else{
            setNameError(false)
        }

        if(orderData.ordererPhone === "" || /[a-zA-Z]/g.test(orderData.ordererPhone)){
            setPhoneError(true)
            if(orderData.ordererPhone === ""){
                toast.error("You must provide your phone number",{autoClose:2000})

            }else if(/[a-zA-Z]/g.test(orderData.ordererPhone)){
                toast.error("Phone number must be numbers",{autoClose:2000})
            }
            return
        }else{
            setPhoneError(false)
        }

        if(orderData.orderDescription === ""){
            setDescriptionError(true)
            toast.error("You must provide an order description",{autoClose:2000})
            return
        }else{
            setDescriptionError(false)
        }

        if(orderData.quantity === ""){
            setQuantityError(true)
            toast.error("You must set a quantity",{autoClose:2000})
            return
        }else if(parseInt(orderData.quantity) <= 0){
            setQuantityError(true)
            toast.error("Quantity cannot be 0",{autoClose:2000})
            return
        }else{
            setQuantityError(false)
        }

        newOrder()

    }

    const newOrder = async() => {
        const msg = `
        <b>NEW ORDER</b>\n
<b>CUSTOMER INFORMATION</b>
Customer Name: ${orderData.ordererName}
Customer Phone: <a href="tel:${orderData.ordererPhone}">${orderData.ordererPhone}</a>

<b>ORDERED PRODUCT</b>
Product Name: ${productInfo.itemName}
Product Price: RM ${productInfo.itemPrice}
Quantity: ${orderData.quantity}
Product ID: ${productInfo.id}
Product Image: <a href='${productInfo.itemImage}'>Image Link</a>

<b>ORDER DESCRIPTION</b>
${orderData.orderDescription}
        `

        const url = `https://api.telegram.org/bot5838916312:AAG8mXHScIh7o2bVJUvm_sDXYYL6GeUiMgM/sendMessage?chat_id=${ownerTelegramUserID}&text=${encodeURIComponent(msg)}&parse_mode=html`
        fetch(url)
        .catch(err => {
            toast.error("Couldn't send order:\n"+err)
        })
        .then(() => {
            toast.success("Order has been sent")
            navigate("/product/"+id)
        })
    }


    return (
        <div className="flex items-center flex-col ui-page py-5">
            <h1 className="text-3xl font-bold text-white text-center">
                New Order of
                <br/>
                {productInfo.itemName}
            </h1>
            <br/>
            <LazyLoadImage
                src={productInfo.itemImage}
                style={{height:"100px"}}
                alt={productInfo.itemName}
            />
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
                <TextField 
                    onChange={(e) => setOrderData({...orderData,orderDescription:e.target.value})} 
                    value={orderData.orderDescription} 
                    fullWidth
                    multiline 
                    label="Order Description"
                    variant="filled"
                    maxRows={5}
                    className="text-justify"
                    required
                    error={descriptionError}
                    helperText={"When will you pick up the item? What time? What day?"}
                />
                <br/><br/>

                <TextField
                    onChange={(e) => setOrderData({...orderData,quantity:e.target.value})} 
                    value={orderData.quantity} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Order Quantity"
                    variant="filled"
                    helperText="Must be a number"
                    required
                    error={quantityError}
                    type="number"
                />
                <br/><br/>

                
                <Button style={{float:"right"}} type="submit" variant="contained">ORDER</Button>
            </form>
        </div>
        
    )
}