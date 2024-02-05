import { Navbar } from "@/components/ComponentExport";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function AddServicePage() {
  const [serviceDetails, setServiceDetails] = useState({
    type_of_service: '',
    time: '',
    price: '',
  });

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const createService = () => {
    const { type_of_service, time, price } = serviceDetails;

    if (!type_of_service || !time || !price) {
      toast.error('Please fill all the required fields.');
      return;
    }

    const data = {
      type_of_service: type_of_service,
      time: time,
      price: price,
    };

    let storedToken = localStorage.getItem('token');


    // Assuming you have an API endpoint for creating services
    fetch('https://pmcsaudi-uat.smaftco.com:3083/api/services/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,

        // Add any other headers if needed
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        toast.success('Service created successfully!');
        navigate(`/services`);
        console.log('Success:', data);
        // Redirect or perform other actions as needed
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Error creating service. Please try again.');
        // Handle errors, e.g., display an error message
      });
  };

  return (
    <div>
      <Navbar/>
      <div className="container max-w-md p-6 mt-8 rounded-md shadow-xl">

        <h1 className="mb-8 text-3xl font-bold text-center">Create Service</h1>

        <form className="max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="mb-4">
              <label htmlFor="type_of_service" className="block mb-2 text-sm font-medium text-gray-600">
                Type of Service:
              </label>
              <input
                type="text"
                id="type_of_service"
                name="type_of_service"
                value={serviceDetails.type_of_service}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-600">
                Time:
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={serviceDetails.time}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-600">
              Price:
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={serviceDetails.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <button
            className="w-full px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            type="button"
            onClick={createService}
          >
            Create Service
          </button>
        </form>
      </div>
    </div>
    
  );
}

export default AddServicePage;
