import { lazy, Suspense, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Layout from './components/Layout/Layout'
import { Context } from './Context';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from './firebase';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { Loader } from './components/Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Main = lazy(()=>import('./pages/Main').then(module => ({default:module.Main})))
const AddItem = lazy(() => import('./pages/AddItem').then(module => ({default:module.AddItem})))
const Profile = lazy(() => import('./pages/Profile').then(module => ({default:module.Profile})))
const EditProfile = lazy(() => import('./pages/EditProfile').then(module => ({default:module.EditProfile})))
const Product = lazy(() => import('./pages/Product').then(module => ({default:module.Product})))
const EditProduct = lazy(() => import('./pages/EditProduct').then(module => ({default:module.EditProduct})))
const NewOrder = lazy(() => import('./pages/NewOrder').then(module => ({default:module.NewOrder})))
const Category = lazy(() => import("./pages/Category").then(module => ({default:module.Category})))
const Search = lazy(() => import('./pages/Search').then(module => ({default:module.Search})))

function App() {

  const [user,loading] = useAuthState(auth)
  const categories = [
    {value:"Basic",label:"Basic"},
    {value:"Stationery",label:"Stationery"}
  ]

  const memo = useMemo(() => ({user:user,loading:loading,categories:categories}),[user,loading])

  useEffect(()=>{
    if(!user)return;

    onSnapshot(doc(db,"admins",auth.currentUser.email), snapshot => {
      if(!snapshot.exists()){
        toast.error("Admin doesn't exist");
        auth.signOut()
      }else{
        checkUserProperties(snapshot.data())
      }
    })
  },[user])

  useEffect(()=>{
    if(loading){
      toast.info("Initializing User...",{
        autoClose:1250,
        pauseOnHover:false,
        toastId:"initialUser"
      })
    }
  },[loading])

  const checkUserProperties = async(data) => {
    let dataToInsert = {}
    if(!data.hasOwnProperty("Username")){
      dataToInsert = {...dataToInsert,"Username":auth.currentUser.displayName}
    }
    if(!data.hasOwnProperty("Image")){
      dataToInsert = {...dataToInsert,"Image":auth.currentUser.photoURL}
    }
    await setDoc(doc(db,"admins",auth.currentUser.email),dataToInsert,{merge:true})
  }

  return (
    <HashRouter>
      <div className="App">
        <Context.Provider value ={memo}>
          <Layout>
            <Suspense fallback={<Loader/>}>
              <Routes>

                <Route path='/' element={<Main/>}/>
                <Route path='/additem' element={<AddItem/>}/>
                <Route path='/profile/:email' element={<Profile/>}/>
                <Route path="/editprofile/:email" element={<EditProfile/>}/>
                <Route path="/product/:id" element={<Product/>}/>
                <Route path="/editproduct/:id" element={<EditProduct/>}/>
                <Route path="/neworder/:id" element={<NewOrder/>}/>
                <Route path="/category/:category" element={<Category/>}/>
                <Route path="/search/:searchQuery" element={<Search/>}/>

              </Routes>
              <ToastContainer
              position="bottom-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            </Suspense>
          </Layout>
        </Context.Provider>
      </div>
    </HashRouter>
  );
}

export default App;
