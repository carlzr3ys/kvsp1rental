import { useContext, useEffect, useState } from "react"
import { Context } from "../Context"
import { useNavigate, useParams } from "react-router-dom"
import { auth, db, storage } from "../firebase"
import { toast } from "react-toastify"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { onSnapshot, doc, setDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'

export const EditProfile = () => {

    const { user } = useContext(Context)
    const navigate = useNavigate()
    const { email } = useParams()

    const [uploadProgress, setUploadProgress] = useState(null);

    const [profileData, setProfileData] = useState({
        Username:"",
        Image:"",
        Phone:""
    })

    const [formErrors, setFormErrors] = useState({
        usernameError:false,
        phoneError:false
    })

    const [usernameError,setUsernameError] = useState(false)
    const [phoneError,setPhoneError] = useState(false)

    useEffect(()=>{
        if(user){
            onSnapshot(doc(db,"admins",auth.currentUser.email), snapshot => {
                if(!snapshot.exists()){
                  alert("Admin doesn't exist");
                  navigate("/")
                }else{
                  setProfileData({...snapshot.data()})
                }
            })
        }
        document.title = `KVSP1 FRS | Edit Profile | ${email}`
      },[email])

    useEffect(()=>{
        if(!user){
            navigate("/")
        }else{
            if(auth.currentUser.email !== email){
                navigate("/")
            }
        }
    },[user])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(profileData.Username === ""){
            setUsernameError(true)
            toast.error("Admin must have a name",{autoClose:2000})
            return
        }else{
            setUsernameError(false)
        }

        if(profileData.Phone === "" || /[a-zA-Z]/g.test(profileData.Phone)){
            setPhoneError(true)
            if(profileData.Phone === ""){
                toast.error("Set a phone number",{autoClose:2000})

            }else if(/[a-zA-Z]/g.test(profileData.Phone)){
                toast.error("Phone Number must be numbers",{autoClose:2000})
            }
            return
        }else{
            setPhoneError(false)
        }

        editProfile()
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
            setProfileData({...profileData, Image:"https://via.placeholder.com/320x320?text=No+Image"})
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                setProfileData({...profileData, Image:url})
            })
        })
    }

    const resetImage = () => {
        setProfileData({...profileData,Image:auth.currentUser.photoURL})
    }

    const editProfile = async() => {
        await setDoc(doc(db,"admins",email),profileData,{merge:true})
        .then(() => {
            navigate("/profile/"+email)
            toast.success("Profile Updated",{autoClose:2000})
        })
        .catch(err => toast.error("Profile Update Failed:\n"+err,{autoClose:5000}))
    }

    return (
        <div className="flex items-center flex-col ui-page py-5">
            <h1 className="text-3xl font-bold text-black">Edit Profile</h1>
            <br/>
            <form noValidate onSubmit={e => handleSubmit(e)} className="bg-white w-11/12 lg:w-3/5 rounded p-3">
                <TextField 
                    onChange={(e) => setProfileData({...profileData,Username:e.target.value})} 
                    value={profileData.Username} 
                    fullWidth 
                    label="Username"
                    variant="filled"
                    required
                    error={usernameError}
                    helperText={
                        usernameError ?
                        "Admin must have a name"
                        :""
                    }
                />
                <br/><br/>

                <TextField
                    onChange={(e) => setProfileData({...profileData,Phone:e.target.value})} 
                    value={profileData.Phone} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Phone Number"
                    variant="filled"
                    helperText="Must be numbers | Includes country code"
                    required
                    error={phoneError}
                />
                <br/><br/>

                <h1>Profile Picture:</h1>
                <input type="file" accept="image/*" 
                    onChange={(e) => imageUpload(e)}
                />
                <br/><br/>
                {uploadProgress && uploadProgress != 100?
                    <div className="text-center">
                        <LinearProgress className="mx-auto" id="videoUploadProgressBar" variant="determinate" value={uploadProgress}/>
                        <p id="videoUploadPercentage">{uploadProgress}%</p>
                        <br/>
                    </div>
                : ""}
                <div>
                    <Avatar
                        className="border border-black mx-auto"
                        sx={{width:100, height:100}}
                        src={profileData.Image === "" ? "https://via.placeholder.com/100x100?text=No+Image" : profileData.Image}
                    />
                </div>
                <br/>
                {profileData.Image === "" || profileData.Image === auth.currentUser.photoURL?
                "" : <div className="flex items-center justify-center"><Button onClick={resetImage} className="mx-auto" variant="contained" color="error">Reset Image</Button><br/><br/></div>}
                <Button style={{float:"right"}} type="submit" variant="contained">SAVE</Button>
            </form>
        </div>
    )
}