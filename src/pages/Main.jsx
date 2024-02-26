import React, { useEffect, useState, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db, storage } from '../firebase';
import { toast } from 'react-toastify';
import { ref, listAll, getDownloadURL } from 'firebase/storage'

export const Main = () => {

    document.title = "KVSP1 FRS | Home"

    const listRef = ref(storage,'carouselImages')
    const [images,setImages] = useState([])
    const [dateErr,setDateErr] = useState(false)
    const [canTempah,setCanTempah] = useState(true)

    const loadToastRef = useRef(null)

    let [listOfSesi,setListOfSesi] = useState([
        {text:"Pagi",value:"pagi"},
        {text:"Petang",value:"petang"}
    ])
    let [listOfJenis,setListJenis] = useState([
        {text:"Sewa Padang Bola",value:"padang_bola"},
        {text:"Sewa Keseluruhan Padang",value:"sewa_padang"}
    ])

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
        date:"",
        jenis:"",
        sesi:"",
        tujuan:""
    })
    const defaultInfo = {
        nama:"",
        tel:"",
        desc:"",
        date:"",
        jenis:"",
        sesi:"",
        tujuan:""
    }

    const onDateChange = async(e) => {
        let value = e.target.value
        let querySnapshot = await getDocs(collection(db,'orders'))
        setListJenis([
            {text:"Padang Bola",value:"padang_bola"},
            {text:"Sewa Padang",value:"sewa_padang"}
        ])
        setListOfSesi([
            {text:"Pagi",value:"pagi"},
            {text:"Petang",value:"petang"}
        ])
        setDateErr(false)
        let listOfSesiPlus = []
        querySnapshot.forEach(doc => {
            if(doc.data().date != undefined){
                if(doc.data().date == value){
                    if(doc.data().jenis == "sewa_padang"){
                        return setDateErr(true)
                    }else{
                        listOfSesiPlus.push(doc.data().sesi)
                        setListJenis([{text:"Padang Bola",value:"padang_bola"}])
                        if(doc.data().sesi == "pagi"){
                            setListOfSesi([{text:"Petang",value:"petang"}])
                        }else{
                            setListOfSesi([{text:"Pagi",value:"pagi"}])
                        }
                        if(listOfSesiPlus.includes("pagi") && listOfSesiPlus.includes("petang")){
                            setDateErr(true)
                        }
                    }
                }
            }
        })
        setInfo({...info,date:value})
    }

    const membuatTempahan = async() => {

        setCanTempah(false)

        if(info.nama.trim()===""||info.tel.trim===""||info.desc.trim()===""||info.date===""||info.jenis===""||info.tujuan.trim()===""){
            setCanTempah(true)
            return toast.warn('Fill in all fields')
        }
        if(dateErr){setCanTempah(true);return toast.error("Tarikh ini sudah ditempah")}
        if(Date.now() > new Date(info.date).getTime()){setCanTempah(true);return toast.error("Tarikh ini sudah luput")}
        if(info.jenis==="padang_bola" && info.sesi === ""){setCanTempah(true);return toast.warn('Pilih satu sesi')}

        const docRef = await addDoc(collection(db,'orders'),{
            ...info
        })
        .catch(err => toast.error('Failed to add item:\n' + err.message), {autoClose:5000})
    
        if(docRef){
            const msg = `
        <b>TEMPAHAN BAHARU</b>\n
<b>MAKLUMAT PENYEWA</b>
<b>Nama</b>: ${info.nama}
<b>No.Tel</b>: <a href="tel:${info.tel}">${info.tel}</a>
<b>Maklumat Diri</b>:
${info.desc}

<b>TEMPAHAN</b>
<b>Tarikh</b>: ${info.date}
<b>Jenis</b>: ${info.jenis === "padang_bola" ? "Padang Bola" : "Sewa Padang"}
${info.jenis === "padang_bola" ? `<b>Sesi</b>: ${info.sesi === "pagi" ? "Pagi" : "Petang"}` : `<b>Tujuan</b>: ${info.tujuan}`}
${info.jenis === "padang_bola" ? `<b>Tujuan</b>: ${info.tujuan}` : ``}

`
            const admins = await getDocs(collection(db,"admins"))
            let count = 0
            admins.forEach(admin => {
                const id = admin.data().TelegramUserID
                fetch(`https://api.telegram.org/bot6624374972:AAGIpLwKN6TNlJ3U90vN0gf0cVS3uM9U200/sendMessage?chat_id=${id}&text=${encodeURIComponent(msg)}&parse_mode=html`)
                .then(()=>{
                    ++count
                    if(count === admins.size){
                        toast.done(loadToastRef.current);
                        toast.success("Tempahan sudah dihantar")
                        setCanTempah(true)
                        setInfo({...defaultInfo})
                    }else{
                        let progress = count / admins.size
                        if (loadToastRef.current === null) {
                            loadToastRef.current = toast.info('Sedang membuat tempahan', { progress });
                        } else {
                            toast.update(loadToastRef.current, { progress });
                        }
                    }
                })
            })
        }

    }

    return (
        <div className=" flex-col gap-6">
    <div className='carousel'>
        <Carousel width={"98.9vw"} showThumbs={false} infiniteLoop>
            {images ? images.map((url,i) => {
                return (
                    <div className=' ' key={i}>
                        <img src={url} alt="" className=' h-full'/>
                    </div>
                )
            }):""}
        </Carousel>
        <div className="overlay">
            <p className="text">Selamat Datang Ke KVSP1 Field Reservation System</p>
        </div>
    </div>


        
            <div className="p-6 ">
                <h2 className='text-white font-bold mb-2'>MAKLUMAT PENYEWA</h2>
               
                <TextField sx={{ backgroundColor: 'white', marginBottom: '1rem' }} value={info.nama} onChange={e => setInfo({ ...info, nama: e.target.value })} className='w-full' label='Nama*' variant='filled'/>
                <TextField sx={{ backgroundColor: 'white', marginBottom: '1rem' }} value={info.tel} onChange={e => setInfo({ ...info, tel: e.target.value })} className='w-full' label='No. Telefon*' variant='filled'/>
                <TextField sx={{ backgroundColor: 'white', marginBottom: '1rem' }} value={info.desc} onChange={e => setInfo({ ...info, desc: e.target.value })} minRows={3} multiline className='w-full' label='Maklumat Diri*' variant='filled'/>


                
                <h2 className='text-white font-bold mt-4 mb-2'>TEMPAHAN</h2>
                <div className='text-white first-line:flex flex-col gap-3'>
                    <div>
                        <h2 className='text-white font-bold'>Sewa Padang Bola</h2>
                        <p>
                        <ul className='text-white list-inside'>
                          <li className='text-white' >RM80 / sesi</li>
                          <li  className='text-white'>Sesi Pagi dan Petang</li>
                          <li  className='text-white'>Hanya boleh ditempah pada Jumaat, Sabtu dan hari cuti yang lain sahaja</li>
                          
                        </ul>
                    </p>

                    </div>
                    <br></br>
                    <div>
                        <h2 className='text-white font-bold'>Sewa Keseluruhan Padang</h2>
                        <p>
                        <ul className=' text-white list-inside'>
                          <li  className='text-white'>RM200 - RM300 Harga dikira sehingga tamat program</li>
                          <li  className='text-white'>Hanya boleh ditempah pada Jumaat, Sabtu dan hari cuti yang lain sahaja</li>
                        </ul>
                    </p>
<br></br>
                    </div>
                </div>
                <p className='text-white font-bold'>Tarikh *</p>
                <TextField 
                sx={{ backgroundColor: 'white', marginBottom: 2 }} 
                error={dateErr} 
                helperText={dateErr ? 'Tarikh sudah diambil' : ''} 
                value={info.date} 
                onChange={e => onDateChange(e)} 
                type='date' 
                className='w-full' 
                variant='filled'/>

                <FormControl>
                    <InputLabel id="jenis-label">Jenis *</InputLabel> 
                    <Select
                         style={{ backgroundColor: 'white', width : "25vw"}}
                        className ='text-black mb-4' 
                        label="Jenis"
                        labelId="jenis-label"
                        value={info.jenis} 
                        onChange={e=>setInfo({...info,jenis:e.target.value})}

                    >
                        <br></br>
                        
                        {listOfJenis.map((jenis,i) => 
                            <MenuItem key={i} value={jenis.value}>{jenis.text}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <br></br>
                {info.jenis === "padang_bola" ?
                   <FormControl>
                        <InputLabel id="sesi-label">Sesi</InputLabel> 
                        <Select
                             style={{ backgroundColor: 'white', width : "10vw"}}
                            className='text-black mb-4'
                            label="Sesi"
                            labelId="sesi-label"
                            value={info.sesi}
                            onChange={e=>setInfo({...info,sesi:e.target.value})}
                        >
                            {listOfSesi.map((sesi,i)=>
                                <MenuItem key={i} value={sesi.value}>{sesi.text}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                :""}
                <TextField sx={{ backgroundColor: 'white'}} value={info.tujuan} onChange={e=>setInfo({...info,tujuan:e.target.value})} minRows={3} multiline className='w-full' label='Tujuan' variant='filled'/>
                <div  className='text-center py-4'>
                    <Button disabled={!canTempah} onClick={membuatTempahan} className='w-fit mx-auto' color='primary' variant='contained'>TEMPAH</Button>
                </div>
            </div>
        </div>
    )
}
