import { db } from "../firebase"
import { collection, orderBy, limit, query, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { ProductCard } from "../components/ProductCard"
import { useNavigate } from "react-router-dom"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton'

export const Main = () => {

    const [latestProducts, setLatestProducts] = useState([])
    const [hottestProducts, setHottestProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        getLatest()
        getHottest()
        document.title = "KVSP1 eMart | Home"
    },[])

    const getLatest = async() => {
        await getDocs(query(collection(db,"items"),orderBy("createdAt","desc"),limit(10)))
        .then(snapshot => {
            setLatestProducts([...snapshot.docs])
        })
    }

    const getHottest = async() => {
        await getDocs(query(collection(db,"items"),limit(10)))
        .then(snapshot => {
            setHottestProducts([...snapshot.docs.sort(compareOrders)])
        })
    }

    const compareOrders = (a,b) => {
        if ( a.data().itemOrders > b.data().itemOrders ){
          return -1;
        }
        if ( a.data().itemOrders < b.data().itemOrders){
          return 1;
        }
        return 0;
    }

    const handleSearch = e => {
        e.preventDefault()
        if(searchQuery !== "" || searchQuery.length > 0){
            navigate("/search/"+searchQuery)
        }
    }

    return (
        <div className="p-6">
            <div className="text-center">
                <form onSubmit={e => handleSearch(e)}>
                    <TextField
                        variant="outlined"
                        className="w-full sm:w-3/5 bg-white"
                        InputProps={{
                            startAdornment: 
                                <InputAdornment position="start">
                                    <IconButton type="submit">
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>,
                        }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>
            <br/>
            <div>
                <h1 className="text-white text-3xl font-bold">Latest</h1>
                <br/>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {latestProducts.length > 0 ?
                    latestProducts.map(latestProduct => <ProductCard key={latestProduct.id} item={latestProduct}/>) : 
                    <h1 className="text-xl font-bold text-center text-white">
                        Loading...
                    </h1>}
               </div>
            </div>
            <br/><br/>
            <div>
                <h1 className="text-white text-3xl font-bold">Hottest</h1>
                <br/>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {latestProducts.length > 0 ?
                    hottestProducts.map(hottestProduct => <ProductCard key={hottestProduct.id} item={hottestProduct}/>) : 
                    <h1 className="text-xl font-bold text-center text-white">
                        Loading...
                    </h1>}
               </div>
            </div>
            <br/><br/>
        </div>
    )
}