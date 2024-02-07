import  { useState, useEffect } from 'react';
import { Navbar } from '@/components/ComponentExport';
import { IoEye } from 'react-icons/io5';

function InvoicingPage() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  let storedToken = localStorage.getItem('token');


  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/invoices/', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        throw new Error('Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.customer.toString().includes(searchTerm)
  );

  const indexofLastItem = currentPage * itemsPerPage;
  const indexofFirstItem = indexofLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexofFirstItem, indexofLastItem);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

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
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Customer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="overflow-x-auto table-wrap">
          <table className="w-full table-auto table-responsive">
            <thead>
              <tr className="text-gray-700 uppercase bg-gray-200">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Customers</th>
                <th className="px-6 py-3 text-left">Quotations</th>
                <th className="px-6 py-3 text-left">URL's</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {currentItems.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3">{invoice.invoice_id}</td>
                  <td className="px-6 py-3">{invoice.customer}</td>
                  <td className="px-6 py-3">{invoice.quotation}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => window.open(invoice.pdf_link, '_blank')}
                      className="text-blue-500"
                      title="View"
                    >
                      <IoEye />
                    </button>
                  </td>
                </tr>
              ))}
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

export default InvoicingPage;
