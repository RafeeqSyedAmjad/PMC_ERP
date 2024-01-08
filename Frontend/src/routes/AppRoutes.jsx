import { Route, Routes } from "react-router-dom"
import { DashboardPage, LoginPage } from "../page/PageExport"




export const AppRoutes = () => {
    return (
        
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
    )
}
