import { Route, Routes } from "react-router-dom";
import { CustomersPage, DashboardPage, EditCustomerPage, EditProductPage, EditServicePage, LoginPage, ProductsPage, QuotationsPage, ServicesPage, ViewCustomerPage } from "../page/PageExport";





export const AppRoutes = () => {
    return (
        
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path = '/customers' element = {<CustomersPage/>}/>
            <Route path='/customers/edit/:customerId' element={<EditCustomerPage />} />
            <Route path= '/customers/view/:customerId' element={<ViewCustomerPage/>} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path= '/products/edit/:productId' element = {<EditProductPage/>} />
            <Route path='/services' element={<ServicesPage />} />
            <Route path = 'services/edit/:serviceId' element = {<EditServicePage/>}/>
            <Route path='/quotations' element={<QuotationsPage />} />
          </Routes>
    )
}
