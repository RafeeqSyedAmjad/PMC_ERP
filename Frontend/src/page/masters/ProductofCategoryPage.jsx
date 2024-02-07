import { useEffect, useState } from 'react';
import { Navbar } from '../../components/ComponentExport';
import { IoTrashBin } from 'react-icons/io5';
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';

function ProductofCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  let storedToken = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  },);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/product-categories/', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      try {
        const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/product-categories/${categoryId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        });
        if (response.ok) {
          const updatedCategories = categories.filter((category) => category.id !== categoryId);
          setCategories(updatedCategories);
          toast.success('Category Deleted Sucessfully')
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const createCategory = async () => {
    try {
      const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/product-categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          categoryName: newCategoryName,
          categoryDescription: newCategoryDescription,
          created_on: new Date().toISOString(),
          updated_on: new Date().toISOString()
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]); // Add the new category to the state
        closeModal(); // Close the modal after successful creation
        toast.success('Category Created Sucessfully')
      } else {
        // throw new Error('Failed to create category');
        toast.error('Failed to Create Category')
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexofLastItem = currentPage * itemsPerPage;
  const indexofFirstItem = indexofLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexofFirstItem, indexofLastItem);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
      <div className="container px-4 py-8 mx-auto overflow-x-auto ">
        <div className="flex justify-end mb-4">
          <button
            onClick={openModal}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Add
          </button>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="p-8 bg-white rounded-lg">
              <div className='flex justify-between mb-6'>
                <h1 className="text-xl font-bold ">Add Category</h1>
                <button onClick={closeModal} className="">
                  <RxCross2 className="text-2xl text-black hover:text-gray-800" />
                </button>
              </div>
             
              <label htmlFor="categoryName" className="block mb-2 font-bold text-black">Category Name</label>
              <input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              />
              <label htmlFor="categoryDescription" className="block mb-2 font-bold text-black">Category Description</label>
              <textarea
                id="categoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              ></textarea>
              <button
                onClick={createCategory}
                className="px-5 py-2 text-white bg-blue-500 rounded-lg"
              >
                Create Category
              </button>
            </div>
          </div>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Category Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="overflow-x-auto table-wrap">
          <table className="w-full table-auto table-responsive">
            <thead>
              <tr className="text-gray-700 uppercase bg-gray-200">
                <th className="px-6 py-3 text-left">Category Name</th>
                <th className="px-6 py-3 text-left">Category Description</th>
                <th className="px-6 py-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {currentItems.map((category) => (
                <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3">{category.categoryName}</td>
                  <td className="px-6 py-3">{category.categoryDescription}</td>
                  <td className="flex items-center justify-center px-6 py-3">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-400"
                      title="Delete"
                    >
                      <IoTrashBin />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  );
}

export default ProductofCategoryPage;
