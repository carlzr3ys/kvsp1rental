import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Layout from './components/Layout/Layout'

const Main = lazy(()=>import('./pages/Main').then(module => ({default:module.Main})))
const Login = lazy(() => import('./pages/Login').then(module => ({default:module.Login})))

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Layout>
          <Suspense fallback={<h1 className='text-3xl font-bold'>Loading...</h1>}>
            <Routes>

              <Route path='/' element={<Main/>}/>
              <Route path='/login' element={<Login/>}/>

            </Routes>
          </Suspense>
        </Layout>
      </div>
    </HashRouter>
  );
}

export default App;
