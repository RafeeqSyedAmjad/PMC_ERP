import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage"
import DashboardPage from './components/DashboardPage';
import { RecoilRoot } from 'recoil';
import Navbar from './components/Navbar';



function App() {

  return (
    <>
    <RecoilRoot>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        </Router>
    </RecoilRoot>
    
    </>
  )
}

export default App;
