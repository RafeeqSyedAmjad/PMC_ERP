import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../../components/ComponentExport';
import toast from 'react-hot-toast';

function EditCustomerPage() {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [customerDetails, setCustomerDetails] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerVat: '',
        customerMap: '',
        customerType: '',
        customerArea: '',
        customerCity: '',
        customerStreet: '',
        customerZip: '',
        contacts: [],
    });

    useEffect(() => {
        async function fetchCustomerDetails() {
            try {
                const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/customers/${customerId}/`);
                if (response.ok) {
                    const data = await response.json();
                    // Set an initial value for customerType only if it is null or empty
                    setCustomerDetails((prevDetails) => ({
                        ...prevDetails,
                        ...data,
                        customerType: prevDetails.customerType || 'retail', // or any default value
                    }));

                    console.log('customerDetails', customerDetails);
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

    const handleContactChange = (index, e) => {
        const { name, value } = e.target;
        setCustomerDetails((prevDetails) => {
            const updatedContacts = [...prevDetails.contacts];
            updatedContacts[index] = {
                ...updatedContacts[index],
                [name]: value,
            };
            return {
                ...prevDetails,
                contacts: updatedContacts,
            };
        });
    };

    

    const handleUpdateCustomer = async () => {
        try {
            console.log('Updating customer with data:', JSON.stringify(customerDetails));
            const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/customers/${customerId}/`,{           
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerDetails),
            })

            console.log('Response from the server:', response);

            if (response.ok || response.status === 204) {
                toast.success('Customer Updated created successfully!');
                navigate(`/customers`);
                
            } else {
                
                toast.error('Error updating customer. Please try again.');
                
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Error updating customer. Please try again.');

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

                    
                    <div className="mb-4">
                        <label htmlFor="contacts" className="block text-sm font-medium text-gray-600">
                            Contacts
                        </label>
                        {customerDetails.contacts.map((contact, index) => (
                            <div key={index} className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label htmlFor={`contacts[${index}].contactName`} className="block text-sm font-medium text-gray-600">
                                        Contact Name
                                    </label>
                                    <input
                                        type="text"
                                        name={`contacts[${index}].contactName`}
                                        value={contact.contactName}
                                        onChange={(e) => handleContactChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`contacts[${index}].contactDesignation`} className="block text-sm font-medium text-gray-600">
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        name={`contacts[${index}].contactDesignation`}
                                        value={contact.contactDesignation}
                                        onChange={(e) => handleContactChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`contacts[${index}].contactMobile`} className="block text-sm font-medium text-gray-600">
                                        Mobile
                                    </label>
                                    <input
                                        type="text"
                                        name={`contacts[${index}].contactMobile`}
                                        value={contact.contactMobile}
                                        onChange={(e) => handleContactChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`contacts[${index}].contactEmail`} className="block text-sm font-medium text-gray-600">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        name={`contacts[${index}].contactEmail`}
                                        value={contact.contactEmail}
                                        onChange={(e) => handleContactChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
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