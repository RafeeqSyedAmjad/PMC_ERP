import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../components/ComponentExport';

function EditCustomerPage() {
    const { customerId } = useParams();

    const [customerDetails, setCustomerDetails] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerVat: '',
        customerMap: '',
        customerType: '',
        contactName: '',
        contactMobile: '',
        contactDesignation: '',
        contactEmail: '',
    });

    useEffect(() => {
        async function fetchCustomerDetails() {
            try {
                const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/customers/${customerId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomerDetails(data);
                } else {
                    throw new Error('Failed to fetch customer details');
                }
            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        }

        fetchCustomerDetails();
    }, [customerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleUpdateCustomer = async () => {
        try {
            const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/customers/${customerId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerDetails),
            });

            if (response.ok) {
                console.log('Customer updated successfully!');
                // Redirect to customer_list.html or handle navigation as needed
            } else {
                throw new Error('Failed to update customer');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    }

    return (
        <div >
            <Navbar />
            <div className="container max-w-md p-6 mx-auto mt-8 bg-white rounded-md shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Edit Customer</h1>
                <form>
                    <div className="mb-4">
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-600">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={customerDetails.customerName}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="customerEmail"
                            name="customerEmail"
                            value={customerDetails.customerEmail}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-600">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="customerPhone"
                            name="customerPhone"
                            value={customerDetails.customerPhone}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-600">
                            Address
                        </label>
                        <input
                            type="text"
                            id="customerAddress"
                            name="customerAddress"
                            value={customerDetails.customerAddress}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customerVat" className="block text-sm font-medium text-gray-600">
                            VAT Number
                        </label>
                        <input
                            type="text"
                            id="customerVat"
                            name="customerVat"
                            value={customerDetails.customerVat}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customerMap" className="block text-sm font-medium text-gray-600">
                            Google Maps
                        </label>
                        <input
                            type="text"
                            id="customerMap"
                            name="customerMap"
                            value={customerDetails.customerMap}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customerType" className="block text-sm font-medium text-gray-600">
                            Customer Type
                        </label>
                        <select
                            id="customerType"
                            name="customerType"
                            value={customerDetails.customerType}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        >
                            <option value="retail">Retail</option>
                            <option value="b2b">B2B</option>
                            <option value="whole_sale">Whole Sale</option>
                            <option value="estimated_landed">Estimated Landed</option>
                            <option value="factory">Factory</option>
                        </select>
                    </div>
                    {/* <div className="mb-4">
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-600">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            id="contactName"
                            name="contactName"
                            value={customerDetails.contactName}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactMobile" className="block text-sm font-medium text-gray-600">
                            Contact Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="contactMobile"
                            name="contactMobile"
                            value={customerDetails.contactMobile}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactDesignation" className="block text-sm font-medium text-gray-600">
                            Contact Designation
                        </label>
                        <input
                            type="text"
                            id="contactDesignation"
                            name="contactDesignation"
                            value={customerDetails.contactDesignation}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-600">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={customerDetails.contactEmail}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div> */}
                    <button
                        type="button"
                        onClick={handleUpdateCustomer}
                        className="w-full px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Update Customer
                    </button>
                </form>
            </div>
        </div>
        
    );
}

export default EditCustomerPage;