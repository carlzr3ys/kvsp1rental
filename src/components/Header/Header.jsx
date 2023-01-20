import Avatar from "@mui/material/Avatar"
import { useNavigate } from "react-router-dom"

export const Header = () => {

    const navigate = useNavigate()

    return (
        <header className="bg-zinc-400 p-4 shadow-xl flex justify-between items-center">
            <h1 onClick={() => navigate("/")} className="text-2xl font-bold cursor-pointer">KVSP1Koperasi</h1>
            <Avatar onClick={() => navigate("login")} className="cursor-pointer" sx={{ bgcolor: "purple" }}>G</Avatar>
        </header>
    )
}