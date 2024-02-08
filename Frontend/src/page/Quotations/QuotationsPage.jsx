import  { useState, useEffect } from 'react';
import { Navbar } from '../../components/ComponentExport';
import { FaFileUpload, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CiViewBoard, CiViewTable } from 'react-icons/ci';
import { VscPreview } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';

function QuotationsPage() {
    const [quotations, setQuotations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState({
        column: '',
        ascending: true,
    });

    const [showModal, setShowModal] = useState(false);
    // const [modalData, setModalData] = useState(null);
    const [currentQuotationId, setCurrentQuotationId] = useState(null);
    const [currentCustomerId, setCurrentCustomerId] = useState(null);

    
    const openModal = (quotationId, customerId) => {
        setShowModal(true);
        setCurrentQuotationId(quotationId);
        setCurrentCustomerId(customerId);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    
    let storedToken = localStorage.getItem('token');

    useEffect(() => {
        async function fetchQuotations() {
            try {
                const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/quotation_calculations/', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });
                if (response.ok) {
                    let data = await response.json();
                    // Sort the data based on the desired column and order
                    data = sortQuotations(data, 'created_on', false); // Sorting by created_on in descending order
                    setQuotations(data);
                } else {
                    throw new Error('Failed to fetch quotations');
                }
            } catch (error) {
                console.error('Error fetching quotations:', error);
            }
        }

        fetchQuotations();
    }, [storedToken]);

    // Function to sort quotations based on the specified column and order
    const sortQuotations = (data, column, ascending) => {
        return data.sort((a, b) => {
            const valueA = column === 'sales_quotation_id' ? a[column] : a[column].toLowerCase();
            const valueB = column === 'sales_quotation_id' ? b[column] : b[column].toLowerCase();

            if (valueA < valueB) {
                return ascending ? -1 : 1;
            }
            if (valueA > valueB) {
                return ascending ? 1 : -1;
            }
            return 0;
        });
    };
    

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

    function previewQuotation(quotationId) {
        window.open(`/quotations/deliverynote/${quotationId}`, '_blank');
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


    const handleSort = (column) => {
        setSortOrder({
            column,
            ascending: sortOrder.column === column ? !sortOrder.ascending : true,
        });

        const sortedQuotations = [...quotations].sort((a, b) => {
            const valueA = column === 'sales_quotation_id' ? a[column] : a[column].toLowerCase();
            const valueB = column === 'sales_quotation_id' ? b[column] : b[column].toLowerCase();

            if (valueA < valueB) {
                return sortOrder.ascending ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortOrder.ascending ? 1 : -1;
            }
            return 0;
        });

        setQuotations(sortedQuotations);
    };

    const handleFileUpload = async (event) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                console.error('No file selected');
                toast.error('Please select a file');
                return;
            }

            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('po_file', file);
            formData.append('customer', currentCustomerId);
            formData.append('quotation', currentQuotationId);

            const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/upload-PO/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload PO file');
            }

            // Update quotation status
            await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/quotation_calculations/${currentQuotationId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
                },
                body: JSON.stringify({
                    "quotation_status": "PO Uploaded"
                }),
            });

            toast.success('PO File Uploaded Successfully');
            setShowModal(false);
        } catch (error) {
            console.error('Error uploading PO file:', error);
            toast.error('Error uploading PO file');
        }
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
                <div className='overflow-x-auto table-wrap'>
                    <table className="w-full table-auto table-responsive">
                        <thead>
                            <tr className="text-gray-700 uppercase bg-gray-200">
                                <th className="px-6 py-3 text-left" onClick={() => handleSort('sales_quotation_id')}>SQ No. {sortOrder.column === 'sales_quotation_id' && (sortOrder.ascending ? '↑' : '↓')}</th>
                                <th className="px-6 py-3 text-left" onClick={() => handleSort('customer')}>Customer ID{' '} {sortOrder.column === 'customer' && (sortOrder.ascending ? '↑' : '↓')}</th>
                                <th className="px-6 py-3 text-left" onClick={() => handleSort('created_on')}>Quotation Date{' '} {sortOrder.column === 'created_on' && (sortOrder.ascending ? '↑' : '↓')}</th>
                                <th className="px-6 py-3 text-left" onClick={() => handleSort('qtotal_including_vat')}>Amount{' '}{sortOrder.column === 'qtotal_including_vat' && (sortOrder.ascending ? '↑' : '↓')}</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {currentItems.map((quotation) => (
                                <tr key={quotation.sales_quotation_id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="px-6 py-3">{quotation.sales_quotation_id}</td>
                                    <td className="px-6 py-3">{quotation.customer}</td>
                                    <td className="px-6 py-3">{quotation.created_on}</td>
                                    <td className="px-6 py-3">{quotation.qtotal_including_vat}</td>
                                    <td className="px-6 py-3">{quotation.quotation_status}</td>
                                    {/* Implement Actions column here */}
                                    <td className="flex flex-col items-center justify-center px-6 py-3 space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-x-3">
                                        <Link to={`/quotations/edit/${quotation.id}/`} className="text-blue-400" title='Edit Details'>
                                            <FaRegEdit />
                                        </Link>
                                        <button onClick={() => previewQuotation(quotation.sales_quotation_id)} title='Preview'>
                                           
                                            <CiViewBoard />
                                        </button>
                                        <button
                                            className="text-green-400"
                                            title='Approve'
                                        >
                                            <CiViewTable />
                                        </button>
                                        
                                        <button className='' onClick={()=> openModal(quotation.quotation_id,quotation.customer)} title='Upload PO'>
                                            <FaFileUpload />
                                        </button>

                                        {showModal && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-transparent bg-opacity-50 shadow-md">
                                                <div className="p-8 bg-[#B4D4FF] rounded-lg">
                                                    <div className='flex justify-between mb-6'>
                                                        <h1 className="text-xl font-bold ">Add PO file</h1>
                                                        <button onClick={closeModal} className="">
                                                            <RxCross2 className="text-2xl text-black hover:text-gray-800" />
                                                        </button>
                                                    </div>

                                                    <label htmlFor="POFile" className="block mb-2 font-bold text-black">Select PO file:</label>
                                                    <input
                                                        type="file"
                                                        id="POFile"
                                                        // value={}
                                                        // onChange={handleFileUpload}
                                                        onChange={(event) => console.log(event)}
                                                        className="w-full p-2 mb-4 border border-black rounded-md"
                                                    />
                                                    
                                                    
                                                    <button
                                                        onClick={(event) => handleFileUpload(event)}
                                                        className="px-5 py-2 text-white bg-black rounded-lg"
                                                    >
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={() => previewQuotation(quotation.quotation_id)} className='' title='Delivery Note'>
                                            <VscPreview /> 
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
