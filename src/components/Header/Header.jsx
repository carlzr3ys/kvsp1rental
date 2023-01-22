import Avatar from "@mui/material/Avatar"
import { useNavigate } from "react-router-dom"
import { Context } from "../../Context"
import { useContext, useState } from "react"
import { auth, provider } from "../../firebase"
import { signInWithPopup } from "firebase/auth"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon  from '@mui/material/ListItemIcon';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify"

export const Header = () => {

    const navigate = useNavigate()
    const { user, loading } = useContext(Context)

    const signin = () => {
        signInWithPopup(auth,provider)
        .catch(err => toast.error("Failed to sign in:\n"+err))
    }

    const signout = () => {
        auth.signOut()
        navigate("/")
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
        <header className="bg-zinc-400 p-4 shadow-xl flex justify-between items-center">
            <h1 onClick={() => navigate("/")} className="text-2xl font-bold cursor-pointer">KVSP1Koperasi</h1>
           {user ?
            <Avatar onClick={!loading ? profileHandleClick : ()=>{return}} alt="profile picture" src={auth.currentUser.photoURL} className="cursor-pointer"/>
            :<Avatar onClick={!loading ? guestHandleClick : ()=>{return}} className="cursor-pointer" sx={{ bgcolor: "purple" }}>G</Avatar>
            }
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
                    Add Item
                </MenuItem>
                <MenuItem onClick={() => {profileHandleClose(); signout()}}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </header>
    )
}