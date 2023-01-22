import { useParams } from "react-router-dom"
import Avatar from '@mui/material/Avatar'
import { db } from "../firebase"
import { onSnapshot, doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const Profile = () => {

    const [profileData, setProfileData] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        onSnapshot(doc(db,"admins",email), snapshot => {
          if(!snapshot.exists()){
            alert("Admin doesn't exist");
            navigate("/")
          }else{
            setProfileData({...snapshot.data()})
          }
        })
      },[])

    const { email } = useParams()

    return(
        <div>
            <h1>Profile</h1>
            {!profileData ?
            "":
            <div>
                <Avatar src={profileData.Image}  sx={{ width: 100, height: 100 }}/>
                <h1>{profileData.Username}</h1>
                <p>{profileData.Phone}</p>
                <p>{email}</p>
            </div>}
        </div>
    )
}