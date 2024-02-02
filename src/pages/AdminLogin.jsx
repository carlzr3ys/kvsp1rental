import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"

export const AdminLogin = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        document.title = "KVSP1 FRS | Login"

        let loggedIn = localStorage.getItem("loggedIn")
        if(loggedIn){
            return navigate('/admin')
        }
    },[])

    const [loginCreds,setLoginCreds] = useState({
        username:"",
        password:""
    })

    const login = async() => {
        let { username, password } = loginCreds
        if(username.trim() === "" || password.trim() === "")return toast.error("Fill in all fields")

        let count = 0;        
        let querySnapshot = await getDocs(collection(db,'admins'))
        querySnapshot.forEach(doc => {
            if(username === doc.data().Username){
                if(password === doc.data().password){
                    localStorage.setItem('loggedIn',true)
                    navigate('/admin')
                    return toast.success('Logged in as Admin')
                }
            }
            count++;
        })

        if(count == querySnapshot.size){
            return toast.error("Login failed")
        }
    }

    return (
        <div className="p-6 flex flex-col gap-3 items-center justify-center">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>Username: </td>
                            <td><input onChange={e => setLoginCreds({...loginCreds,username:e.target.value})} className="p-2 outline-none" type="text" /></td>
                        </tr>
                        <tr>
                            <td>Password: </td>
                            <td><input onChange={e => setLoginCreds({...loginCreds,password:e.target.value})} className="p-2 outline-none" type="password" /></td>
                        </tr>
                    </tbody>
                </table>
            <button onClick={login} className="self-end px-4 py-2 rounded-md text-white bg-sky-600">Login</button>
            </div>
        </div>
    )
}