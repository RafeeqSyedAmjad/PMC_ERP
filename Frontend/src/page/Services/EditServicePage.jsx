import  { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../components/ComponentExport';

function EditServicePage() {
    const { serviceId } = useParams();

    const [serviceDetails, setServiceDetails] = useState({
        typeOfService: '',
        time: '',
        price: '',
        // Add other service details as needed
    });

    useEffect(() => {
        async function fetchServiceDetails() {
            try {
                const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/services/${serviceId}/`);
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
    }, [serviceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleUpdateService = async () => {
        try {
            const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/services/${serviceId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceDetails),
            });

            if (response.ok) {
                console.log('Service updated successfully!');
                // Redirect or handle navigation as needed
            } else {
                throw new Error('Failed to update service');
            }
        } catch (error) {
            console.error('Error updating service:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container max-w-md p-6 mx-auto mt-8 bg-white rounded-md shadow-xl">
                <div className="flex justify-end mb-4">
                    <Link to="/customers/add" className="px-4 py-2 text-white bg-green-500 rounded-md">
                        Add Customer
                    </Link>
                </div>
                <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Edit Service</h1>
                <form>
                    <div className="mb-4">
                        <label htmlFor="typeOfService" className="block text-sm font-medium text-gray-600">
                            Type Of Service
                        </label>
                        <input
                            type="text"
                            id="typeOfService"
                            name="typeOfService"
                            value={serviceDetails.type_of_service}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-600">
                            Time
                        </label>
                        <input
                            type="text"
                            id="time"
                            name="time"
                            value={serviceDetails.time}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                            Price
                        </label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={serviceDetails.price}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    {/* Add other service details input fields as needed */}

                    <button
                        type="button"
                        className="w-full p-3 mt-4 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:border-blue-700"
                        onClick={handleUpdateService}
                    >
                        Update Service
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditServicePage;
