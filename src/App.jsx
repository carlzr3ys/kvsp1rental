import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Layout from './components/Layout/Layout'
import { Context } from './Context';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from './firebase';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';

const Main = lazy(()=>import('./pages/Main').then(module => ({default:module.Main})))
const AddItem = lazy(() => import('./pages/AddItem').then(module => ({default:module.AddItem})))

function App() {

  const [user] = useAuthState(auth)

  useEffect(()=>{
    if(!user)return;

    onSnapshot(doc(db,"admins",auth.currentUser.email), snapshot => {
      if(!snapshot.exists()){
        alert("Admin doesn't exist");
        auth.signOut()
      }else{
        checkUserProperties(snapshot.data())
      }
    })
  },[user])

  const checkUserProperties = async(data) => {
    let dataToInsert = {}
    if(!data.hasOwnProperty("Name")){
      dataToInsert = {...dataToInsert,"Name":auth.currentUser.displayName}
    }
    if(!data.hasOwnProperty("Image")){
      dataToInsert = {...dataToInsert,"Image":auth.currentUser.photoURL}
    }
    await setDoc(doc(db,"admins",auth.currentUser.email),dataToInsert,{merge:true})
  }

  return (
    <HashRouter>
      <div className="App">
        <Context.Provider value ={{user}}>
          <Layout>
            <Suspense fallback={<h1 className='text-3xl font-bold'>Loading...</h1>}>
              <Routes>

                <Route path='/' element={<Main/>}/>
                <Route path='/additem' element={<AddItem/>}/>

              </Routes>
            </Suspense>
          </Layout>
        </Context.Provider>
      </div>
    </HashRouter>
  );
}

export default App;
