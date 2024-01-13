import { useEffect, useState } from 'react';
import { Navbar } from '../../components/ComponentExport';
import { FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoTrashBin } from 'react-icons/io5';
import { CiViewBoard } from 'react-icons/ci';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleDelete = async(serviceId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?');
    if (confirmDelete) {
      try {
        // Delete the product from the API
        const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/services/${serviceId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const updatedServices = services.filter((service) => service.id !== serviceId);
          setServices(updatedServices); 
        } else {
          throw new Error('Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/api/services/');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          throw new Error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }

    fetchServices();
  }, []);

  const applyFilters = () => {
    let filteredServices = services.filter((service) => {
      const searchTermLowerCase = searchTerm.toLowerCase();
      return (
        service.id.toString().includes(searchTermLowerCase) ||
        service.type_of_service.toString().includes(searchTermLowerCase) ||
        service.time.toString().includes(searchTermLowerCase) ||
        service.price.toString().includes(searchTermLowerCase)
      );
    });
    return filteredServices;
  };

  const filteredServices = applyFilters();

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className='mb-4'>
          <input
            type="text"
            placeholder="Search by ID, Type of Service, Time, Price"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md md:w-1/2 lg:w-1/3'
          />
        </div>
        <div className='overflow-x-auto'>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-gray-700 uppercase bg-gray-200">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Type of Service</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {currentItems.map((service) => (
                <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3">{service.id}</td>
                  <td className="px-6 py-3">{service.type_of_service}</td>
                  <td className="px-6 py-3">{service.time}</td>
                  <td className="px-6 py-3">{service.price}</td>
                  {/* Implement Actions column here */}
                  <td className="flex flex-col items-center justify-center px-6 py-3 space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-x-3">
                    <Link to={`/services/edit/${service.id}/`} className="text-blue-400" title='Edit Details'>
                      <FaRegEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-400"
                      title='Delete'
                    >
                      <IoTrashBin />
                    </button>
                    <Link to={`/services/view/${service.id}`} className="" title='View'>
                      <CiViewBoard />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-center my-4 space-x-2">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>
          {renderPageNumbers()}
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
