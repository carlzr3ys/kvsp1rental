import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { db, storage, auth } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'; 
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'


export const AddItem = () => {
    const navigate = useNavigate()
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState('');
    const [newImageName, setNewImageName] = useState('');
    const [imageURL, setImageURL] = useState('');


    // image upload
    const imageUpload = async(e) => {
        if(!e.target.files[0]) return;

        const imageName = `carouselImages/${Date.now()}-${e.target.files[0].name}`; // Use the new image name
        setNewImageName(imageName);

        const storageRef = ref(storage, imageName);
        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

        uploadTask.on("state_changed", (snapshot) => {
            // You can use this to show upload progress
        },(err) => {
            alert("Image failed to upload:\n"+err);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                setImages(prevImages => [...prevImages, { url, name: newImageName }]);
                setImageURL(url);
            });
        });
    }
// delete image
    const deleteImage = async(imageName) => {
        const imageRef = ref(storage, `carouselImages/${imageName}`);
        deleteObject(imageRef).then(() => {
            setImages(prevImages => prevImages.filter(image => image.name !== imageName));
        }).catch((error) => {
            console.error("Error deleting image: ", error);
        });
    }

    const addProduct = async() => {

        if (newImageName.trim() === "" || price.trim() === "" || imageURL.trim() === "")return toast.warn('fill in all fields');


        const docRef = await addDoc(collection(db, "items"),{
            createdAt:serverTimestamp(),
            imageName:newImageName,
            price:price,
            imageURL:imageURL
        })
        .catch(err => toast.error('Failed to add item:\n' + err.message), {autoClose:5000})

        if (docRef){ 
            navigate('/profile/' + auth.currentUser.email)
            toast.success('Image added successfully')

        }
    }

    return (
        <div className='bg-white w-1/2 mx-auto rounded-md mt-3' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <input type="file" onChange={imageUpload} style={{ margin: '20px 0' }} />
            <TextField label='Image Name' variant='filled' value={newImageName} onChange={e => setNewImageName(e.target.value)} />
            <div className='mt-3' style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <TextField label='Price/session' variant='filled' id="price" value={price} onChange={e => setPrice(e.target.value)} />
                
            </div>
            <Carousel>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image.url} alt={`Carousel ${index + 1}`} />
                        <p className="legend">{image.name}</p>
                        <Button variant="contained" color="secondary" onClick={() => deleteImage(image.name)}>Delete</Button>
                    </div>
                ))}
            </Carousel>
            <Button variant='contained' color='primary' onClick={addProduct}>Add</Button>
        </div>
    );
};
