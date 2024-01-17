import { Route, Routes, useLocation } from "react-router-dom";
import { AddQuotationPage, CustomersPage, DashboardPage, EditCustomerPage, EditProductPage, EditServicePage, LoginPage, ProductsPage, QuotationsPage, ServicesPage, ViewCustomerPage, ViewProductPage, ViewServicePage } from "../page/PageExport";
import { useEffect } from "react";





export const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // Set the document title based on the current route
    document.title = `PMC - ${location.pathname.replace('/', '')}`;
  }, [location.pathname]);
    return (
        
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path = '/customers' element = {<CustomersPage/>}/>
            <Route path='/customers/edit/:customerId' element={<EditCustomerPage />} />
            <Route path= '/customers/view/:customerId' element={<ViewCustomerPage/>} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path= '/products/edit/:productId' element = {<EditProductPage/>} />
            <Route path = 'products/view/:productId' element = {<ViewProductPage/>} />
            <Route path='/services' element={<ServicesPage />} />
            <Route path = 'services/edit/:serviceId' element = {<EditServicePage/>}/>
            <Route path="services/view/:serviceId" element={<ViewServicePage/>}/>
            <Route path='/quotations' element={<QuotationsPage />} />
            <Route path = '/quotations/add' element = {<AddQuotationPage/>}/>
            {/* <Route path = '/quotations/preview/:quotationId' element={<PreviewQuotationPage/>}/> */}
          </Routes>
    )
}
