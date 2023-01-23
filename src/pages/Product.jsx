import { useParams } from "react-router-dom"
import { auth, db } from "../firebase"
import { onSnapshot, doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"

export const Product = () => {

    const { id } = useParams()
    const navigate = useNavigate()
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
                    setStatusColor("darkorange")
                }
                onSnapshot(doc(db,"admins",snapshot.data().retailerEmail), adminSnapshot => {
                    setOwnerInfo({...adminSnapshot.data()})
                })
            }
        })
    },[])

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
                <p>by <Link className="underline text-sky-600" to={"/profile/"+productInfo.retailerEmail}>{ownerInfo.Username}</Link></p>
                <p>Category: {productInfo.category}</p>
                <p>Status: <span style={{color:statusColor}}>{productInfo.itemStatus}</span></p>
                <br/>
                <textarea 
                    rows={5} 
                    className="italic w-full bg-transparent cursor-default text-justify"
                    style={{resize:"none",outline:"none"}}
                    readOnly
                    value={productInfo.itemDescription}
                />
                <br/>
                <h1 className="text-3xl font-bold">RM {productInfo.itemPrice}</h1>
            </div>
            : <h1 className="text-xl font-bold text-white">Loading...</h1>}
        </div>
    )
}