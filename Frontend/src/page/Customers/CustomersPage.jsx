import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/ComponentExport';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';
import { CiViewBoard } from 'react-icons/ci';
import { BsBlockquoteRight } from 'react-icons/bs';

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState({
        column:'',
        ascending:true,
    })
    const [currentPage,setCurrentPage] = useState(1);
    const [itemsPerPage,setItemsPerPage] = useState(10);

    

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

    // const handleDelete = async (id) => {
    //     // Implement delete functionality using the ID
    //     // Send a DELETE request to the API with the specific customer ID
    // };

    const filteredCustomers = customers.filter((customer)=>{
        // Filter based on the search term for customer ID, name , email or phone
        return (
            customer.id.toString().includes(searchTerm) || 
            customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.customerPhone.includes(searchTerm)
        )
    })

    const handleSort = (column) =>{
        setSortOrder({
            column,
            ascending:sortOrder.column === column ? !sortOrder.ascending: true,
    
        })

        const sortedCustomers = [...customers].sort((a,b) => {
            const valueA = column === 'id' ? a[column] : a[column].toLowerCase();
            const valueB = column === 'id' ? b[column] : b[column].toLowerCase();

            if (valueA < valueB){
                return sortOrder.ascending ? -1 : 1;
            }
            if (valueA > valueB){
                return sortOrder.ascending ? 1:-1;
            }
            return 0;
        })
        setCustomers(sortedCustomers)
    }

    // Calculate total pages
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    //Get Current items for display
    const indexofLastItem = currentPage * itemsPerPage;
    const indexofFirstItem = indexofLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexofFirstItem, indexofLastItem);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        return Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 mx-1 rounded-full 
                    ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                    hover:bg-blue-600 hover:text-white focus:outline-none focus:bg-blue-600 focus:text-white`}
            >
                {index + 1}
            </button>
        ));
    };

    return (
        <div>
            <Navbar/>
            <div className="container mx-auto px-4 py-8 overflow-x-auto">
                <div className='mb-4'>
                    <input type = "text" placeholder = "Search by ID, Company Name, Email, or Mobile"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='border border-gray-300 rounded-md p-2 w-full'
                    />
                </div>
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase">
                            <th className="py-3 px-6 text-left" onClick={() => handleSort('id')}>ID {sortOrder.column === 'id' && (sortOrder.ascending ? '↑' : '↓')}</th>
                            <th className="py-3 px-6 text-left" onClick={() => handleSort('customerName')}>
                                Company Name{' '}
                                {sortOrder.column === 'customerName' && (sortOrder.ascending ? '↑' : '↓')}
                            </th>
                            <th className="py-3 px-6 text-left" onClick={() => handleSort('customerEmail')}> Email {sortOrder.column === 'customerEmail' && (sortOrder.ascending ? '↑' : '↓')}</th>
                            <th className="py-3 px-6 text-left" onClick={() => handleSort('customerPhone')}>Mobile {sortOrder.column === 'customerPhone' && (sortOrder.ascending ? '↑' : '↓')}</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {currentItems.map((customer) => (
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
            <div className = "flex justify-center items-center my-4 space-x-2">
                <button onClick={prevPage}
                    disabled = {currentPage === 1}
                    className={`px-3 py-1 rounded-full 
                        ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-blue-500 text-white'}
                        hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
                >
                    Prev

                </button>
                {renderPageNumbers()}
                <button onClick = {nextPage}
                        disabled = {currentPage == totalPages}
                        className={`px-3 py-1 rounded-full 
                        ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-blue-500 text-white'}
                        hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
                >
                    Next
                </button>

            </div>
        </div>
    );
}

export default CustomersPage;
