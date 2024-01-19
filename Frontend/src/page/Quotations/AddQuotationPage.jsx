import { useEffect, useState } from 'react';
import { Navbar } from '../../components/ComponentExport';
import { FaRegTrashAlt, FaTimes } from 'react-icons/fa';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function AddQuotationPage() {
    // This states are for Customers
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);

    // This states is for search product and table
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [tableData, setTableData] = useState([]);

    // This states is for managing services table
    const [showServiceTable, setShowServiceTable] = useState(false);
    const [serviceData, setServiceData] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    // New state variables for service-related totals
    const [serviceTotalPrice, setServiceTotalPrice] = useState(0);
    const [serviceTotalDiscount, setServiceTotalDiscount] = useState(0);
    const [serviceVatAmount, setServiceVatAmount] = useState(0);
    const [servicePriceWithVat, setServicePriceWithVat] = useState(0);

    // Updated state variables for overall quotation totals
    const [grandTotalPrice, setGrandTotalPrice] = useState(0);
    // const [grandTotal, setGrandTotal] = useState(0);
    const [grandTotalPriceWithVat, setGrandTotalPriceWithVat] = useState(0);
    const [grandTotalVatAmount, setGrandTotalVatAmount] = useState(0);
    const [additionalDiscount, setAdditionalDiscount] = useState();

    useEffect(() => {
        // Fetch services from the API
        fetch('https://pmcsaudi-uat.smaftco.com:3083/api/services/')
            .then(response => response.json())
            .then(data => {
                // Extract type_of_service values from the response
                const serviceTypes = data.map(service => service.type_of_service);
                // Remove duplicate values, if any
                const uniqueServiceTypes = Array.from(new Set(serviceTypes));
                setServiceOptions(uniqueServiceTypes);
            })
            .catch(error => console.error('Error fetching services:', error));
    }, []);

    useEffect(() => {
        // Fetch customers from the API
        fetch('https://pmcsaudi-uat.smaftco.com:3083/api/customer-product-service/')
            .then(response => response.json())
            .then(data => setCustomers(data.customers))
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    // Set a default customer when the component mounts
    useEffect(() => {
        const defaultCustomer = customers.find(customer => customer.customerName === 'DEFAULT');
        setSelectedCustomer(defaultCustomer);
    }, [customers]);

    const handleSelectCustomer = (event) => {
        const customerId = event.target.value;
        const selectedCustomer = customers.find(customer => String(customer.id) === customerId);
        setSelectedCustomer(selectedCustomer);
    };

    const searchProducts = () => {
        if (!searchKeyword.trim()) {
            setSearchedProducts([]);
            return;
        }

        fetch('https://pmcsaudi-uat.smaftco.com:3083/api/products/')
            .then(response => response.json())
            .then(data => setSearchedProducts(filterProducts(data, searchKeyword)))
            .catch(error => console.error('Error fetching products:', error));
    };

    const clearSearch = () => {
        setSearchKeyword('');
        setSearchedProducts([]);
    };

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
            // Set the default discount for the new product
            const defaultDiscount = 0;

            // Set the default quantity for the new product (you can change this to your desired default)
            const defaultQuantity = 1;

            // Create a new product object with the default discount
            const newProduct = { ...selectedProduct, discount: defaultDiscount, quantity: defaultQuantity };

            // Update the table data with the new product
            setTableData([...tableData, newProduct]);

            // Reset selectedProduct and search-related states
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
        const quantity = parseFloat(product.quantity) || 0; // Ensure quantity is a valid number
        const discountPercentage = parseFloat(product.discount) || 0; // Ensure discount is a valid number

        // Convert discount percentage to a multiplier (e.g., 10% to 0.1)
        const discountMultiplier = 1 - discountPercentage / 100;

        // Calculate discounted price
        const discountedPrice = product.price1 * discountMultiplier;

        // Calculate total
        return quantity * discountedPrice;
    };

    const handleDeleteRow = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData.splice(index, 1);
        setTableData(updatedTableData);
    };

    const calculateTotalPriceWithoutVat = () => {
        return tableData.reduce((total, product) => total + (calculateTotal(product) || 0), 0)

    };

    const calculateTotalDiscount = () => {
        return tableData.reduce((total, product) => total + (parseFloat(product.discount) || 0), 0);
    };
    

    const calculateTotalDiscountAmount = () => {
        const totalDiscountPercentage = calculateTotalDiscount();
        const totalPriceWithoutVat = calculateTotalPriceWithoutVat();
        const totalDiscountAmount = (totalDiscountPercentage / 100) * totalPriceWithoutVat;
        return totalDiscountAmount;
    };

    const calculateVatAndTotalPriceWithVat = () => {
        const totalPriceWithoutVat = calculateTotalPriceWithoutVat();
        const totalDiscount = calculateTotalDiscount();
        const vat = 0.15 * (totalPriceWithoutVat - totalDiscount);
        const totalPriceWithVat = totalPriceWithoutVat + vat;

        return {
            vat,
            totalPriceWithVat,
        };
    };

    const { vat, totalPriceWithVat } = calculateVatAndTotalPriceWithVat();


    // Services 
    const handleAddServiceClick = () => {
        setServiceData([...serviceData, { serviceType: '', description: '', time: '', discount: '', total: '' }]);
        setShowServiceTable(true);
    };
    const handleServiceTypeChange = (index, value) => {
        const updatedServiceData = [...serviceData];
        updatedServiceData[index].serviceType = value;
        setServiceData(updatedServiceData);
    };
    const handleDescriptionChange = (index, value) => {
        const updatedServiceData = [...serviceData];
        updatedServiceData[index].description = value;
        setServiceData(updatedServiceData);
    };
    const handleTimeChange = (index, value) => {
        const updatedServiceData = [...serviceData];
        updatedServiceData[index].time = value;

        // Update the total based on time (1 time = 100.00)
        const time = parseFloat(value) || 0;
        updatedServiceData[index].total = (time * 100.00).toFixed(2);

        setServiceData(updatedServiceData);

        // Update service-related totals
        // updateServiceTotals();
    };

    const updateServiceTotals = () => {
        let totalServicePrice = 0;
        let totalDiscountPercentage = 0;

        serviceData.forEach((service) => {
            const discount = parseFloat(service.discount) || 0;
            const total = parseFloat(service.total) || 0;

            totalDiscountPercentage += discount;
            totalServicePrice += total;
        });

        // Calculate the total discount amount as a percentage of the total service price
        const totalDiscountAmount = (totalDiscountPercentage / 100) * totalServicePrice;

        const vatOnService = 0.15 * totalServicePrice;
        const totalServicePriceWithVat = totalServicePrice + vatOnService;

        // Update state variables for service-related totals
        setServiceTotalPrice(totalServicePrice);
        setServiceTotalDiscount(totalDiscountAmount);
        setServiceVatAmount(vatOnService);
        setServicePriceWithVat(totalServicePriceWithVat);
    };

    const handleServiceDiscountChange = (index, discount) => {
        const updatedServiceData = [...serviceData];
        updatedServiceData[index].discount = discount;

        // Calculate total based on the entered discount percentage
        const time = parseFloat(updatedServiceData[index].time) || 0;
        const discountPercentage = parseFloat(discount) || 0;

        // Calculate discounted total
        const discountedTotal = (100 * time * (1 - discountPercentage / 100)).toFixed(2);

        updatedServiceData[index].total = discountedTotal;
        setServiceData(updatedServiceData);

        // Update service-related totals
        updateServiceTotals();
    };

    const handleTotalChange = (index, value) => {
        const updatedServiceData = [...serviceData];
        updatedServiceData[index].total = value;
        setServiceData(updatedServiceData);

        // Update service-related totals
        updateServiceTotals();

    };

    const handleRemoveServiceRow = (index) => {
        const updatedServiceData = [...serviceData];
        updatedServiceData.splice(index, 1);
        setServiceData(updatedServiceData);
    };


    // Get total
    const updateQuotationTotals = () => {
        const totalPriceWithoutVat = calculateTotalPriceWithoutVat();
        const totalDiscount = calculateTotalDiscount();

        const vatOnService = serviceVatAmount; // Assuming serviceVatAmount is already calculated
        const totalServicePriceWithVat = servicePriceWithVat; // Assuming servicePriceWithVat is already calculated

        setGrandTotalPrice(totalPriceWithoutVat + serviceTotalPrice);
        setGrandTotalVatAmount(vatOnService + vat - additionalDiscount);
        setGrandTotalPriceWithVat(totalServicePriceWithVat + totalPriceWithVat - additionalDiscount);
    };


    const handleAdditionalDiscountChange = (value) => {
        const discountPercentage = parseFloat(value) || 0;

        // Update additional discount
        setAdditionalDiscount(discountPercentage);

    
        // Update grand total when additional discount changes
        updateQuotationTotals();
    };

    return (
        <div>
            <Navbar />
            <div className="container p-6 mx-auto">
                <h1 className="mb-6 text-3xl font-bold text-gray-700">Create Quotation</h1>

                <div className="grid grid-cols-1 mb-4 md:gap-96 md:grid-cols-2">
                    <div className="col-span-1 mb-4 md:mb-0">
                        <label htmlFor="customer" className="block text-sm font-medium text-black">
                            Select Customer
                        </label>
                        <select
                            id="customer"
                            value={selectedCustomer?.id || ''}
                            onChange={(e) => handleSelectCustomer(e)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>Select customer</option>
                            {Array.isArray(customers) &&
                                customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.customerName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-span-1">
                        {/* Customer details */}
                        {selectedCustomer && (
                            <div className="mb-4">
                                <h2 className="mb-2 text-lg font-semibold">Customer Information</h2>
                                <div>
                                    <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
                                    <p><strong>Email:</strong> {selectedCustomer.customerEmail}</p>
                                    <p><strong>Mobile No.:</strong> {selectedCustomer.customerPhone}</p>
                                    <p><strong>Address:</strong> {selectedCustomer.customerAddress}</p>
                                    <p><strong>Customer Type:</strong> {selectedCustomer.customerType}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="mb-2 text-lg font-semibold">Product Information</h2>

                    <div className="col-span-2 mt-4 table-wrap">
                        <div className="relative flex items-center w-full">
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
                                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500"
                            >
                                Search Product
                            </label>
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
                                                    onClick={() => handleAddToTable(selectedProduct)}
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
                    </div>



                    <div className="col-span-2 mt-12 table-wrap">
                        <div className="table-responsive">
                            <Table className="bg-gray-100 text-black border-gray-300">
                                {/* <TableCaption className="bg-blue-500 text-white">Your Products</TableCaption> */}
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
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                    
                                                    value={product.discount || ''}
                                                    onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    style={{ appearance: 'textfield' }}
                                                />
                                            </TableCell>
                                            <TableCell className='text-black'>{calculateTotal(product).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleDeleteRow(index)}
                                                    className="text-red-600 transition duration-300 hover:text-red-800 "
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

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-semibold">Product Total</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2">Products Price Without Vat:</p>
                            <p className="mb-2">Products Discount:</p>
                            <p className="mb-2">Vat:</p>
                            <p>Total Price With Vat:</p>
                        </div>
                        <div className="text-right">
                            <p className="mb-2">{calculateTotalPriceWithoutVat().toFixed(2)}</p>
                            <p className="mb-2">{calculateTotalDiscountAmount().toFixed(2)}</p>
                            <p className="mb-2">{vat.toFixed(2)}</p>
                            <p>{totalPriceWithVat.toFixed(2)}</p>
                        </div>
                    </div>
                </div>


                <div className="mt-12">
                    <h2 className="mb-2  text-lg font-semibold">Add Service</h2>
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={handleAddServiceClick}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Add Service
                        </span>
                    </button>

                    {showServiceTable && (
                        <div className="col-span-2 mt-8 table-wrap">
                            <div className="table-responsive">
                                <Table className="bg-gray-100 text-black border-gray-300">
                                    <TableHeader className="bg-gray-200">
                                        <TableRow>
                                            <TableHead className='font-bold text-[#374151]'>Service Type</TableHead>
                                            <TableHead className='font-bold text-[#374151]'>Description</TableHead>
                                            <TableHead className='font-bold text-[#374151]'>Time</TableHead>
                                            <TableHead className='font-bold text-[#374151]'>Discount</TableHead>
                                            <TableHead className='font-bold text-[#374151]'>Total</TableHead>
                                            <TableHead className='font-bold text-[#374151]'>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {serviceData.map((service, index) => (
                                            <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                                                <TableCell className="text-black">
                                                    <select
                                                        value={service.serviceType}
                                                        onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    >
                                                        {serviceOptions.map((option, idx) => (
                                                            <option key={idx} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        value={service.description}
                                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                        placeholder="Enter description"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    />
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        value={service.time}
                                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                                        placeholder="Enter time"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    />
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        value={service.discount}
                                                        onChange={(e) => handleServiceDiscountChange(index, e.target.value)}
                                                        placeholder="Enter Discount"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    />
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        readOnly 
                                                        value={service.total}
                                                        onChange={(e) => handleTotalChange(index, e.target.value)}
                                                        placeholder="Enter Total"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-black">
                                                    <button
                                                        onClick={() => handleRemoveServiceRow(index)}
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
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-semibold">Service Total</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2">Service Price Without Vat:</p>
                            <p className="mb-2">Service Discount:</p>
                            <p className="mb-2">Vat:</p>
                            <p>Total Price With Vat:</p>
                        </div>
                        <div className="text-right">
                            <p className="mb-2">{serviceTotalPrice.toFixed(2)}</p>
                            <p className="mb-2">{serviceTotalDiscount.toFixed(2)}</p>
                            <p className="mb-2">{serviceVatAmount.toFixed(2)}</p>
                            <p>{servicePriceWithVat.toFixed(2)}</p>
                        </div>
                    </div>

                   

                </div>

                {/* Get Total Button */}
                <div className="mt-6">
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={updateQuotationTotals}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Get Total
                        </span>
                    </button>
                </div>

                {/* Grand Total Section */}
                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-semibold">Grand Total</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2">Grand Total Price:</p>
                            <p className="mb-2">Additional Discount:</p>
                            <p className="mb-2">Grand Total Vat Amount:</p>
                            <p>Grand Total Price With Vat:</p>
                        </div>
                        <div className="text-right">
                            <p className="mb-2">{grandTotalPrice.toFixed(2)}</p>
                            <input
                                type="number"
                                value={additionalDiscount}
                                onChange={(e) => handleAdditionalDiscountChange(e.target.value)}
                                placeholder="Enter Additional Discount"
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-black text-black"
                            />
                            <p className="mb-2">{grandTotalVatAmount.toFixed(2)}</p>
                            <p>{grandTotalPriceWithVat.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex mt-10 space-x-4">

                    {/* Preview Button */}
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={() => {
                            // Add your logic for Preview functionality
                        }}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Preview
                        </span>
                    </button>

                    {/* Send Button */}
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={() => {
                            // Add your logic for Send functionality
                        }}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Send
                        </span>
                    </button>

                    {/* Save Button */}
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={() => {
                            // Add your logic for Save functionality
                        }}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Save
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
}

export default AddQuotationPage;
