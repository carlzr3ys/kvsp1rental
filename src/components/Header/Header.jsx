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
import { toast } from "react-toastify"
import { onSnapshot, doc } from "firebase/firestore"
import List from "@mui/material/List"

export const Header = () => {

    const navigate = useNavigate()
    const { user, loading } = useContext(Context)
    const [profileData, setProfileData] = useState({})

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

    return (
        <div>
            <header className="bg-zinc-400 p-4 shadow-xl flex justify-between items-center">
                <h1 onClick={() => navigate("/")} className="text-2xl font-bold cursor-pointer">KVSP1 E-Mart</h1>
                <div className="flex items-center border">
                    <div className="mr-5">
                        Home
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
        </div>
    )
}