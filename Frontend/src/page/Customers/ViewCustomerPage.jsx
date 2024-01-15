import { useEffect, useState } from "react";
import { Navbar } from "../../components/ComponentExport"
import { useNavigate, useParams } from "react-router-dom";

function ViewCustomerPage() {

    const {customerId} = useParams();
    const navigate = useNavigate();
    const [customerDetails,setCustomerDetails] = useState({
        customerID: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerMap: '',
        customerVat: '',
        customerType: '',
        contactName: '',
        contactMobile: '',
        contactDesignation: '',
        contactEmail: '',
    });

    const [showContacts,setShowContacts] = useState(false);

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

    const toggleContacts = () => {
        setShowContacts((prevShowContacts) => !prevShowContacts);
    };
    
    return (
        <div>
            <Navbar />
            <div className="container p-6 mx-auto mt-8 bg-white rounded-md shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Customer Details</h1>
                <form>
                    {/* Customer Details */}
                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Customer ID</label>
                            <div className="readonly-field">{customerDetails.id}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <div className="readonly-field">{customerDetails.customerName}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <div className="readonly-field">{customerDetails.customerEmail}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <div className="readonly-field">{customerDetails.customerPhone}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Address</label>
                            <div className="readonly-field">{customerDetails.customerAddress}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Map</label>
                            <input
                                type="text"
                                readOnly
                                value={customerDetails.customerMap}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">VAT Number</label>
                            <div className="readonly-field">{customerDetails.customerVat}</div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Customer Type</label>
                            <div className="readonly-field">{customerDetails.customerType}</div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <h4 className="mb-2">Contact Information</h4>

                    {showContacts && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                <div className="readonly-field">{customerDetails.contactName}</div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600">Mobile</label>
                                <div className="readonly-field">{customerDetails.contactMobile}</div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <div className="readonly-field">{customerDetails.contactEmail}</div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600">Designation</label>
                                <div className="readonly-field">{customerDetails.contactDesignation}</div>
                            </div>
                        </div>
                    )}

                    {/* Toggle Contacts Button */}
                    <button
                        type="button"
                        onClick={toggleContacts}
                        className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        {showContacts ? 'Hide Contacts' : 'View Contacts'}
                    </button>

                    {/* Back button */}
                    <button
                        type="button"
                        onClick={() => {
                            navigate('/customers')
                        }}
                        className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Back
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ViewCustomerPage