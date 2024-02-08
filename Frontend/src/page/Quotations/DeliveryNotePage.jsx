import { useParams } from "react-router-dom";
import header from '../../assets/header.png';
import footer from '../../assets/footer.jpg';
import { useEffect, useRef, useState } from "react";
import  generatePdf  from 'react-to-pdf';


function DeliveryNotePage() {
  const { quotationId } = useParams();
  const [quotationData, setQuotationData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();



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
    <div className="flex flex-col min-h-screen " ref={componentRef}>
      <img src={header} alt='header' />
      {/* <div className="text-center"> */}
      <h1 className="font-bold text-center md:text-4xl">Delivery Note</h1>
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
      <div className="relative mt-3 overflow-x-auto">
        <table className="w-full text-sm text-left text-black border-2 border-black rtl:text-right dark:text-black">
          <thead className="text-xl text-black uppercase dark:text-black">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Item Name
              </th>
              <th scope="col" className="px-6 py-3">
                QTY
              </th>
            </tr>
          </thead>
          <tbody>
            {quotationData.products.map((product, index) => (
              <tr key={index} className="text-xl border-b">
                <td className="px-6 py-4 text-black">{index + 1}</td>
                <td className="px-6 py-4 text-black">{product.qproduct_name}</td>
                <td className="px-6 py-4 text-black">{product.qproduct_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 border border-black"> </div>
      <p className="mt-6 ml-4 font-bold">TERMS AND CONDITIONS:</p>
      <div className="mt-2 border border-black"> </div>

      <div className="mt-6 ml-4 font-bold">Notes : </div>

      <div className="mt-6 ml-4 font-bold">REFUSAL TO RECIEVE PMC FINAL DELIVERY DUE TO UNAVAILABILITY OF THE PROJECT SITE WILL ONLY BE TOLERATED AS LONG THE CUSTOMER WILL PAY THE COMPLETE AMOUNT OF THE P.O. WITHIN 15 DAYS AFTER THEIR DELIVERY REFUSAL. </div>

      <div className="mt-4 border border-black"> </div>

      <p className="mt-6 ml-4 text-center">Delivered By:</p>
      <p className="mt-1 mb-4 ml-4 text-center">Recieved By:</p>


      <div className="mt-auto">
        <img src={footer} alt='Footer' />
      </div>

      
      <div className="flex justify-center mt-10 mb-10">
        <button onClick={() => generatePdf(componentRef, { filename: 'delivery_note.pdf' })} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Generate PDF</button>
      </div>


    </div>
  )
}

export default DeliveryNotePage