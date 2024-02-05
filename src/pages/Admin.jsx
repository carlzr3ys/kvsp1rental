import { useEffect, useState } from "react"
import { storage, db } from "../firebase"
import { ref, listAll, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage'
import { toast } from "react-toastify"
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from "react-router-dom";

export const Admin = () => {

    useEffect(()=>{
        document.title = "KVSP1 FRS | Admin"
    })

    const navigate = useNavigate()
    const [images,setImages] = useState([])
    const listRef = ref(storage,'carouselImages')
    const loggedIn = localStorage.getItem("loggedIn") || false

    useEffect(()=>{

        if(!loggedIn){
            alert("Access Denied")
            navigate("/")
        }

        let temp = []
        listAll(listRef)
        .then(res=>{
            res.items.forEach((itemRef) => {
                getDownloadURL(ref(storage,itemRef.fullPath))
                .then(url => {
                   temp.push({url:url,path:itemRef.fullPath})
                   setImages([...temp])
                })
            });
        })
    },[])

    const imageUpload = async(e) => {
        let temp = [...images]
        if(!e.target.files[0]) return;

        const imageName = `carouselImages/${Date.now()}-${e.target.files[0].name}`; // Use the new image name

        const storageRef = ref(storage, imageName);
        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

        uploadTask.on("state_changed", (snapshot) => {
            // You can use this to show upload progress
        },(err) => {
            toast.error("Image failed to upload: \n"+err)
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                temp.push({url:url,path:uploadTask.snapshot.ref.fullPath})
                setImages([...temp]);
            });
        });
    }

    const deleteImage = (path,url) => {
        let temp = [...images]
        // eslint-disable-next-line no-restricted-globals
        if(confirm("Are you sure you want to delete this image?")){
            const imageRef = ref(storage,path)

            deleteObject(imageRef).then(() => {
                toast.success("Image deleted")
            }).catch((error) => {
                toast.error("Couldn't delete image : \n"+error)
            });

            let newTemp = temp.filter(image => image.path !== path && image.url !== url)
            setImages([...newTemp])
        }
    }

    return (
        <div className='admin p-6'>
            <h1 className="text-2xl mb-4 font-bold text-center">Admin KVSP1 FRS</h1>
            <div className="bg-white p-4 lg:px-6 rounded-md lg:w-[70%] mx-auto flex flex-col gap-4">
                <h2 className="text-xl font-bold">Promo Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {images ? images.map((image,i) => {
                            return (
                                <div onClick={()=>deleteImage(image.path,image.url)} className="image max-w-full grid" key={i}>
                                    <img style={{gridArea:'1/1/2/2'}} src={image.url} alt="" className='w-full h-full'/>
                                    <div className="opacity-0 cursor-pointer flex items-center justify-center text-white" style={{backgroundColor:"rgba(0,0,0,0.7)",gridArea:'1/1/2/2'}}>
                                        <ClearIcon sx={{fontSize:"64px"}}/>
                                    </div>
                                </div>
                            )
                    }):""}
                </div>
                <input id='fileInput' onChange={imageUpload} type="file" name='fileInput' hidden/>
                <label htmlFor="fileInput">
                    <p className="bg-green-500 text-white px-4 py-2 rounded-md w-full text-center cursor-pointer">+ ADD IMAGE</p>
                </label>
            </div>
        </div>
    )
}