import { Context } from "../Context"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import LinearProgress from "@mui/material/LinearProgress"
import { auth, storage, db } from '../firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const NewOrder= () => {

    const navigate = useNavigate()
    const { id } = useParams()

    const [nameError, setNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)

    const [orderData,setOrderData] = useState({
        ordererName:"",
        ordererPhone:"",
        quantity:"",
        orderProductId:"",
        orderDescription:"",
    
    })

    const [productInfo,setProductInfo] = useState({
        itemName:"",
        itemImage:""
    })

    useEffect(() => {
        onSnapshot(doc(db,"items",id),snapshot => {
            setProductInfo({...snapshot.data()})
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

        addItem()

    }

    const addItem = async() => {
        console.log("LOL")
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
                    onChange={(e) => setOrderData({...orderData,orderDescription:e.target.value})} 
                    value={orderData.orderDescription} 
                    fullWidth
                    multiline 
                    label="Order Description"
                    variant="filled"
                    maxRows={5}
                    className="text-justify"
                />
                <br/><br/>

                <TextField
                    onChange={(e) => setOrderData({...orderData,itemPrice:e.target.value})} 
                    value={orderData.itemPrice} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Your Phone Number"
                    variant="filled"
                    helperText="Must be numbers"
                    required
                    error={phoneError}
                />
                <br/><br/>
                <Button style={{float:"right"}} type="submit" variant="contained">ADD</Button>
            </form>
        </div>
        
    )
}