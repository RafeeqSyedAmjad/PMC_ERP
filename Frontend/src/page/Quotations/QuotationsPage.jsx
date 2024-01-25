import  { useState, useEffect } from 'react';
import { Navbar } from '../../components/ComponentExport';
import { FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CiViewBoard, CiViewTable } from 'react-icons/ci';

function QuotationsPage() {
    const [quotations, setQuotations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    

    useEffect(() => {
        async function fetchQuotations() {
            try {
                const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/quotation_calculations/');
                if (response.ok) {
                    const data = await response.json();
                    setQuotations(data);
                } else {
                    throw new Error('Failed to fetch quotations');
                }
            } catch (error) {
                console.error('Error fetching quotations:', error);
            }
        }

        fetchQuotations();
    }, []);

    

    const applyFilters = () => {
        let filteredQuotations = quotations.filter((quotation) => {
            const searchTermLowerCase = searchTerm.toLowerCase();
            return (
                quotation.sales_quotation_id.toLowerCase().includes(searchTermLowerCase) ||
                quotation.customer.toString().includes(searchTermLowerCase) ||
                quotation.created_on.toLowerCase().includes(searchTermLowerCase) ||
                quotation.qtotal_including_vat.toLowerCase().includes(searchTermLowerCase)
                // quotation.contactNo.toString().includes(searchTermLowerCase)
            );
        });
        return filteredQuotations;
    };

    function previewQuotation(quotation_id) {
        window.open(`quote-page.html?id=${quotation_id}`, '_blank');
    }

    const filteredQuotations = applyFilters();

    const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem);

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
        const isMobile = window.innerWidth <= 640; // Adjust the breakpoint as needed

        if (isMobile) {
            return (
                <div className="flex items-center justify-center my-4 space-x-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => goToPage(1)}
                        className={`px-3 py-1 rounded-full 
                            ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                            hover:bg-blue-600 hover:text-white focus:outline-none focus:bg-blue-600 focus:text-white`}
                    >
                        1
                    </button>
                    {totalPages > 1 && (
                        <button
                            onClick={() => goToPage(2)}
                            className={`px-3 py-1 rounded-full 
                                ${currentPage === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                                hover:bg-blue-600 hover:text-white focus:outline-none focus:bg-blue-600 focus:text-white`}
                        >
                            2
                        </button>
                    )}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            );
        }

        // Render all page numbers for larger screens
        return (
            <div className="flex items-center justify-center my-4 space-x-2">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => goToPage(index + 1)}
                        className={`px-3 py-1 rounded-full 
                            ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                            hover:bg-blue-600 hover:text-white focus:outline-none focus:bg-blue-600 focus:text-white`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="container px-4 py-8 mx-auto overflow-x-auto">
                <div className='mb-4'>
                    <input
                        type="text"
                        placeholder="Search by SQ No., Customer ID, Quotation Date, Amount, Contact No."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded-md md:w-1/2 lg:w-1/3'
                    />
                </div>
                <div className='flex justify-end mb-4'>
                    <Link
                        to={`/quotations/add`}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    >
                        Add Quotation
                    </Link>
                </div>
                <div className='overflow-x-auto'>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-gray-700 uppercase bg-gray-200">
                                <th className="px-6 py-3 text-left">SQ No.</th>
                                <th className="px-6 py-3 text-left">Customer ID</th>
                                <th className="px-6 py-3 text-left">Quotation Date</th>
                                <th className="px-6 py-3 text-left">Amount</th>
                                <th className="px-6 py-3 text-left">Contact No.</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {currentItems.map((quotation) => (
                                <tr key={quotation.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="px-6 py-3">{quotation.sales_quotation_id}</td>
                                    <td className="px-6 py-3">{quotation.customer}</td>
                                    <td className="px-6 py-3">{quotation.created_on}</td>
                                    <td className="px-6 py-3">{quotation.qtotal_including_vat}</td>
                                    <td className="px-6 py-3">{quotation.contactNo}</td>
                                    {/* Implement Actions column here */}
                                    <td className="flex flex-col items-center justify-center px-6 py-3 space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-x-3">
                                        <Link to={`/quotations/edit/${quotation.id}/`} className="text-blue-400" title='Edit Details'>
                                            <FaRegEdit />
                                        </Link>
                                        <button onClick={() => {
                                            // console.log("Quotation ID:", quotation.sales_quotation_id);
                                            previewQuotation(quotation.quotation_id);
                                        }} className="" title='Preview'>
                                            <CiViewBoard />
                                        </button>
                                        <button
                                            className="text-green-400"
                                            title='Approve'
                                        >
                                            <CiViewTable />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex items-center justify-center my-4 space-x-2">
                    {renderPageNumbers()}
                </div>
            </div>
        </div>
    );
}

export default QuotationsPage;
