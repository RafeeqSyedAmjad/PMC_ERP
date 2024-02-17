import { useEffect, useState } from 'react';
import { Navbar } from '@/components/ComponentExport';
import { useParams } from 'react-router-dom';
import { FaRegTrashAlt, FaTimes } from 'react-icons/fa';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


function QuotationEditPage() {
    const { quotationId } = useParams();
    const token = localStorage.getItem('token');
    const [quotationData, setQuotationData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [products, setProducts] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [tableData, setTableData] = useState([]);

    const storedToken = localStorage.getItem('token');

    const searchProducts = () => {
        if (!searchKeyword.trim()) {
            setSearchedProducts([]);
            return;
        }

        fetch('https://pmcsaudi-uat.smaftco.com:3083/api/products/', {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setSearchedProducts(filterProducts(data, searchKeyword)))
            .catch(error => console.error('Error fetching products:', error));
    };

    const clearSearch = () => {
        setSearchKeyword('');
        setSearchedProducts([]);
    };


    useEffect(() => {
        const fetchQuotationData = async () => {
            try {
                const quotationResponse = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/quotation_calculations/${quotationId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!quotationResponse.ok) {
                    throw new Error('Failed to fetch quotation data');
                }

                const quotationData = await quotationResponse.json();
                setQuotationData(quotationData);

                const customerId = quotationData.customer;

                const customerResponse = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/customers/${customerId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!customerResponse.ok) {
                    throw new Error('Failed to fetch customer data');
                }

                const customerData = await customerResponse.json();
                setCustomerData(customerData);

                const productsResponse = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/products/${customerId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!productsResponse.ok) {
                    throw new Error('Failed to fetch products data');
                }

                const productsData = await productsResponse.json();
                setProducts(productsData);
                console.log(productsData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchQuotationData();
    }, [quotationId, token]);

    const shouldDisplayResults = searchKeyword.trim() !== '' && searchedProducts.length > 0;

    const filterProducts = (products, keyword) => {
        return products.filter(product =>
            product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            product.brand.toLowerCase().includes(keyword.toLowerCase()) ||
            product.part_number.toLowerCase().includes(keyword.toLowerCase())
        );
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleAddToTable = () => {
        if (selectedProduct) {
            const defaultDiscount = 0;
            const defaultQuantity = 1;
            const newProduct = { ...selectedProduct, discount: defaultDiscount, quantity: defaultQuantity };
            setTableData([...tableData, newProduct]);
            setSelectedProduct(null);
            setSearchKeyword('');
            setSearchedProducts([]);
        }
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].quantity = quantity;
        updatedTableData[index].total = calculateTotal(updatedTableData[index]);
        setTableData(updatedTableData);
    };

    const handleDiscountChange = (index, discount) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].discount = discount;
        updatedTableData[index].total = calculateTotal(updatedTableData[index]);
        setTableData(updatedTableData);
    };

    const calculateTotal = (product) => {
        const quantity = parseFloat(product.quantity) || 0;
        const discountPercentage = parseFloat(product.discount) || 0;
        const discountMultiplier = 1 - discountPercentage / 100;
        const discountedPrice = product.price1 * discountMultiplier;
        return quantity * discountedPrice;
    };

    const handleDeleteRow = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData.splice(index, 1);
        setTableData(updatedTableData);
    };

    console.log(tableData);
    return (
        <div>
            <Navbar />
            <div className="container p-6 mx-auto">
                <h1 className="mb-6 text-3xl font-bold text-gray-700">Create Quotation</h1>
                <div className="grid grid-cols-1 mb-4 md:gap-96 md:grid-cols-2">
                    <div className="col-span-1">
                        {customerData && (
                            <div className="mb-4">
                                <h2 className="mb-2 text-lg font-semibold">Customer Information</h2>
                                <div>
                                    <p><strong>Name:</strong> {customerData.customerName}</p>
                                    <p><strong>Email:</strong> {customerData.customerEmail}</p>
                                    <p><strong>Mobile No.:</strong> {customerData.customerPhone}</p>
                                    <p><strong>Address:</strong> {customerData.customerAddress}</p>
                                    <p><strong>Customer Type:</strong> {customerData.customerType}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='mb-4'>
                    <h2 className="mb-2 text-lg font-semibold">Product Information</h2>
                    <div className='col-span-2 mt-4 table-wrap'>
                        <div className="relative flex items-center w-[50%]">
                            <input
                                className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"
                                type="text"
                                id="searchBox"
                                placeholder=""
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onInput={searchProducts}
                            />
                            {searchKeyword && (
                                <button
                                    className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2"
                                    onClick={clearSearch}
                                >
                                    <FaTimes />
                                </button>
                            )}
                            <label
                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500"
                            >
                                Search Product
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-4 col-md-6 select">
                    <div className="form-control" id="productList">
                        {shouldDisplayResults && (
                            <ul>
                                {searchedProducts.map((product, index) => (
                                    <li key={index} className="flex items-center justify-between mb-2" onClick={() => handleProductSelect(product)}>
                                        <span>{`${product.name} - ${product.brand} - ${product.part_number}`}</span>
                                        <button
                                            className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                            onClick={() => {
                                                handleAddToTable();
                                                setSearchKeyword('');
                                            }}
                                        >
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                Add
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {searchKeyword.trim() !== '' && searchedProducts.length === 0 && (
                            <p>No products found</p>
                        )}
                    </div>
                </div>

                <div className="col-span-2 mt-12 table-wrap">
                    <div className="table-responsive">
                        <Table className="text-black bg-gray-100 border-gray-300">
                            <TableHeader className="bg-gray-200">
                                <TableRow >
                                    <TableHead className='font-bold text-[#374151]'>Product Name</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Brand</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Part Number</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Price</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Quantity</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Discount</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Total</TableHead>
                                    <TableHead className='font-bold text-[#374151]'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.map((product, index) => (
                                    <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                                        <TableCell className='text-black'>{product.name}</TableCell>
                                        <TableCell className='text-black'>{product.brand}</TableCell>
                                        <TableCell className='text-black'>{product.part_number}</TableCell>
                                        <TableCell className='text-black'>{product.price1}</TableCell>
                                        <TableCell>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={product.quantity || ''}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                className="w-16 px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={product.discount || ''}
                                                onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                className="w-16 px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                                style={{ appearance: 'textfield' }}
                                            />
                                        </TableCell>
                                        <TableCell className='text-black'>{calculateTotal(product).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleDeleteRow(index)}
                                                className="text-red-600 transition duration-300 hover:text-red-800"
                                            >
                                                <FaRegTrashAlt />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuotationEditPage;
