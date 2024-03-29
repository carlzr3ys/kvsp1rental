import Avatar from "@mui/material/Avatar"
import { useNavigate } from "react-router-dom"
import { Context } from "../../Context"
import { useContext, useState, useEffect } from "react"
import { auth, db, provider } from "../../firebase"
import { signInWithPopup } from "firebase/auth"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon  from '@mui/material/ListItemIcon';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import { onSnapshot, doc } from "firebase/firestore";
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Logo from "./logokvsp1frs.jpg";
export const Header = () => {

    const navigate = useNavigate()
    const { user, loading } = useContext(Context)
    const [profileData, setProfileData] = useState({})
    const [menuPosition, setMenuPosition] = useState("-100vw")
    const [loggedIn,setLoggedIn] = useState()

    useEffect(()=>{
        setLoggedIn(localStorage.getItem('loggedIn') || false)
    })

    useEffect(()=>{
        if(!user)return

        onSnapshot(doc(db,"admins",auth.currentUser.email), snapshot => {
            setProfileData({...snapshot.data()})
        })
    },[user])

    const signin = () => {
        signInWithPopup(auth,provider)
        .then(() => navigate("/profile/"+auth.currentUser.email))
        .catch(err => toast.error("Failed to sign in:\n"+err))
    }

    const signout = () => {
        auth.signOut()
    }

    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [guestAnchorEl, setGuestAnchorEl] = useState(null);
    const profileOpen = Boolean(profileAnchorEl);
    const guestOpen = Boolean(guestAnchorEl);
    const profileHandleClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };
    const profileHandleClose = () => {
        setProfileAnchorEl(null);
    };
    const guestHandleClick = (event) => {
        setGuestAnchorEl(event.currentTarget);
    };
    const guestHandleClose = () => {
        setGuestAnchorEl(null);
    };

    const openMobileMenu = () => {
        setMenuPosition("0")
    }

    const closeMobileMenu = () => {
        setMenuPosition("-100vw")
    }

    const logout = () => {
        localStorage.clear()
        navigate('/')
    }

    return (

        <div className="sticky top-0 z-20">
        <header className="sticky top-0 left-0 right-0 bg-opacity-40 p-7 py-10 shadow-xl flex justify-between items-center">
            <div className="flex items-center logo-container"> 
                <img src={Logo} alt="Logo" className='logo'/>
                <h1 onClick={() => navigate("/")} className="text-white text-2xl font-bold cursor-pointer ml-2 mt-0 mb-0">FRS</h1>
            </div>
            {loggedIn ? <button onClick={logout} className="px-4 py-2 text-white rounded-md bg-red-500">Log out</button> : null}
        </header>
    
    
        
    
      
        </div>
    )
}