import { Context } from "../Context"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Products = () => {

    const { categories } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "KVSP1 FRS | Products"
    },[])

    return (
        <div className="p-4">
            <div>
                <h1 className="text-white text-3xl font-bold">Products</h1>
                <br/>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category,i) => {
                        return (
                            <div key={i} onClick={() => navigate("/category/"+category.value)} className="bg-white text-center p-4 rounded-lg cursor-pointer">
                                <h1 className="text-xl font-bold">{category.label}</h1>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}