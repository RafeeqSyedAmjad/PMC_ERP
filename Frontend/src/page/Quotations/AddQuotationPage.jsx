import { useEffect, useState, useRef } from 'react';
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
import header from '../../assets/header.png';
import footer from '../../assets/footer.jpg';
import service from '../../assets/service.jpg';
import generatePdf from 'react-to-pdf';


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
    // State variable to store the labor rate
    const [laborRate, setLaborRate] = useState(0);

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
    const [additionalDiscount, setAdditionalDiscount] = useState(0);
    const [AfterAdditionalDiscount, setAfterAdditonalDiscount] = useState(0); // eslint-disable-line no-unused-vars

    //Preview
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);

    //Send and Document Type
    const [isDocumentModalOpen, setDocumentModalOpen] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);

    // Ref for the preview modal content
    const componentRef = useRef();

    

    // merged service and product table data
    const mergedData = [...serviceData, ...tableData];
    // console.log('Merged Data:', mergedData);

    let storedToken = localStorage.getItem('token');

    const currentDate = new Date();

    // Set the options for formatting the date to Saudi Arabia's locale
    const options = {
        timeZone: 'Asia/Riyadh',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };

    // Get the current date in Saudi Arabia
    const saudiArabiaDate = currentDate.toLocaleString('en-US', options);

    useEffect(() => {
        // Fetch services from the API
        fetch('https://pmcsaudi-uat.smaftco.com:3083/api/services/', {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                // Extract type_of_service values from the response
                const serviceTypes = data.map(service => service.type_of_service);
                // Remove duplicate values, if any
                const uniqueServiceTypes = Array.from(new Set(serviceTypes));
                setServiceOptions(uniqueServiceTypes);
            })
            .catch(error => console.error('Error fetching services:', error));
    }, [storedToken]);

    useEffect(() => {
        // Fetch customers from the API
        fetch('https://pmcsaudi-uat.smaftco.com:3083/api/customer-product-service/', {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setCustomers(data.customers))
            .catch(error => console.error('Error fetching customers:', error));
    }, [storedToken]);

    // Set a default customer when the component mounts
    useEffect(() => {
        const defaultCustomer = customers.find(customer => customer.customerName === 'DEFAULT');
        setSelectedCustomer(defaultCustomer);
        
    }, [customers]);

    const handleSelectCustomer = (event) => {
        const customerId = event.target.value;
        const selectedCustomer = customers.find(customer => String(customer.id) === customerId);
        setSelectedCustomer(selectedCustomer);
        console.log(selectedCustomer)
    };

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

    // Fetch labor rate from the API
    useEffect(() => {
        fetch('https://pmcsaudi-uat.smaftco.com:3083/labor-rates/1/', {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                // Assuming your API returns the labor rate directly
                setLaborRate(data.laborRate);
            })
            .catch(error => console.error('Error fetching labor rate:', error));
    }, [storedToken]);

    const updateServiceTotals = () => {

        // Check if there are any rows in the service table
        if (serviceData.length === 0) {
            // If no rows, set all service-related totals to 0
            setServiceTotalPrice(0);
            setServiceTotalDiscount(0);
            setServiceVatAmount(0);
            setServicePriceWithVat(0);
            return; // Exit the function early
        }

        

        console.log('is this running')
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

        // Update the total based on time and labor rate
        const time = parseFloat(value) || 0;
        const total = (laborRate * time).toFixed(2); // Multiply by labor rate
        updatedServiceData[index].total = total;

        setServiceData(updatedServiceData);

        // Update service-related totals
        updateServiceTotals();
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

        // Call the updateServiceTotals function immediately after setting the state
        updateServiceTotals();
    };

    


    // Get total
    const updateQuotationTotals = () => {
        const totalPriceWithoutVat = calculateTotalPriceWithoutVat();

        // Calculate GrandTotal without VAT
        const GrandTotal = totalPriceWithoutVat + serviceTotalPrice;
        setGrandTotalPrice(GrandTotal);

        // Calculate total discount amount as a percentage of the GrandTotal without VAT
        const discountAmount = (additionalDiscount / 100) * GrandTotal;

        // Calculate the GrandTotal after applying the additional discount
        const AfterAdditionalDiscountAmt = GrandTotal - discountAmount;

        // Calculate VAT and GrandTotal with VAT
        const vatAmount = 0.15 * AfterAdditionalDiscountAmt;
        const totalWithVat = AfterAdditionalDiscountAmt + vatAmount;

        // Update state values
        setAfterAdditonalDiscount(discountAmount);
        setGrandTotalVatAmount(vatAmount);
        setGrandTotalPriceWithVat(totalWithVat);
    };



    const handleAdditionalDiscountChange = (value) => {
        const discountPercentage = parseFloat(value) || 0;

        // Update additional discount and trigger calculations
        setAdditionalDiscount(discountPercentage, () => {
            updateQuotationTotals();
        });
    };



    // UseEffect to trigger calculations after updating additional discount
    useEffect(() => {
        // Update grand total when additional discount changes
        updateQuotationTotals();
    });


    // Use a callback function to ensure that the state is updated before calculations
    const setAdditionalDiscounts = (value, callback) => {
        setAdditionalDiscountValue(value, callback);
    };

    const setAdditionalDiscountValue = (value, callback) => {
        setAdditionalDiscounts(value);
        if (callback && typeof callback === 'function') {
            callback();
        }
    };


    // PREVIEW

    // function to handle modal vissibility
    const openPreviewModal = () => {
        setPreviewModalOpen(true);
    };

    const closePreviewModal = () => {
        setPreviewModalOpen(false)
    }


    //Document Type and Send

    // Function to open the document modal
    const openDocumentModal = () => {
        setDocumentModalOpen(true);
    };

    // Function to close the document modal
    const closeDocumentModal = () => {
        setDocumentModalOpen(false);
    };

    // Function to handle document type selection
    const handleDocumentTypeSelect = (type) => {
        setSelectedDocumentType(type);
    };

    
    // Function to generate PDF and send it to the API
    const handleGeneratePDF = async () => {
        // Generate PDF using react-to-pdf

         var QuotationId = 0;

        try {
            const pdfData = await generatePdf(componentRef, { filename: 'sales_quotation.pdf' });

            // Extract the base64 data from the PDF data
            const base64Data = pdfData.replace(/^data:application\/pdf;base64,/, "");

            // Get the current user's email from local storage
            const userEmail = localStorage.getItem('userEmail');

            // Prepare the data to be sent to the API
            const jsonData = {
                pdf_file: base64Data,
                customer_email: userEmail, // Assuming selectedCustomer contains the necessary data
                quotation: QuotationId , // Update with your quotation ID if available
                customer: selectedCustomer ? selectedCustomer.id : null // Use selectedCustomer.id if available
            };

            // Get the token from local storage
            const token = localStorage.getItem('token');

            // Send the PDF data to the API
            const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/upload-pdf/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(jsonData),
            });

            // Check if the request was successful
            if (response.ok) {
                // Show a success message
                window.alert('PDF sent to the API successfully');
            } else {
                // Handle errors
                console.error('Error sending PDF to the API:', response.statusText);
                window.alert('Error sending PDF to the API. Please try again.');
            }
        } catch (error) {
            // Handle errors that occurred during PDF generation
            console.error('Error generating PDF:', error);
            window.alert('Error generating PDF. Please try again.');
        }
    };






    
    // Function to send the email based on the selected document type
    const sendEmailAndGeneratePdf = () => {
        // Add your logic for sending email based on selectedDocumentType
        // ...
        // var changeStatus = true;
        // const element = document.getElementById('')

        // Add your logic for sending email based on selectedDocumentType
        // In this case, we're directly generating the PDF and sending it to the server
        if (selectedDocumentType === 'PDF') {
            handleGeneratePDF();
        }
        
        // Show a Windows popup with the desired message
        window.alert("Quotation created successfully");
        // Close the modal after sending email
        closeDocumentModal();
    };

    // var unitPrice = 0;
    
    const handleSubmitClick = async (changeStatus) => {

        const token = localStorage.getItem('token');


        
        // Construct quotation object
        let quotation = {
            "products": [],
            "services": [],
            "qtotal": 0,
            "qdiscount": 0,
            "qadditional_discount": 0,
            "qnet": 0,
            "qvat_15perc": 0,
            "qtotal_including_vat": 0,
            "customer": 0,
            "quotation_status": ""
        };

        // Log the id of selectedCustomer
        console.log("Selected Customer ID:", selectedCustomer ? selectedCustomer.id : null);

        // Construct quotation data for products
        if (tableData.length > 0) {
            quotation.products = tableData.map(product => ({
                "qproduct_part_number": product.part_number,
                "product": product.productid,
                "qproduct_name": product.name,
                "qproduct_unit_price": product.price1,
                "qproduct_quantity": product.quantity,
                "qproduct_discount": product.discount,
                "qproduct_discounted_Amount": product.discountedAmount,
                "qproduct_total": product.productTotal,
                "qimage": product.productimage,
                "customer": selectedCustomer ? selectedCustomer.id : null // Use selectedCustomer.id if available
            }));
        }

        // Construct quotation data for services
        if (serviceData.length > 0) {
            quotation.services = serviceData.map(service => ({
                "service": service.serviceId,
                "qservice_type_of_service": service.serviceType,
                "qservice_time": service.time,
                "qservice_unit_price": 100, // Assuming unit price is fixed
                "qservice_quantity": 0, // Assuming quantity is not applicable for services
                "q_service_description": service.description,
                "qservice_discount": service.discount,
                "qservice_discounted_Amount": service.discountedAmount,
                "qservice_total": service.total,
                "customer": selectedCustomer ? selectedCustomer.id : null // Use selectedCustomer.id if available
            }));
        }

        // Calculate total, discounts, and VAT
        let productPrice = isNaN(parseFloat(calculateTotalPriceWithoutVat().toFixed(2).innerHTML)) ? 0 : parseFloat(calculateTotalPriceWithoutVat().toFixed(2).innerHTML);
        let servicePrice = isNaN(parseFloat(serviceTotalPrice.toFixed(2).innerHTML)) ? 0 : parseFloat(serviceTotalPrice.toFixed(2).innerHTML);
        let serviceDiscount = isNaN(parseFloat(serviceTotalDiscount.toFixed(2).innerHTML)) ? 0 : parseFloat(serviceTotalDiscount.toFixed(2).innerHTML);
        let productDiscount = isNaN(parseFloat(calculateTotalDiscountAmount().toFixed(2).innerHTML)) ? 0 : parseFloat(calculateTotalDiscountAmount().toFixed(2).innerHTML);
        let additionalDiscountValue = isNaN(parseFloat(additionalDiscount.valueOf)) ? 0 : parseFloat(additionalDiscount.valueOf);

        quotation.qtotal = (productPrice + servicePrice).toFixed(2);
        let additionalDiscountAmt = additionalDiscountValue / 100 * quotation.qtotal;
        let amountAfterAdditionalDiscount = quotation.qtotal - additionalDiscountAmt;
        quotation.qdiscount = (serviceDiscount + productDiscount).toFixed(2);
        quotation.qadditional_discount = parseFloat(amountAfterAdditionalDiscount).toFixed(2);
        quotation.qnet = (productPrice + servicePrice).toFixed(2);
        quotation.qvat_15perc = (0.15 * parseFloat(amountAfterAdditionalDiscount)).toFixed(2);
        quotation.qtotal_including_vat = (parseFloat(amountAfterAdditionalDiscount) + parseFloat(quotation.qvat_15perc)).toFixed(2);
        quotation.customer = selectedCustomer ? selectedCustomer.id : null // Use selectedCustomer.id if available
        quotation.quotation_status = changeStatus ? "Quotation Sent" : "Quotation Created";

        // Send quotation data to the API
        try {
            const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/quotation_calculations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Assuming token is accessible in this component
                },
                body: JSON.stringify(quotation),
            });

            if (response.ok) {
                alert('Quotation created successfully!');
                // Redirect or perform other actions upon successful creation
            } else {
                const errors = await response.json();
                alert('Error creating quotation: ' + JSON.stringify(errors));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating quotation. Please try again.');
        }
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
                            <Table className="text-black bg-gray-100 border-gray-300">
                                {/* <TableCaption className="text-white bg-blue-500">Your Products</TableCaption> */}
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
                    <h2 className="mb-2 text-lg font-semibold">Add Service</h2>
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
                                <Table className="text-black bg-gray-100 border-gray-300">
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
                                                        value={service.serviceType || 'Select Services'}
                                                        onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                                                        className="w-full px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                                    >
                                                        <option disabled>Select Services</option>
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
                                                        className="w-full px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                                    />
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        value={service.time}
                                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                                        placeholder="Enter time"
                                                        className="w-full px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                                    />
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        value={service.discount}
                                                        onChange={(e) => handleServiceDiscountChange(index, e.target.value)}
                                                        placeholder="Enter Discount"
                                                        className="w-full px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                                    />
                                                </TableCell>
                                                <TableCell className='text-black'>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={service.total}
                                                        onChange={(e) => handleTotalChange(index, e.target.value)}
                                                        placeholder="Enter Total"
                                                        className="w-full px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
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
                                type="text"
                                value={additionalDiscount}
                                onChange={(e) => handleAdditionalDiscountChange(e.target.value)}
                                placeholder="Enter Additional Discount"
                                className="w-16 px-2 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:border-black"
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
                        onClick={openPreviewModal}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Preview
                        </span>
                    </button>



                    {/* Send Button */}
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={openDocumentModal}

                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Send
                        </span>
                    </button>


                    {/* Document Type Modal */}
                    {isDocumentModalOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"

                        >
                            <div className="w-64 p-5 bg-white rounded-lg">
                                <div className='flex mb-4'>
                                    <h2 className="text-lg font-semibold ">Select Doc Type</h2>

                                    <button type="button" className="inline-flex items-center justify-center text-sm text-black bg-transparent rounded-lg hover:text-gray-900 ms-auto" data-modal-hide="default-modal" onClick={closeDocumentModal}>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className='text-lg' d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>


                                <div className="flex items-center mb-4">
                                    <input
                                        type="radio"
                                        id="pdf"
                                        name="documentType"
                                        value="PDF"
                                        checked={selectedDocumentType === 'PDF'}
                                        onChange={() => handleDocumentTypeSelect('PDF')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="pdf">PDF</label>
                                </div>

                                {/* <div className="flex items-center mb-4">
                                    <input
                                        type="radio"
                                        id="doc"
                                        name="documentType"
                                        value="DOC"
                                        checked={selectedDocumentType === 'DOC'}
                                        onChange={() => handleDocumentTypeSelect('DOC')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="doc">DOC</label>
                                </div> */}

                                {/* <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="excel"
                                        name="documentType"
                                        value="Xcel"
                                        checked={selectedDocumentType === 'Xcel'}
                                        onChange={() => handleDocumentTypeSelect('Xcel')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="excel">Xcel</label>
                                </div> */}

                                {/* Send Email Button */}

                                <button type="button" onClick={sendEmailAndGeneratePdf} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-6">Send Email</button>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        onClick={handleSubmitClick} // Pass false to indicate that the status is not changed
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Save
                        </span>
                    </button>

                </div>

            </div>

            {/* Preview Modal */}

            {/* <SalesQuotationPDF
                selectedCustomer={selectedCustomer}
                saudiArabiaDate={saudiArabiaDate}
                mergedData={mergedData}
                grandTotalPrice={grandTotalPrice}
                serviceTotalDiscount={serviceTotalDiscount}
                calculateTotalDiscountAmount={calculateTotalDiscountAmount}
                grandTotalVatAmount={grandTotalVatAmount}
                grandTotalPriceWithVat={grandTotalPriceWithVat} /> */}

            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden={!isPreviewModalOpen} // Hide modal when not open
                className={`${isPreviewModalOpen ? 'fixed' : 'hidden'
                    } overflow-y-auto overflow-x-hidden flex z-50 justify-center items-center w-full h-full md:w-full md:inset-0 md:h-[calc(100%-1rem)] max-h-full`}
            >
                
                <div className="relative max-h-full p-4 md:w-full md:max-w-6xl">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow" ref={componentRef}>
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 ">
                            <h3 className="text-xl font-semibold text-black">
                                Sales Quotation
                            </h3>
                            <button type="button" className="inline-flex items-center justify-center text-sm text-gray-400 bg-transparent rounded-lg hover:text-gray-900 ms-auto dark:hover:text-white" data-modal-hide="default-modal" onClick={closePreviewModal}>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className='flex flex-col items-center justify-center'>

                            <div className="logo">
                                <img src={header} width="100%" height="100%" alt="PMC" />
                            </div>

                            <div className='flex flex-col items-center mt-3'>
                                <h3 className="text-xl font-bold">SALES QUOTATION</h3>

                            </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-bold">
                            {selectedCustomer && (
                                
                                <div className="flex flex-wrap justify-between mt-8 ml-6">
                                    <div className="w-full md:w-[33.33%] md:text-xl font-bold">
                                        {/* <p>SQ NO : {quotationData.sales_quotation_id}</p> */}
                                        <p>Customer Code : {selectedCustomer?.id}</p>
                                        <p>Customer Name : {selectedCustomer?.customerName}</p>
                                        <p> Contact Person : {selectedCustomer?.customerPhone}</p>
                                        <p> Email Address : {selectedCustomer?.customerEmail}</p>
                                    </div>
                                    <div className="w-full mt-4 md:w-[33.33%] md:mt-0">
                                        <p className="font-bold md:text-xl"> Contact No : {selectedCustomer.customerPhone} </p>
                                    </div>
                                    <div className="w-full mt-4 font-bold md:text-xl md:w-[33.33%] md:mt-0">
                                        <p>Type QUOTATION1 Page 1: First</p>
                                        <p> Sales Quotation Date : {saudiArabiaDate}</p>
                                        <p>Salesman : {selectedCustomer?.customerName}</p>
                                        <p>SO Date : {saudiArabiaDate}</p>
                                        <p>Customer Ref : {selectedCustomer?.customerName}</p>
                                    </div>
                                    <h1 className="mt-4 text-xl font-bold">Remark</h1>
                                </div>
                            )}
                            
                        </div>

                        {/* Table */}
                        <div className="relative mt-3 ml-4 mr-4 overflow-x-auto ">
                            <table className="w-[100%] text-sm text-center text-black border-2 border-black ">
                                <thead className="box-border text-xl text-black border-2 border-black dark:text-black">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 border-2 border-black">
                                            No
                                        </th>
                                        <th scope="col" className="px-6 py-3 border-2 border-black">
                                            Item Picture
                                        </th>
                                        <th scope="col" className="px-6 py-3 border-2 border-black">
                                            Item Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 border-2 border-black">
                                            QTY
                                        </th>
                                        <th scope="col" colSpan="3" className="border-2 border-black w-[200px]">
                                            Price (SAR)

                                        </th>

                                    </tr>

                                    <tr className="">
                                        <th>
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-none ">
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-2 border-black px-[50px] ">
                                            Unit price
                                        </th>
                                        <th scope="col" className="border-black w-[50px] border-2 px-[50px]">
                                            %
                                        </th>
                                        <th scope="col" className=" border-2 w-[100px] px-[50px] border-black">
                                            Value
                                        </th>
                                    </tr>


                                </thead>
                                <tbody>
                                    {mergedData.map((data, index) => (
                                        <tr key={index} className="text-xl border-2 border-b border-black">
                                            {data.serviceType ? (
                                                // Render service data
                                                <>
                                                    <td className="text-black border-2 border-black">-</td> {/* Placeholder for index */}
                                                    <td className="px-6 text-black border-2 border-black"><img src={service} className="w-[80px] h-[80px]"/></td>
                                                    <td className="text-black border-2 border-black">{data.description}</td>
                                                    <td className="text-black border-2 border-black">{data.time}</td> 
                                                    <td className="text-black border-2 border-black">{data.total}</td>
                                                    <td className="px-6 text-black border-2 border-black">{data.discount}</td>
                                                    <td className="px-6 text-black border-2 border-black">{data.total}</td>
                                                </>
                                            ) : (
                                                // Render product data
                                                <>
                                                    <td className="text-black border-2 border-black">{index + 1}</td>
                                                    <td className="px-6 text-black border-2 border-black"><img src={data.image1} className="w-[80px] h-[80px]" /></td>
                                                    <td className="text-black border-2 border-black py-">{data.name}</td>
                                                    <td className="text-black border-2 border-black">{data.quantity}</td>
                                                    <td className="text-black border-2 border-black">{data.price1}</td>
                                                    <td className="px-6 text-black border-2 border-black">{data.discount}</td>
                                                    <td className="px-6 text-black border-2 border-black">{data.total}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                    
                                        {/* <tr key={index} className="text-xl border-2 border-b border-black">
                                            <td className="text-black border-2 border-black ">{index + 1}</td>
                                            <td className="px-6 text-black border-2 border-black "><img src={product.qimage} className="w-[100px] h-[100px]" /></td>
                                            <td className="text-black border-2 border-black py-">{product.qproduct_name}</td>
                                            <td className="text-black border-2 border-black "> {product.qproduct_quantity}</td>

                                            <td className="text-black border-2 border-black">{product.qproduct_unit_price}</td>
                                            <td className="px-6 text-black border-2 border-black">{product.qproduct_discount}</td>
                                            <td className="px-6 text-black border-2 border-black">{product.qproduct_total}</td>
                                        </tr> */}
                                

                                    
                                    <tr className="text-xl">
                                        <th>
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-none ">
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <td className="border-2 border-black" colSpan="2">
                                            <strong>Total</strong>
                                        </td>
                                        <td className="border-2 border-black">{grandTotalPrice.toFixed(2)}</td>
                                    </tr>
                                    <tr className="text-xl">
                                        <th>
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-none ">
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <td className="border-2 border-black" colSpan="2">
                                            <strong>Discount</strong>
                                        </td>
                                        <td className="border-2 border-black">{(serviceTotalDiscount + calculateTotalDiscountAmount()).toFixed(2)}</td>
                                    </tr>
                                    <tr className="text-xl">
                                        <th>
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-none ">
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <td className="border-2 border-black" colSpan="2">
                                            <strong>Net</strong>
                                        </td>
                                        <td className="border-2 border-black">{grandTotalPrice.toFixed(2)}</td>
                                    </tr>
                                    <tr className="text-xl">
                                        <th>
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-none ">
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <td className="border-2 border-black" colSpan="2">
                                            <strong>Vat 15%</strong>
                                        </td>
                                        <td className="border-2 border-black">{grandTotalVatAmount.toFixed(2)}</td>
                                    </tr>

                                    <tr className="text-xl">
                                        <th>
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <th scope="col" className="border-none ">
                                        </th>
                                        <th scope="col" className="border-none">
                                        </th>
                                        <td className="border-2 border-black" colSpan="2">
                                            <strong>Total + Vat</strong>
                                        </td>
                                        <td className="border-2 border-black">{grandTotalPriceWithVat.toFixed(2)}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>


                        {/* Terms and Conditions */}
                        <hr className="h-px my-6 bg-black border-0"></hr>
                        <div className="mt-4 ml-4 space-y-5 text-sm">
                            <h6 className="font-bold">TERMS AND CONDITIONS:</h6>
                            <p><strong>Payment:</strong> Delivery Against Official PO</p>
                            <p><strong>Warranty:</strong> One Year Factory Warranty</p>
                            <p><strong>Validity:</strong> 30 Days</p>
                            <p><strong>Delivery:</strong> 30 Days</p>
                            <p><strong>Other:</strong> Installation Charges Not Included in the Package</p>
                            <p className="mt-2 font-bold"><em>REFUSAL TO RECEIVE PMC FINAL DELIVERY DUE TO UNAVAILABILITY OF THE PROJECT SITE WILL ONLY BE TOLERATED AS LONG THE CUSTOMER WILL PAY THE COMPLETE AMOUNT OF THE P.O. WITHIN 15 DAYS AFTER THEIR DELIVERY REFUSAL.</em></p>
                        </div>
                        {/* Prepared By and Received By */}
                        <div className="flex flex-col mt-4 ml-4 text-base font-bold">
                            <div className="flex flex-col">
                                <span>Prepared By:</span>
                                {/* Add the variable or text for Prepared By here */}
                            </div>
                            <div className="flex flex-col">
                                <span>Received By:</span>
                                {/* Add the variable or text for Received By here */}
                            </div>
                        </div>
                        {/* <!-- Modal footer --> */}
                        <div className="flex items-center">
                            {/* Footer content goes here */}
                            <img src={footer} width="100%" height="100%" alt="PMC" />
                        </div>
                    </div>

                </div>
            </div>

            
        </div>
    );
}

export default AddQuotationPage;
