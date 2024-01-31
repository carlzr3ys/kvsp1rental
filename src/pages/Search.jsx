import { useParams, useNavigate  } from "react-router-dom"
import { getDocs, collection, orderBy, startAfter, query,limit } from "firebase/firestore"
import { db } from "../firebase"
import { useState, useEffect } from "react"
import { ProductCard } from "../components/ProductCard"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton'

export const Search = () => {

    const { searchQuery } = useParams()
    const [searchResults, setSearchResults] = useState([])
    const [showMore, setShowMore] = useState(true)
    const navigate = useNavigate()
    const [searchText, setSearchText] = useState(searchQuery)

    useEffect(() => {
        getFirstBatch()
        document.title = `KVSP1 FRS | Search | ${searchQuery}`
    },[])

    const getFirstBatch = async() => {
        const firstBatch = query(collection(db,"items"),orderBy("createdAt","desc"),limit(10))
        await getDocs(firstBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                if(snapshot.docs.some(checkRelevance)){
                    setSearchResults([...snapshot.docs.filter(doc => 
                        doc.data().itemName.toLowerCase().includes(searchQuery.toLowerCase())
                    )])
                }else{
                    setShowMore(false)
                }
            }else{
                setShowMore(false)
            }
        })
    }

    const handleViewMore = async() => {
        const nextBatch = query(collection(db,"items"),orderBy("createdAt","desc"),startAfter(searchResults[searchResults.length-1].data().createdAt),limit(10))
        await getDocs(nextBatch)
        .then(snapshot => {
            if(snapshot.size > 0){
                if(snapshot.docs.some(checkRelevance)){
                    setSearchResults([...searchResults,...snapshot.docs.filter(doc => 
                        doc.data().itemName.toLowerCase().includes(searchQuery.toLowerCase())
                    )])
                }else{
                    setShowMore(false)
                }
            }else{
                setShowMore(false)
            }
        })
    }

    const checkRelevance = (item) => {
        return item.data().itemName.toLowerCase().includes(searchQuery.toLowerCase())
    }

    const handleSearch = e => {
        e.preventDefault()
        if(searchText !== "" && searchText.length > 0 && searchText !== searchQuery){
            navigate("/search/"+searchText)
            window.location.reload()
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
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </form>
            </div>
            <br/>
            <h1 className="text-white text-xl font-bold">Search Results for: "{searchQuery}"</h1>
            <br/>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {searchResults.length > 0 ?
                searchResults.map(searchResult => <ProductCard key={searchResult.id} item={searchResult}/>) :
                <h1 className="text-xl font-bold text-center text-white">
                  {showMore ? "Loading..." : "No Results"}
                </h1>}
            </div>
            <br/>
            {showMore && searchResults.length > 0 ?
            <div className="text-center">
                <Button onClick={handleViewMore} variant="contained">Show More</Button>
            </div> : ""}
        </div>
    )
}