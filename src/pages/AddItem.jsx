import { Context } from "../Context"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import LinearProgress from "@mui/material/LinearProgress"
import { auth, storage, db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const categories = [
    {value:"Basic",label:"Basic"},
    {value:"Stationery",label:"Stationery"}
]

export const AddItem = () => {

    const { user } = useContext(Context)
    const navigate = useNavigate()

    const [nameError, setNameError] = useState(false)
    const [priceError, setPriceError] = useState(false)

    const [itemData,setItemData] = useState({
        itemName:"",
        itemDescription:"",
        itemImage:"",
        itemPrice:"",
        category:"Basic",
        retailerEmail:user ? auth.currentUser.email : ""
    })

    const [uploadProgress, setUploadProgress] = useState(null);

    useEffect(()=>{
        if(!user){
            navigate("/")
        }
    },[user])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(itemData.itemName == ""){
            setNameError(true)
            toast.error("Item must have a name",{autoClose:2000})
            return
        }else{
            setNameError(false)
        }

        if(itemData.itemPrice === "" || /[a-zA-Z]/g.test(itemData.itemPrice)){
            setPriceError(true)
            if(itemData.itemPrice === ""){
                toast.error("Set an item price",{autoClose:2000})

            }else if(/[a-zA-Z]/g.test(itemData.itemPrice)){
                toast.error("Item price must be a number",{autoClose:2000})
            }
            return
        }else{
            setPriceError(false)
        }

        addItem()

    }

    const addItem = async() => {
        const docRef = await addDoc(collection(db,"items"),itemData)
        navigate("/")
        toast.success("Item added with ID: "+docRef.id)
    }

    const imageUpload = async(e) => {
        if(!e.target.files[0])return;

        const storageRef = ref(storage,`/kvsp1koperasi/${auth.currentUser.email}Images/${e.target.files[0].name}`);
        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);

        },(err) => {
            alert("Image failed to upload:\n"+err)

        }, () => {
            setItemData({...itemData, itemImage:"https://via.placeholder.com/320x320?text=No+Image"})
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                setItemData({...itemData, itemImage:url})
            })
        })
    }

    const resetImage = () => {
        setItemData({...itemData,itemImage:""})
    }

    return (
        <div className="flex items-center flex-col ui-page py-5">
            <h1 className="text-3xl font-bold text-white">Add Item</h1>
            <br/>
            <form noValidate onSubmit={e => handleSubmit(e)} className="bg-white w-11/12 lg:w-3/5 rounded p-3">
                <TextField 
                    onChange={(e) => setItemData({...itemData,itemName:e.target.value})} 
                    value={itemData.itemName} 
                    fullWidth 
                    label="Item Name"
                    variant="filled"
                    required
                    error={nameError}
                    helperText={
                        nameError?
                        "Item must have a name"
                        :""
                    }
                />
                <br/><br/>

                <TextField 
                    onChange={(e) => setItemData({...itemData,itemDescription:e.target.value})} 
                    value={itemData.itemDescription} 
                    fullWidth
                    multiline 
                    label="Item Description"
                    variant="filled"
                    maxRows={5}
                />
                <br/><br/>

                <TextField
                    onChange={(e) => setItemData({...itemData,itemPrice:e.target.value})} 
                    value={itemData.itemPrice} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Item Price"
                    variant="filled"
                    helperText="Must be a number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">RM</InputAdornment>,
                    }}
                    required
                    error={priceError}
                />
                <br/><br/>

                <TextField 
                    fullWidth 
                    label="Category"
                    variant="filled"
                    required
                    select
                    onChange={(e)=>setItemData({...itemData,category:e.target.value})}
                    value={itemData.category}
                >
                    {categories.map((option) => {
                        return (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        )
                    })}
                </TextField>
                <br/><br/>

                <h1>Item Image:</h1>
                <input type="file" accept="image/*" 
                    onChange={(e) => imageUpload(e)}
                />
                <br/><br/>
                {uploadProgress && uploadProgress != 100?
                        <div className="text-center">
                            <LinearProgress className="mx-auto" id="videoUploadProgressBar" variant="determinate" value={uploadProgress}/>
                            <p id="videoUploadPercentage">{uploadProgress}%</p>
                        </div>
                : ""}
                <br/>
                <div className="flex flex-col justify-center items-center">
                    <img 
                        style={{maxHeight:"280px",maxWidth:"280px"}} 
                        className="border border-black" 
                        alt="" 
                        id="thumbPreview" 
                        src={itemData.itemImage === "" ? "https://via.placeholder.com/320x320?text=No+Image" : itemData.itemImage}
                    />
                    <br/>
                    {itemData.itemImage === "" ?
                    "" : <Button onClick={resetImage} className="mx-auto" variant="contained" color="error">Reset Image</Button>}
                </div>
                <br/><br/>
                <Button style={{float:"right"}} type="submit" variant="contained">ADD</Button>
            </form>
        </div>
        
    )
}