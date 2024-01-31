import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { addDoc, collection } from 'firebase/firestore'
import { db, storage } from '../firebase';
import { toast } from 'react-toastify';
import { ref, listAll, getDownloadURL, list } from 'firebase/storage'

export const Main = () => {

    document.title = "KVSP1 FRS | Home"

    const listRef = ref(storage,'carouselImages')
    const [images,setImages] = useState([])

    useEffect(()=>{
        let temp = []
        listAll(listRef)
        .then(res=>{
            res.items.forEach((itemRef) => {
                getDownloadURL(ref(storage,itemRef.fullPath))
                .then(url => {
                   temp.push(url)
                   setImages([...temp])
                })
            });
        })
    },[])

    const [info,setInfo] = useState({
        nama:"",
        tel:"",
        desc:"",
        jenis:"",
        sesi:"",
        tujuan:""
    })
    const defaultInfo = {
        nama:"",
        tel:"",
        desc:"",
        jenis:"",
        sesi:"",
        tujuan:""
    }

    const membuatTempahan = async() => {

        if(info.nama.trim()===""||info.tel.trim===""||info.desc.trim()===""||info.jenis===""||info.tujuan.trim()===""){
            return toast.warn('Fill in all fields')
        }
        if(info.jenis==="padang_bola" && info.sesi === "")return toast.warn('Pilih satu sesi')

        const docRef = await addDoc(collection(db,'orders'),{
            ...info
        })
        .catch(err => toast.error('Failed to add item:\n' + err.message), {autoClose:5000})
    
        if(docRef){
            toast.success("Tempahan sudah dihantar")
            setInfo({...defaultInfo})
        }
    }

    return (
        <div className="p-6 flex flex-col gap-6">
            <Carousel>
                {images && images.map((url,i) => {
                    return (
                        <div key={i}>
                            <img src={url} alt=""/>
                            <p className="legend">Image {i+1}</p>
                        </div>
                    )
                })}
            </Carousel>
            <h1 className='text-center font-bold text-2xl'>PADANG KOLEJ VOKASIONAL SUNGAI PETANI 1</h1>
            <div className='bg-white p-4 lg:px-6 rounded-md lg:w-[70%] mx-auto flex flex-col gap-4'>
                <h2 className='font-bold mb-2'>MAKLUMAT PENYEWA</h2>
                <TextField value={info.nama} onChange={e=>setInfo({...info,nama:e.target.value})} className='w-full' label='Nama' variant='filled'/>
                <TextField value={info.tel} onChange={e=>setInfo({...info,tel:e.target.value})} className='w-full' label='No. Telefon' variant='filled'/>
                <TextField value={info.desc} onChange={e=>setInfo({...info,desc:e.target.value})} minRows={3} multiline className='w-full' label='Maklumat Diri' variant='filled'/>
                
                <h2 className='font-bold mt-4 mb-2'>TEMPAHAN</h2>
                <div className='flex flex-col gap-3'>
                    <div>
                        <h2 className='font-bold'>Padang Bola</h2>
                        <p>
                            Harga sewa adalah RM80 setiap sesi, dan pilihan sesi terdiri daripada pagi dan petang. 
                            Sesi ini boleh dinikmati pada hari Jumaat, Sabtu, dan juga pada hari-hari cuti yang lain.                   
                        </p>
                    </div>
                    
                    <div>
                        <h2 className='font-bold'>Sewa Padang</h2>
                        <p>
                            Bagi yang ingin menyewa padang untuk pelbagai acara atau aktiviti sukan, kami menawarkan 
                            Harga sewa antara RM200 hingga RM300 sehingga tamat program tersebut. 
                        </p>
                    </div>
                </div>
                <FormControl>
                    <InputLabel id="jenis-label">Jenis</InputLabel> 
                    <Select
                        className='text-black'
                        label="Jenis"
                        labelId="jenis-label"
                        value={info.jenis} 
                        onChange={e=>setInfo({...info,jenis:e.target.value})}
                    >
                        <MenuItem value="padang_bola">Padang Bola</MenuItem>
                        <MenuItem value="sewa_padang">Sewa Padang</MenuItem>
                    </Select>
                </FormControl>
                {info.jenis === "padang_bola" ?
                    <FormControl>
                        <InputLabel id="sesi-label">Sesi</InputLabel> 
                        <Select
                            className='text-black'
                            label="Sesi"
                            labelId="sesi-label"
                            value={info.sesi}
                            onChange={e=>setInfo({...info,sesi:e.target.value})}
                        >
                            <MenuItem value="pagi">Pagi</MenuItem>
                            <MenuItem value="petang">Petang</MenuItem>
                        </Select>
                    </FormControl>
                :""}
                <TextField value={info.tujuan} onChange={e=>setInfo({...info,tujuan:e.target.value})} minRows={3} multiline className='w-full' label='Tujuan' variant='filled'/>
                <div className='text-center py-4'>
                    <Button onClick={membuatTempahan} className='w-fit mx-auto' color='primary' variant='contained'>TEMPAH</Button>
                </div>
            </div>
        </div>
    )
}
