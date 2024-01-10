import { useEffect, useState } from 'react';
import { Navbar } from '../../components/ComponentExport';
import { CiViewBoard } from 'react-icons/ci';
import { IoTrashBin } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/products/');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    throw new Error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    const applyFilters = () => {
        let filteredBySearch = products.filter((product) => {
            const searchTermLowerCase = searchTerm.toLowerCase();

            return (
                product.id.toString().includes(searchTermLowerCase) ||
                product.name.toLowerCase().includes(searchTermLowerCase) ||
                product.part_number.toLowerCase().includes(searchTermLowerCase) ||
                product.brand.toLowerCase().includes(searchTermLowerCase) ||
                product.quantity.toString().includes(searchTermLowerCase)
            );
        });

        if (selectedBrand !== '') {
            filteredBySearch = filteredBySearch.filter(
                (product) => product.brand.toLowerCase() === selectedBrand.toLowerCase()
            );
        }

        return filteredBySearch;
    };

    const filteredProducts = applyFilters();

    const brands = Array.from(new Set(products.map((products)=> products.brand)))

   
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);


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
            <Navbar />
            <div className="container px-4 py-8 mx-auto overflow-x-auto">
                <div className='flex flex-col mb-4 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <input
                        type="text"
                        placeholder="Search.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full p-2 mb-4 border border-gray-300 rounded-md sm:w-auto sm:mb-0'
                    />
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md sm:w-auto'>
                        <option value="">Filter by Brand</option>
                        {brands.map((brand, index) => (
                            <option key={index} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto ">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-gray-700 uppercase bg-gray-200">
                                <th className="px-6 py-3 text-left">ID</th>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Part Number</th>
                                <th className="px-6 py-3 text-left">Brand</th>
                                <th className="px-6 py-3 text-left">Quantity</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {currentItems.map((product) => (
                                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="px-6 py-3">{product.id}</td>
                                    <td className="px-6 py-3">{product.name}</td>
                                    <td className="px-6 py-3">{product.part_number}</td>
                                    <td className="px-6 py-3">{product.brand}</td>
                                    <td className="px-6 py-3">{product.quantity}</td>
                                    <td className="flex flex-col items-center justify-center px-6 py-3 space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-x-3">
                                        <Link to={`/products/edit/${product.id}`} className="text-blue-400" title='Edit Details'>
                                            <FaRegEdit />
                                        </Link>
                                        <button
                                            // onClick={() => handleDelete(product.id)}
                                            className="text-red-400"
                                            title='Delete'
                                        >
                                            <IoTrashBin />
                                        </button>
                                        <Link to={`/customers/view/${product.id}`} className="" title='View'>
                                            <CiViewBoard />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center my-4 space-x-2">
                    <button onClick={prevPage} disabled={currentPage == 1} className={`px-3 py-1 rounded-full 
                        ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-blue-500 text-white'}
                        hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}>
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

export default ProductsPage;
