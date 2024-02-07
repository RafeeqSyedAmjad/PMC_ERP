import { useState, useEffect } from 'react';
import { Navbar } from '@/components/ComponentExport';
import { IoTrashBin } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";


function CountryofOriginPage() {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);
    const [countryName, setNewCountryName] = useState();
    const [countryCode, setNewCountryCode] = useState('');


    useEffect(() => {
        fetchCountries();
    });

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    let storedToken = localStorage.getItem('token');


    const fetchCountries = async () => {
        try {
            const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/countries/', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCountries(data);
            } else {
                throw new Error('Failed to fetch countries');
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const createCountry = async () => {
        
        try {
            const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/countries/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
                },
                body: JSON.stringify({
                    countryName: countryName,
                    countryCode: countryCode
                })
            });
            if (response.ok) {
                const data = await response.json();
                setCountries(prevCountries => [...prevCountries, data]);
                toast.success('Country Created Sucessfully');
                closeModal();
                setNewCountryName('');
                setNewCountryCode('');
            } else {
                toast.error('Failed to create country');
            }
        } catch (error) {
            // console.error('Error creating country:', error);
            toast.error('Failed to create country');
        }
    };

    const handleDelete = async (countryId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this country?');
        if (confirmDelete) {
            try {
                const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/countries/${countryId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });
                if (response.ok) {
                    const updatedCountries = countries.filter((country) => country.id !== countryId);
                    setCountries(updatedCountries);
                    toast.success('Country Deleted Successfully');
                } else {
                    toast.error('Failed to delete country');
                }
            } catch (error) {
                console.error('Error deleting country:', error);
            }
        }
    };

    const filteredCountries = countries.filter((country) =>
        country.countryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexofLastItem = currentPage * itemsPerPage;
    const indexofFirstItem = indexofLastItem - itemsPerPage;
    const currentItems = filteredCountries.slice(indexofFirstItem, indexofLastItem);

    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

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
                key={index}
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
            <Navbar />
            <div className="container px-4 py-8 mx-auto overflow-x-auto">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={openModal}
                        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        Add Country
                    </button>
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                        <div className="p-8 bg-white rounded-lg">
                            <div className='flex justify-between mb-6'>
                                <h1 className="text-xl font-bold ">Add Category</h1>
                                <button onClick={closeModal} className="">
                                    <RxCross2 className="text-2xl text-black hover:text-gray-800" />
                                </button>
                            </div>

                            <label htmlFor="countryName" className="block mb-2 font-bold text-black">Country Name</label>
                            <input
                                type="text"
                                id="countryName"
                                value={countryName}
                                onChange={(e) => setNewCountryName(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                            />
                            <label htmlFor="countryCode" className="block mb-2 font-bold text-black">Country Code</label>
                            <input
                                type="text"
                                id="countryCode"
                                value={countryCode}
                                onChange={(e) => setNewCountryCode(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                            />
                            
                            <button
                                onClick={createCountry}
                                className="px-5 py-2 text-white bg-blue-500 rounded-lg"
                            >
                                Create Country
                            </button>
                        </div>
                    </div>
                )}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by Country Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="overflow-x-auto table-wrap">
                    <table className="w-full table-auto table-responsive">
                        <thead>
                            <tr className="text-gray-700 uppercase bg-gray-200">
                                <th className="px-6 py-3 text-left">Country ID</th>
                                <th className="px-6 py-3 text-left">Country Name</th>
                                <th className="px-6 py-3 text-left">Country Code</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {currentItems.map((country) => {
                                return(
                                    <tr key={country.country_id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="px-6 py-3">{country.country_id}</td>
                                        <td className="px-6 py-3">{country.countryName}</td>
                                        <td className="px-6 py-3">{country.countryCode}</td>
                                        <td className="flex items-center justify-center px-6 py-3">
                                            <button
                                                onClick={() => handleDelete(country.country_id)}
                                                className="text-red-400"
                                                title="Delete"
                                            >
                                                <IoTrashBin />
                                            </button>
                                        </td>
                                    </tr>
                                )
                                
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center my-4 space-x-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-full 
                        ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-blue-500 text-white'}
                        hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
                    >
                        Prev
                    </button>
                    {renderPageNumbers()}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-full 
                        ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-blue-500 text-white'}
                        hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CountryofOriginPage;
