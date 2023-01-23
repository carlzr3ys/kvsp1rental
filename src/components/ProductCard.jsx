import { LazyLoadImage } from "react-lazy-load-image-component"
import { useNavigate } from "react-router-dom"

export const ProductCard = (props) => {

    const { item } = props
    const navigate = useNavigate()

    return (
        <div 
            className="bg-white rounded-lg cursor-pointer" 
            key={item.id}
            onClick={() => navigate("/product/"+item.id)}
        >
          <div className="flex items-center justify-center overflow-hidden">
            <LazyLoadImage
              className="rounded-t-lg" 
              style={{maxHeight:"200px", transition:".2s ease-in-out"}} 
              src={item.data().itemImage} 
              alt={item.data.itemName}
              onMouseOver={e => {
                e.target.style.transform = "scale(1.2)"
              }}
              onMouseOut={e => {
                e.target.style.transform = "scale(1)"
              }}
            />
          </div>
          <div className="p-3 border-t-2 border-gray-400">
            <p>{item.data().itemName}</p>
            <p>RM {item.data().itemPrice}</p>
          </div>
        </div>
      )
}