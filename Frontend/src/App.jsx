import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage"
import HomePage from './components/HomePage';



function App() {

  return (
    <>

    <Router>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
