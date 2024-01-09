import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/ComponentExport';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';
import { CiViewBoard } from 'react-icons/ci';
import { BsBlockquoteRight } from 'react-icons/bs';

function CustomersPage() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/customers/');
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                } else {
                    throw new Error('Failed to fetch customers');
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        }

        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        // Implement delete functionality using the ID
        // Send a DELETE request to the API with the specific customer ID
    };

    return (
        <div>
            <Navbar/>
            <div className="container mx-auto px-4 py-8 overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Company Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Mobile</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6">{customer.id}</td>
                                <td className="py-3 px-6">{customer.customerName}</td>
                                <td className="py-3 px-6">{customer.customerEmail}</td>
                                <td className="py-3 px-6">{customer.customerPhone}</td>
                                <td className="py-3 px-6 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-x-3">
                                    <Link to={`/customers/edit/${customer.id}`} className="text-blue-400" title='Edit Details'>
                                        <FaRegEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        className="text-red-400"
                                        title='Delete'
                                    >
                                        <IoTrashBin />
                                    </button>
                                    <Link to={`/customers/view/${customer.id}`} className="" title='View'>
                                        <CiViewBoard />
                                    </Link>
                                    <Link to={`/customers/quotes/${customer.id}`} className="" title="Quotes">
                                        <BsBlockquoteRight />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CustomersPage;
