import { Context } from "../Context"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import LinearProgress from "@mui/material/LinearProgress"
import { auth, storage, db } from '../firebase'
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const categories = [
    {value:"Basic",label:"Basic"},
    {value:"Stationery",label:"Stationery"}
]

const statuses = [
    {value:"Available",label:"Available"},
    {value:"Sold Out",label:"Sold Out"},
    {value:"Coming Soon",label:"Coming Soon"}
]

export const EditProduct = () => {

    const { user } = useContext(Context)
    const navigate = useNavigate()
    const { id } = useParams()

    const [nameError, setNameError] = useState(false)
    const [priceError, setPriceError] = useState(false)

    const [itemData,setItemData] = useState({
        itemStatus:"Available",
        itemName:"",
        itemDescription:"",
        itemImage:"",
        itemPrice:"",
        category:"Basic",
    })

    const [uploadProgress, setUploadProgress] = useState(null);
    const [showDelete, setShowDelete] = useState(false)

    useEffect(()=>{
        if(!user){
            navigate("/")
        }
        document.title = `KVSP1 FRS | Edit Product | ${id}`
        onSnapshot(doc(db,"items",id),snapshot => {
            const data = snapshot.data()
            setItemData({
                itemStatus:data.itemStatus,
                itemName:data.itemName,
                itemDescription:data.itemDescription,
                itemImage:data.itemImage,
                itemPrice:data.itemPrice,
                category:data.category
            })
        })
    },[user])

    const handleSubmit = async(e) => {
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

        editProduct()

    }

    const editProduct = async() => {
        await setDoc(doc(db,"items",id),{
            ...itemData,
            itemDescription:itemData.itemDescription?itemData.itemDescription:"No description",
            itemImage:itemData.itemImage?itemData.itemImage:"https://via.placeholder.com/320x320?text=No+Image"
        },{merge:true})
        .then(()=>{
            navigate("/product/"+id)
            toast.success("Product Updated",{autoClose:2000})
        })
        .catch(err => {
            toast.error("Failed to edit product:\n"+err,{autoClose:5000})
        })
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

    const handleDelete = () => {
        setShowDelete(true)
    }
    const closeDelete = () => {
        setShowDelete(false)
    }

    const deleteProduct = async() => {
        await deleteDoc(doc(db,"items",id))
        .then(() => {
            toast.success("Product deleted successfully",{autoClose:2000})
        })
        .catch(err => {
            toast.error("Product couldn't be deleted:\n"+err)
        })
        navigate("/profile/"+auth.currentUser.email)
    }

    return (
        <div className="flex items-center flex-col ui-page py-5">
            <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            <br/>
            <form noValidate onSubmit={e => handleSubmit(e)} className="bg-white w-11/12 lg:w-3/5 rounded p-3">
                <TextField 
                    onChange={(e) => setItemData({...itemData,itemName:e.target.value})} 
                    value={itemData.itemName} 
                    fullWidth 
                    label="Product Name"
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
                    label="Product Description"
                    variant="filled"
                    maxRows={5}
                    className="text-justify"
                />
                <br/><br/>

                <TextField
                    onChange={(e) => setItemData({...itemData,itemPrice:e.target.value})} 
                    value={itemData.itemPrice} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Product Price"
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

                <TextField 
                    fullWidth 
                    label="Status"
                    variant="filled"
                    required
                    select
                    onChange={(e)=>setItemData({...itemData,itemStatus:e.target.value})}
                    value={itemData.itemStatus}
                >
                    {statuses.map((option) => {
                        return (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        )
                    })}
                </TextField>
                <br/><br/>

                <h1>Product Image: <br/> (Recommended: 300px x 300px)</h1>
                <br/>
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
                <Button onClick={() => handleDelete()} style={{float:"left"}} color="error" variant="contained">DELETE</Button>
                <Dialog
                    open={showDelete}
                    onClose={closeDelete}
                >
                    <DialogTitle>
                    {"Delete Product?"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Product will be deleted permanently.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={closeDelete}>No</Button>
                    <Button variant="contained" color="error" onClick={() => deleteProduct()} autoFocus>
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>
                <Button style={{float:"right"}} type="submit" variant="contained">EDIT</Button>
            </form>
        </div>
        
    )
}