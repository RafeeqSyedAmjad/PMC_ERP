import { Navbar } from "@/components/ComponentExport";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddProductPage() {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    name: "",
    vendor_name: "",
    brand: "",
    short_name: "",
    quantity: "",
    category1: "",
    category2: "",
    category3: "",
    part_number: "",
    unit_of_measure: "select", // Default value
    price1: "",
    price2: "",
    price3: "",
    price4: "",
    price5: "",
    origin: "select", // Default value
    hazard: "select", // Default value
    pdf_file: "",
    specification: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });


  // Define required fields
  const requiredFields = [
    "name",
    "brand",
    "quantity",
    "part_number",
    "unit_of_measure",
    "price1",
    "price2",
    "price3",
    "price4",
    "price5",
    "origin",
    "hazard",
    // "pdf_file", // PDF file is also required
  ];

  // Track validation status for each field
  const [fieldValidation, setFieldValidation] = useState(
    Object.fromEntries(requiredFields.map((field) => [field, true]))
  );

  // Track which image option is selected
  const [addImageButtonClicked, setAddImageButtonClicked] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "file" ? files[0] : value,
    }));
    // Validate the field
    validateField(name, value);
  };

  const validateField = (name, value) => {
    // You can add more specific validation rules if needed
    const isValid = value.trim() !== ""; // Basic validation: Check if the value is not empty
    setFieldValidation((prevValidation) => ({ ...prevValidation, [name]: isValid }));
  };

  const isFormValid = () => {
    // Check if all required fields have non-empty values
    return requiredFields.every((field) => productDetails[field].trim() !== "");
  };

  const handleAddProduct = () => {
    if (isFormValid()) {
      // Prepare data for POST request
      const formData = new FormData();

      Object.entries(productDetails).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Make the API request using fetch
      fetch("https://pmcsaudi-uat.smaftco.com:3083/api/products/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Product created successfully!");
          console.log("Success:", data);

          // Redirect to product list page or update state as needed
          navigate(`/products`);
        })
        .catch((error) => {
          toast.error("Error creating product. Please try again.");
          console.error("Error:", error);
        });
    } else {
      // Show an indication for required fields that are not filled
      toast.error("You need to fill all the required fields!");
    }
  };

  const handleImageOptionClick = () => {
    setAddImageButtonClicked(true);
  };

  return (
    <div>
      <Navbar />
      <div className="container p-6 mx-auto mt-8 bg-white rounded-md shadow-xl max-w-auto">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Add Product</h1>
        <form id="productForm" encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="mb-4">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productDetails.name}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.name ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="vendor_name" className="text-sm font-medium text-gray-700">
                Vendor Name
              </label>
              <input
                type="text"
                id="vendor_name"
                name="vendor_name"
                value={productDetails.vendor_name}
                onChange={handleInputChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"

                value={productDetails.brand}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.brand ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="short_name" className="text-sm font-medium text-gray-700">
                Short Name
              </label>
              <input
                type="text"
                id="short_name"
                name="short_name"

                value={productDetails.short_name}
                onChange={handleInputChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"

                value={productDetails.quantity}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.quantity ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category1" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="category2" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="category3" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="part_number" className="block text-sm font-medium text-gray-700">
                Part Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="part_number"
                name="part_number"
                value={productDetails.part_number}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.part_number ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="unit_of_measure" className="block text-sm font-medium text-gray-700">
                Unit of Measure <span className="text-red-500">*</span>
              </label>
              <select
                id="unit_of_measure"
                name="unit_of_measure"
                value={productDetails.unit_of_measure}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.unit_of_measure ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              >
                <option value="select" disabled>Select Unit</option>
                <option value="meters">Meters</option>
                <option value="kg">Kg</option>
                <option value="liters">Liters</option>
                <option value="pieces">Pieces</option>
                <option value="set">Set</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Price 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price1"
                name="price1"
                value={productDetails.price1}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.price1 ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price2" className="block text-sm font-medium text-gray-700">
                Price 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price2"
                name="price2"
                value={productDetails.price2}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.price2 ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price3" className="block text-sm font-medium text-gray-700">
                Price 3 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price3"
                name="price3"
                value={productDetails.price3}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.price3 ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price4" className="block text-sm font-medium text-gray-700">
                Price 4 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price4"
                name="price4"
                value={productDetails.price4}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.price4 ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price5" className="block text-sm font-medium text-gray-700">
                Price 5 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price5"
                name="price5"
                value={productDetails.price5}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.price5 ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                Country of Origin <span className="text-red-500">*</span>
              </label>
              <select
                id="origin"
                name="origin"
                value={productDetails.origin}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.origin ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              >
                <option value="select" selected disabled>Select Country</option>
                <option value="USA">USA</option>
                <option value="EUROPE">EUROPE</option>
                <option value="CHINA">CHINA</option>
                <option value="INDIA">INDIA</option>
                <option value="RUSSIA">RUSSIA</option>
                <option value="TAIWAN">TAIWAN</option>
                <option value="JAPAN">JAPAN</option>
                {/* Add more countries as needed */}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="hazard" className="block text-sm font-medium text-gray-700">
                Hazard or Non-Hazard <span className="text-red-500">*</span>
              </label>
              <select
                id="hazard"
                name="hazard"
                value={productDetails.hazard}
                onChange={handleInputChange}
                className={`mt-1 p-3 block w-full border ${fieldValidation.hazard ? "border-gray-300" : "border-red-800"
                  } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 sm:text-sm`}
                required
              >
                <option value="select" selected disabled>Select Hazard</option>
                <option value="Hazard">Hazard</option>
                <option value="Non-Hazard">Non-Hazard</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="pdf_file" className="text-sm font-medium text-gray-600">
                Product PDF
              </label>
              <input
                type="file"
                id="pdf_file"
                name="pdf_file"
                accept=".pdf"
                onChange={handleInputChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"

              />
            </div>
            <div className="mb-4">
              <label htmlFor="specification" className="mb-2 text-sm font-medium text-gray-700">
                Specification
              </label>
              <textarea
                id="specification"
                rows="4"
                name="specification"
                value={productDetails.specification}
                onChange={handleInputChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your Specifications here..."
              ></textarea>
            </div>
          </div>
          
          {/* Image Options */}
          {addImageButtonClicked && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2, 3, 4].map((option) => (
                <div key={option} className="mb-4">
                  <label className="text-sm font-medium text-gray-600">Image {option}</label>
                  <input
                    type="file"
                    name={`image${option}`}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between ">
            <button
              type="button"
              onClick={handleImageOptionClick}
              className="w-[40%] px-6 py-3 text-center text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Add Image
            </button>

            <button
              type="button"
              onClick={handleAddProduct}
              className="w-[40%] px-6 py-3 text-center text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"

            >
              Add Product
            </button>
          </div>
          

        </form>
      </div>
    </div>
  );
}

export default AddProductPage;
