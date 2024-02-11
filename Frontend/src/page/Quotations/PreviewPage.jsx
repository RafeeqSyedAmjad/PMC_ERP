import { useParams } from "react-router-dom";
import header from '../../assets/header.png';
import footer from '../../assets/footer.jpg';
import { useEffect, useState } from "react";


function PreviewPage() {
    const { quotationId } = useParams();
    const [quotationData, setQuotationData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotationData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch quotation data
                const quotationResponse = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/quotation_calculations/${quotationId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!quotationResponse.ok) {
                    throw new Error('Failed to fetch quotation data');
                }
                const quotationData = await quotationResponse.json();
                setQuotationData(quotationData)
                console.log(quotationData)

                // Fetch customer data
                const customerResponse = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/customers/${quotationData.customer}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!customerResponse.ok) {
                    throw new Error('Failed to fetch customer data');
                }
                const customerData = await customerResponse.json();

                setCustomerData(customerData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchQuotationData();
    }, [quotationId]);

    if (loading) {
        return <div>Loading...</div>;
    }

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

    return (
        <div className="flex flex-col min-h-screen ">
            <img src={header} alt='header' />
            {/* <div className="text-center"> */}
            <h1 className="font-bold text-center md:text-4xl">Sales  Quotation</h1>
            {/* </div> */}

            <div className="flex flex-wrap justify-between mt-8 ml-6">
                <div className="w-full md:w-[33.33%] md:text-xl font-bold">
                    <p>SQ NO : {quotationData.sales_quotation_id}</p>
                    <p>Customer Code : {customerData.id}</p>
                    <p>Customer Name : {customerData.customerName}</p>
                    <p> Contact Person : {customerData.customerPhone}</p>
                    <p> Email Address : {customerData.customerEmail}</p>
                </div>
                <div className="w-full mt-4 md:w-[33.33%] md:mt-0">
                    <p className="font-bold md:text-xl"> Contact No : {customerData.customerPhone} </p>
                </div>
                <div className="w-full mt-4 font-bold md:text-xl md:w-[33.33%] md:mt-0">
                    <p>Type QUOTATION1 Page 1: First</p>
                    <p> Sales Quotation Date : {saudiArabiaDate}</p>
                    <p>Salesman : {customerData.customerName}</p>
                    <p>SO Date : {saudiArabiaDate}</p>
                    <p>Customer Ref : {customerData.customerName}</p>
                </div>
                <h1 className="mt-4 text-xl font-bold">Remark</h1>


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
                        {quotationData.products.map((product, index) => (
                            <tr key={index} className="text-xl border-2 border-b border-black">
                                <td className="text-black border-2 border-black ">{index + 1}</td>
                                <td className="px-6 text-black border-2 border-black "><img src={product.qimage} className="w-[100px] h-[100px]"/></td>
                                <td className="text-black border-2 border-black py-">{product.qproduct_name}</td>
                                <td className="text-black border-2 border-black "> {product.qproduct_quantity}</td>

                                <td className="text-black border-2 border-black">{product.qproduct_unit_price}</td>
                                <td className="px-6 text-black border-2 border-black">{product.qproduct_discount}</td>
                                <td className="px-6 text-black border-2 border-black">{product.qproduct_total}</td>
                            </tr>
                        ))}
                        
                        {quotationData.services.map((service, serviceIndex) => (
                            <div key={serviceIndex}>

                                
                            </div>
                        ))}
                        <tr className="text-xl">
                            <th>
                            </th>
                            <th scope="col" className="border-none">
                            </th>
                            <th scope="col" className="border-none ">
                            </th>
                            <th scope="col" className="border-none">
                            </th>
                              <td className = "border-2 border-black" colSpan="2">
                                <strong>Total</strong>
                              </td>
                            <td className="border-2 border-black">{quotationData.qtotal}</td>
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
                            <td className="border-2 border-black">{quotationData.qdiscount}</td>
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
                            <td className="border-2 border-black">{quotationData.qtotal}</td>
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
                            <td className="border-2 border-black">{quotationData.qvat_15perc}</td>
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
                            <td className="border-2 border-black">{quotationData.qtotal_including_vat}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="mt-10 border border-black"> </div>
            <p className="mt-6 ml-4 font-bold">TERMS AND CONDITIONS:</p>
            <div className="mt-2 border border-black"> </div>

            <div className="mt-6 ml-4">Payment : Delivery Againt Offical PO</div>

            <div className="mt-2 ml-4">Warranty : One Year Factory Warranty</div>
            <div className="mt-2 ml-4">Warranty : One Year Factory Warranty</div>
            <div className="mt-2 ml-4">Validity: 30 Days </div>
            <div className="mt-2 ml-4">Delivery : 30 Days</div>
            <div className="mt-2 ml-4">Other : Installation Charges Not Include in the Package</div>

            <div className="mt-2 ml-4 text-lg font-bold">REFUSAL TO RECIEVE PMC FINAL DELIVERY DUE TO UNAVAILABILITY OF THE PROJECT SITE WILL ONLY BE TOLERATED AS LONG THE CUSTOMER WILL PAY THE COMPLETE AMOUNT OF THE P.O. WITHIN 15 DAYS AFTER THEIR DELIVERY REFUSAL.</div>

            <div className="mt-4 border border-black"> </div>

            <p className="mt-6 ml-4 text-center">Prepared By:</p>
            <p className="mt-1 mb-4 ml-4 text-center">Recieved By:</p>


            <div className="mt-auto">
                <img src={footer} alt='Footer' />
            </div>





        </div>
    )
}

export default PreviewPage