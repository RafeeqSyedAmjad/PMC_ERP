import { Route, Routes } from "react-router-dom";
import { CustomersPage, DashboardPage, LoginPage } from "../page/PageExport";





export const AppRoutes = () => {
    return (
        
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path = '/customers' element = {<CustomersPage/>}/>
          </Routes>
    )
}
