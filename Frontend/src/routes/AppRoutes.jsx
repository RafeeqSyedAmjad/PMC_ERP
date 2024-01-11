import { Route, Routes } from "react-router-dom";
import { CustomersPage, DashboardPage, EditCustomerPage, EditProductPage, LoginPage, ProductsPage, QuotationsPage, ServicesPage } from "../page/PageExport";





export const AppRoutes = () => {
    return (
        
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path = '/customers' element = {<CustomersPage/>}/>
            <Route path='/customers/edit/:customerId' element={<EditCustomerPage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path= '/products/edit/:productId' element = {<EditProductPage/>} />
            <Route path='/services' element={<ServicesPage />} />
            <Route path='/quotations' element={<QuotationsPage />} />
          </Routes>
    )
}
