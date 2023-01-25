import { useParams, useNavigate } from "react-router-dom"
import Avatar from '@mui/material/Avatar'
import { db, auth } from "../firebase"
import { onSnapshot, doc, collection, query, where } from "firebase/firestore"
import { useEffect, useState, useContext } from "react"
import { Context } from "../Context"
import Button from '@mui/material/Button'
import { LazyLoadImage } from "react-lazy-load-image-component"
import { ProductCard } from "../components/ProductCard"

export const Profile = () => {

    const [profileData, setProfileData] = useState(null)
    const navigate = useNavigate()
    const { email } = useParams()
    const { user } = useContext(Context)
    let [ownedItems,setOwnedItems] = useState([])

    useEffect(()=>{
        onSnapshot(doc(db,"admins",email), snapshot => {
          if(!snapshot.exists()){
            alert("Admin doesn't exist");
            navigate("/")
          }else{
            setProfileData({...snapshot.data()})
          }
        })

        onSnapshot(query(collection(db,"items"),where("retailerEmail","==",email)), snapshot => {
          setOwnedItems([...snapshot.docs.sort(compareTime)])
        })

    },[])

    const compareTime = (a,b) => {
      if ( a.data().createdAt.toDate().valueOf() > b.data().createdAt.toDate().valueOf() ){
        return -1;
      }
      if ( a.data().createdAt.toDate().valueOf() < b.data().createdAt.toDate().valueOf()){
        return 1;
      }
      return 0;
    }

    return(
        <div className="py-6 flex flex-col justify-center items-center">
            {!profileData ?
            <h1 className="text-2xl font-bold text-white">Loading...</h1>:
            <div className="p-4 shadow shadow-xl bg-zinc-400 rounded-lg flex flex-col justify-center items-center w-11/12 md:w-3/5">
                <Avatar src={profileData.Image}  sx={{ width: 100, height: 100 }}/>
                <h1 className="text-2xl font-bold">{profileData.Username}</h1>
                <p className="text-lg">{profileData.Phone}</p>
                <p className="text-lg">{email}</p>
                {user && auth.currentUser.email === email ? 
                <div>
                  <br/>
                  <Button onClick={() => navigate("/editprofile/"+auth.currentUser.email)} variant="contained">Edit Profile</Button>
                </div>
                : ""}
            </div>}
            <br/>
            {profileData ? <div className="w-11/12 md:w-3/5">
              <hr style={{width:"100%",height:"10px",color:"gray"}}/>
              <br/>
              <h1 className="text-2xl text-center font-bold text-white">Products</h1>
              <br/>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ownedItems.length > 0 ? 
                ownedItems.map(item => <ProductCard key={item.id} item={item}/>) : 
                <h1 className="text-xl font-bold text-center text-white">
                  Not Selling...
                </h1>}
                </div>
            </div> : ""}
            
        </div>
    )
}