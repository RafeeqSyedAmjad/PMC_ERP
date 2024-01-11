import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../components/ComponentExport';

function EditProductPage() {
  const { productId } = useParams();

  const [productDetails, setProductDetails] = useState({
    name: '',
    vendorName: '',
    brand: '',
    shortName: '',
    quantity: '',
    category1: '',
    category2: '',
    category3: '',
    partNumber: '',
    unitOfMeasure: '',
    price1: '',
    price2: '',
    price3: '',
    price4: '',
    price5: '',
    countryOfOrigin: '',
    hazardOrNonHazard: '',
    productPDF: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    specification: '',
  });

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/products/${productId}/`);
        if (response.ok) {
          const data = await response.json();
          setProductDetails(data);
        } else {
          throw new Error('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/products/${productId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDetails),
      });

      if (response.ok) {
        console.log('Product updated successfully!');
        // Redirect or handle navigation as needed
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container max-w-md p-6 mx-auto mt-8 bg-white rounded-md shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Edit Product</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productDetails.name}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-600">
              Vendor Name
            </label>
            <input
              type="text"
              id="vendorName"
              name="vendorName"
              value={productDetails.vendorName}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-600">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={productDetails.brand}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="shortName" className="block text-sm font-medium text-gray-600">
              Short Name
            </label>
            <input
              type="text"
              id="shortName"
              name="shortName"
              value={productDetails.shortName}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={productDetails.quantity}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category1" className="block text-sm font-medium text-gray-600">
              Category 1
            </label>
            <input
              type="text"
              id="category1"
              name="category1"
              value={productDetails.category1}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category2" className="block text-sm font-medium text-gray-600">
              Category 2
            </label>
            <input
              type="text"
              id="category2"
              name="category2"
              value={productDetails.category2}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category3" className="block text-sm font-medium text-gray-600">
              Category 3
            </label>
            <input
              type="text"
              id="category3"
              name="category3"
              value={productDetails.category3}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="partNumber" className="block text-sm font-medium text-gray-600">
              Part Number
            </label>
            <input
              type="text"
              id="partNumber"
              name="partNumber"
              value={productDetails.partNumber}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="unitOfMeasure" className="block text-sm font-medium text-gray-600">
              Unit of Measure
            </label>
            <input
              type="text"
            id="unitOfMeasure"
            name="unitOfMeasure"
            value={productDetails.unitOfMeasure}
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div> 
          <div className="mb-4">
            <label htmlFor="price1" className="block text-sm font-medium text-gray-600">
              Price 1
            </label>
            <input
              type="text"
              id="price1"
              name="price1"
              value={productDetails.price1}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price2" className="block text-sm font-medium text-gray-600">
              Price 2
            </label>
            <input
              type="text"
              id="price2"
              name="price2"
              value={productDetails.price2}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price3" className="block text-sm font-medium text-gray-600">
              Price 3
            </label>
            <input
              type="text"
              id="price3"
              name="price3"
              value={productDetails.price3}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price4" className="block text-sm font-medium text-gray-600">
              Price 4
            </label>
            <input
              type="text"
              id="price4"
              name="price4"
              value={productDetails.price4}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price5" className="block text-sm font-medium text-gray-600">
              Price 5
            </label>
            <input
              type="text"
              id="price5"
              name="price5"
              value={productDetails.price5}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-600">
              Country of Origin
            </label>
            <input
              type="text"
              id="countryOfOrigin"
              name="countryOfOrigin"
              value={productDetails.countryOfOrigin}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="hazardOrNonHazard" className="block text-sm font-medium text-gray-600">
              Hazard or Non-Hazard
            </label>
            <select
              id="hazardOrNonHazard"
              name="hazardOrNonHazard"
              value={productDetails.hazardOrNonHazard}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">Select...</option>
              <option value="Hazard">Hazard</option>
              <option value="Non-Hazard">Non-Hazard</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="productPDF" className="block text-sm font-medium text-gray-600">
              Product PDF
            </label>
            <input
              type="text"
              id="productPDF"
              name="productPDF"
              value={productDetails.productPDF}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image1" className="block text-sm font-medium text-gray-600">
              Image 1
            </label>
            <input
              type="file"
              id="image1"
              name="image1"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image2" className="block text-sm font-medium text-gray-600">
              Image 2
            </label>
            <input
              type="file"
              id="image2"
              name="image2"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image3" className="block text-sm font-medium text-gray-600">
              Image 1
            </label>
            <input
              type="file"
              id="image3"
              name="image3"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image1" className="block text-sm font-medium text-gray-600">
              Image 4
            </label>
            <input
              type="file"
              id="image4"
              name="image4"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="specification" className="block text-sm font-medium text-gray-600">
              Specification
            </label>
            <textarea
              id="specification"
              name="specification"
              value={productDetails.specification}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full p-3 mt-4 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:border-blue-700"
            onClick={handleUpdateProduct}
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductPage;