import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Navbar } from "../../components/ComponentExport";



function ViewServicePage() {
    const {serviceId} = useParams();
    const navigate = useNavigate();
    const [serviceDetails,setServiceDetails] = useState({
        id:'',
        type:'',
        time:'',
        price:'',
    })
    let storedToken = localStorage.getItem('token');


    useEffect(() => {
        async function fetchServiceDetails() {
            try {
                const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/services/${serviceId}/`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`, // Include Bearer token in Headers
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setServiceDetails(data);
                } else {
                    throw new Error('Failed to fetch service details');
                }
            } catch (error) {
                console.error('Error fetching service details:', error);
            }
        }

        fetchServiceDetails();
    }, [serviceId, storedToken]);

  return (
    <div>
        <Navbar/>

        <div className = "container p-6 mx-auto mt-8 bg-white rounded-md shadow-xl">
            <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Service Details</h1>
            {serviceDetails.id && (
                <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {renderField("Service ID", serviceDetails.id)}
                      {renderField("Type of Service", serviceDetails.type_of_service)}
                      {renderField("Time", serviceDetails.time)}
                      {renderField("Price", serviceDetails.price)}
                      {/* Back button */}
                      <button
                          type="button"
                          onClick={() => navigate('/services')}
                          className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 md:col-span-2"
                      >
                          Back
                      </button>

                </form>

            )}

        </div>
    </div>
  );

  
    //Helper Function for rendering fields
    function renderField(label,value){
        return(
            <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">{label}</label>
                    <div className="readonly-field">{value}</div>
            </div>
        );
    }
  
}

export default ViewServicePage