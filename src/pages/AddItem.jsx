import { Context } from "../Context"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

const categories = [
    {value:"Basic",label:"Basic"},
    {value:"Stationery",label:"Stationery"}
]

export const AddItem = () => {

    const { user } = useContext(Context)
    const navigate = useNavigate()

    const [nameError, setNameError] = useState(false)
    const [priceError, setPriceError] = useState(false)
    const [categoryError, setCategoryError] = useState(false)

    const [itemData,setItemData] = useState({
        itemName:"",
        itemDescription:"",
        itemImage:"",
        itemPrice:"",
        category:"Basic"
    })



    useEffect(()=>{
        if(!user){
            navigate("/")
        }
    },[user])

    const addItem = (e) => {
        e.preventDefault()
        console.log(itemData)

        if(itemData.itemName == ""){

        }
    }

    return (
        <div className="flex items-center flex-col ui-page py-5">
            <h1 className="text-3xl font-bold text-white">Add Item</h1>
            <br/>
            <form noValidate onSubmit={e => addItem(e)} className="bg-white w-11/12 lg:w-3/5 rounded p-3">
                <TextField 
                    onChange={(e) => setItemData({...itemData,itemName:e.target.value})} 
                    value={itemData.itemName} 
                    fullWidth 
                    label="Item Name"
                    variant="filled"
                    required
                    error={nameError}
                    helperText={
                        nameError?
                        "Item must have a name"
                        :""
                    }
                />
                <br/><br/>
                <TextField 
                    onChange={(e) => setItemData({...itemData,itemDescription:e.target.value})} 
                    value={itemData.itemDescription} 
                    fullWidth
                    multiline 
                    label="Item Description"
                    variant="filled"
                    maxRows={5}
                />
                <br/><br/>
                <TextField
                    onChange={(e) => setItemData({...itemData,itemPrice:e.target.value})} 
                    value={itemData.itemPrice} 
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    label="Item Price"
                    variant="filled"
                    helperText="Must be a number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">RM</InputAdornment>,
                    }}
                    required
                    error={priceError}
                />
                <br/><br/>
                <TextField 
                    fullWidth 
                    label="Category"
                    variant="filled"
                    required
                    select
                    onChange={(e)=>setItemData({...itemData,category:e.target.value})}
                    value={itemData.category}
                    error={categoryError}
                >
                    {categories.map((option) => {
                        return (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        )
                    })}
                </TextField>
                <br/><br/>
                <Button style={{float:"right"}} type="submit" variant="contained">ADD</Button>
            </form>
        </div>
    )
}