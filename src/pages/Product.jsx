import { useParams } from "react-router-dom"
import { auth, db } from "../firebase"
import { onSnapshot, doc } from "firebase/firestore"
import { useEffect, useState, useContext } from "react"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { Context } from "../Context"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export const Product = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(Context)

    const [productInfo, setProductInfo] = useState(null)
    const [ownerInfo, setOwnerInfo] = useState(null)
    let [statusColor, setStatusColor] = useState("green")

    useEffect(() => {
        onSnapshot(doc(db,"items",id),snapshot => {
            if(!snapshot.exists()){
                navigate("/")
                toast.error("Product with ID:'"+id+"' doesn't exist")
            }else{
                setProductInfo({...snapshot.data()})
                if(snapshot.data().itemStatus === "Available"){
                    setStatusColor("green")
                }else if(snapshot.data().itemStatus === "Sold Out"){
                    setStatusColor("red")
                }else{
                    setStatusColor("yellow")
                }
                onSnapshot(doc(db,"admins",snapshot.data().retailerEmail), adminSnapshot => {
                    setOwnerInfo({...adminSnapshot.data()})
                })
            }
        })
    },[])

    const handleOrder = () => {
        navigate("/neworder/"+id)
    }

    return (
        <div className="py-6 flex flex-col items-center">
            {productInfo && ownerInfo ? 
            <div className="p-4 shadow shadow-xl bg-zinc-400 rounded-lg flex flex-col justify-center items-center w-11/12 lg:w-3/5">
                <LazyLoadImage
                    src={productInfo.itemImage}
                    style={{height:"200px"}}
                    alt={productInfo.itemName}
                />
                <h1 className="text-2xl font-bold">{productInfo.itemName}</h1>
                { !user || productInfo.retailerEmail !== auth.currentUser.email ? "":
                <div className="w-full text-center my-3">
                    <Button onClick={() => navigate("/editproduct/"+id)} variant="contained">Edit Product</Button>
                </div>
                }
                <p>by <Link className="underline text-sky-600" to={"/profile/"+productInfo.retailerEmail}>{ownerInfo.Username}</Link></p>
                <p>Category: {productInfo.category}</p>
                <p>Status: <span style={{color:statusColor}}>{productInfo.itemStatus}</span></p>
                <br/>
                <TextField
                    value={productInfo.itemDescription} 
                    fullWidth
                    multiline
                    className="italic w-full bg-transparent cursor-default text-justify"
                    readOnly={true}
                    sx={{
                        '& .MuiInputBase-root':{
                            cursor:"default",
                            border:"none",
                            outline:"none",
                            '& textarea':{
                                cursor:"default",
                                border:"none",
                                fontStyle:"italic"
                            }
                        }
                    }}
                />
                <br/>
                <h1 className="text-3xl font-bold">RM {productInfo.itemPrice}</h1>
                <br/>
                { !user ? 
                <Button
                    onClick={() => handleOrder()}
                    fullWidth
                    color="success"
                    variant="contained"
                    sx={{fontSize:"20px",fontWeight:"bold"}}
                >
                    ORDER
                </Button>:(auth.currentUser.email === productInfo.retailerEmail ? "":
                <Button
                    onClick={() => handleOrder()}
                    fullWidth
                    color="success"
                    variant="contained"
                    sx={{fontSize:"20px",fontWeight:"bold"}}
                >
                    ORDER
                </Button>)}
            </div>
            : <h1 className="text-xl font-bold text-white">Loading...</h1>}

        </div>
    )
}