import { useParams } from "react-router-dom"
import { db } from "../firebase"
import { getDocs, collection, where, orderBy, limit, startAfter, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { ProductCard } from "../components/ProductCard"
import Button from '@mui/material/Button'

export const Category = () => {

    const { category } = useParams()
    const [categoryProducts, setCategoryProducts] = useState([])
    const [showMore, setShowMore] = useState(true)

    useEffect(() => {
        getFirstBatch()
    },[])

    const getFirstBatch = async() => {
        const firstBatchQuery = query(collection(db,"items"),orderBy("createdAt","desc"),where("category","==",category),limit(10))
        await getDocs(firstBatchQuery)
        .then(snapshot => {
            if(snapshot.size > 0){
                setCategoryProducts([...snapshot.docs])
            }else{
                setShowMore(false)
            }
        })
    }

    const handleViewMore = async() => {
        const nextBatchQuery = query(collection(db,"items"),orderBy("createdAt","desc"),where("category","==",category),startAfter(categoryProducts[categoryProducts.length-1].data().createdAt),limit(10))
        await getDocs(nextBatchQuery)
        .then(snapshot => {
            if(snapshot.size > 0){
                setCategoryProducts([...categoryProducts,...snapshot.docs])
            }else{
                setShowMore(false)
            }
        })
    }

    return (
        <div className="p-6">
            <h1 className="text-white text-3xl font-bold">Category: {category}</h1>
            <br/>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {categoryProducts.length > 0 ?
                categoryProducts.map(categoryProduct => <ProductCard key={categoryProduct.id} item={categoryProduct}/>) :
                <h1 className="text-xl font-bold text-center text-white">
                  Not Selling...
                </h1>}
            </div>
            <br/>
            {showMore ?
            <div className="text-center">
                <Button onClick={handleViewMore} variant="contained">SHOW MORE</Button>
            </div> : ""}
        </div>
    )
}