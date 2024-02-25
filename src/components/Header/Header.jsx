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
    <div>
        <header className="sticky top-0 left-0 right-0 bg-opacity-40 p-4 shadow-xl flex justify-between items-center z-10">
            <h1 onClick={() => navigate("/")} className="text-2xl font-bold cursor-pointer">KVSP1 Field Reservation</h1>
            {loggedIn ? <button onClick={logout} className="px-4 py-2 text-white rounded-md bg-red-500">Log out</button> : null}
        </header>
        {/* Content */}


        
                {/*<div className="flex items-center">
                    <div className="hidden sm:block">
                        <List row>
                            <ListItem title="Home">
                                <ListItemButton onClick={() => navigate("/")}>
                                    <HomeIcon/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </div>
                    <div className="block sm:hidden">
                        <IconButton onClick={() => openMobileMenu()}>
                            <MenuIcon/>
                        </IconButton>
                    </div>
                {!loading ? (user ?
                    <Avatar onClick={!loading ? profileHandleClick : ()=>{return}} alt="profile picture" src={profileData.Image} className="cursor-pointer"/>
                    :<Avatar onClick={!loading ? guestHandleClick : ()=>{return}} className="cursor-pointer" sx={{ bgcolor: "gray" }}/>
                    ) 
                    : <Avatar sx={{ bgcolor: "gray" }}>...</Avatar>}
                    <Menu
                        id="guest-menu"
                        anchorEl={guestAnchorEl}
                        open={guestOpen}
                        onClose={guestHandleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => {guestHandleClose(); signin()}}>
                            <ListItemIcon><LoginIcon fontSize="small"/></ListItemIcon>
                            Admin Login
                        </MenuItem>
                    </Menu>
                    <Menu
                        id="profile-menu"
                        anchorEl={profileAnchorEl}
                        open={profileOpen}
                        onClose={profileHandleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => {profileHandleClose(); navigate("/profile/"+auth.currentUser.email)}}>
                            <ListItemIcon>
                                <AccountBoxIcon fontSize="small"/>
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => {profileHandleClose(); navigate("/additem")}}>
                            <ListItemIcon>
                                <AddIcon fontSize="small"/>
                            </ListItemIcon>
                            Add Product
                        </MenuItem>
                        <MenuItem onClick={() => {profileHandleClose(); signout()}}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small"/>
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </header>
            <div 
                className="w-screen h-screen fixed top-0 bg-slate-400 transition-all z-10 p-6"
                style={{left:menuPosition}}
            >
                <IconButton className="float-right" onClick={() => closeMobileMenu()}>
                    <CloseIcon fontSize="medium"/>
                </IconButton>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => {navigate("/"); closeMobileMenu()}}>
                            <span className="text-2xl">Home</span>
                        </ListItemButton>
                    </ListItem>
                    <ListDivider/>
                    <ListItem>
                        <ListItemButton onClick={() => {navigate("/products"); closeMobileMenu()}}>
                            <span className="text-2xl">Products</span>
                        </ListItemButton>
                    </ListItem>
                    <ListDivider/>
                    <ListItem>
                        <ListItemButton onClick={() => {navigate("/cart"); closeMobileMenu()}}>
                            <span className="text-2xl">Cart</span>
                        </ListItemButton>
                    </ListItem>
                </List>
                    </div>-->*/}
        </div>
    )
}