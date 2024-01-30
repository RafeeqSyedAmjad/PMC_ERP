import { useEffect, useState } from "react"
import { Navbar } from "../../components/ComponentExport"
import toast from "react-hot-toast";
import { FaClipboardList } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function DashboardPage() {
  const [dashboardStats, setDashboardStats ] = useState({

    total_customers: 0,
    total_services: 0,
    total_products: 0,
    total_quotations: 0,
  })
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path)
  }

  useEffect(()=> {
    const apiUrl = `https://pmcsaudi-uat.smaftco.com:3083/api/dashboard/stats/`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(stats => {
      setDashboardStats(stats);
    })
    .catch(error => {
      toast.error('Error fetching Dashboard Stats', error);
    })
  },[])


  return (
    <div>
      <Navbar/>
      <div className="container mx-auto mt-14">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center text-black no-underline hover:animate-bounce" onClick={() => navigateTo('/quotations')}>
            <div className="flex flex-col items-center justify-center p-4 space-y-3 bg-[#EEF5FF] rounded-lg shadow-md hover:shadow-lg">
              <div className = "text-4xl" >
                <FaClipboardList />
              </div>   
              <h2 className="text-2xl font-bold">Quotations</h2>
              <span className="text-2xl font-bold  text-[#176B87]">{dashboardStats.total_quotations}</span>
            </div>
          </div>
          <div className="text-center text-black no-underline hover:animate-bounce" onClick={() => navigateTo('/products')}>
            <div className="flex flex-col items-center justify-center p-4 space-y-3 bg-[#EEF5FF] rounded-lg shadow-md hover:shadow-lg">
              <div className="text-4xl" >
                <GiAutoRepair />
              </div> 
              <h2 className="text-2xl font-bold">Products</h2>
              <span className="text-2xl font-bold  text-[#176B87]">{dashboardStats.total_products}</span>
            </div>
          </div>
          <div className="text-center text-black no-underline hover:animate-bounce" onClick={() => navigateTo('/services')}>
            <div className="flex flex-col items-center justify-center p-4 space-y-3 bg-[#EEF5FF] rounded-lg shadow-md hover:shadow-lg">
              <div className="text-4xl" >
                <FaHandshakeSimple /> 
              </div> 
              <h2 className="text-2xl font-bold ">Services</h2>
              <span className="text-2xl font-bold  text-[#176B87]">{dashboardStats.total_services}</span>
            </div>
          </div>
          <div className="text-center text-black no-underline hover:animate-bounce" onClick={() => navigateTo('/customers')}>
            <div className="flex flex-col items-center justify-center p-4 space-y-3 bg-[#EEF5FF] rounded-lg shadow-md hover:shadow-lg">
              <div className="text-4xl" >
                <FaUserTie />
              </div> 
              <h2 className="text-2xl font-bold">Customers</h2>
              <span className="text-2xl font-bold  text-[#176B87]">{dashboardStats.total_customers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default DashboardPage