import { Navbar } from "@/components/ComponentExport"
import { toastProps } from "@/constants";
import { useState } from "react"
import toast from "react-hot-toast";

function AddCustomerPage() {

  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerArea: '',
    customerCity: '',
    customerZip: '',
    customerStreet: '',
    customerMap: '',
    customerVat: '',
    customerType: 'Retail', // Default value
    contactName: '',
    contactMobile: '',
    contactDesignation: '',
    contactEmail: '',
  });

  // Define required fields
  const requiredFields = [
    "customerName",
    "customerEmail",
    "customerPhone",
    "customerArea",
    "customerCity",
    "customerZip",
    "customerType",
    "customerVat",
    "customerStreet",
  ];

  // Track validation status for each field
  const [fieldValidation, setFieldValidation] = useState(
    Object.fromEntries(requiredFields.map((field) => [field, true]))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
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
    return requiredFields.every((field) => customerDetails[field].trim() !== "");
  };


  const handleAddCustomer = () => {
    if (isFormValid()) {
      // Perform your add customer logic here
      console.log("Adding customer:", customerDetails);

    } else {
      // Show an indication for required fields that are not filled
      console.log("u cant add")
      toast.error("You need to fill all the required fields!", toastProps);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="container max-w-md p-6 mx-auto mt-8 bg-white rounded-md shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Add Customer</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="customerName" className="text-sm font-medium text-gray-600 ">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={customerDetails.customerName}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerName ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerName ? '' : 'Please fill this required field'}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="customerEmail" className="text-sm font-medium text-gray-600 ">
              Email
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={customerDetails.customerEmail}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerEmail ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerEmail ? '' : 'Please fill this required field'}

            />
          </div>
          <div className="mb-4">
            <label htmlFor="customerPhone" className="text-sm font-medium text-gray-600 ">
              Mobile Number
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={customerDetails.customerPhone}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerPhone ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerPhone ? '' : 'Please fill this required field'}

            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              id="customerAddress"
              name="customerAddress"
              value={customerDetails.customerArea}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div> */}
          <div className="mb-4">
            <label htmlFor="customerArea" className="text-sm font-medium text-gray-600 ">
              Area
            </label>
            <input
              type="text"
              id="customerArea"
              name="customerArea"
              value={customerDetails.customerArea}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerArea ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerArea ? '' : 'Please fill this required field'}

            />
          </div>
          <div className="mb-4">
            <label htmlFor="customerStreet" className="text-sm font-medium text-gray-600 ">
              Street
            </label>
            <input
              type="text"
              id="customerStreet"
              name="customerStreet"
              value={customerDetails.customerStreet}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerStreet ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerStreet ? '' : 'Please fill this required field'}

            />
          </div>

          <div className="mb-4">
            <label htmlFor="customerCity" className="text-sm font-medium text-gray-600 ">
              City
            </label>
            <input
              type="text"
              id="customerCity"
              name="customerCity"
              value={customerDetails.customerCity}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerCity ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerCity ? '' : 'Please fill this required field'}

            />
          </div>
          <div className="mb-4">
            <label htmlFor="customerZip" className="text-sm font-medium text-gray-600 ">
              Zipcode
            </label>
            <input
              type="text"
              id="customerZip"
              name="customerZip"
              value={customerDetails.customerZip}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerZip ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}

              placeholder={fieldValidation.customerZip ? '' : 'Please fill this required field'}

                
            />
          </div>


          <div className="mb-4">
            <label htmlFor="customerVat" className="text-sm font-medium text-gray-600 ">
              VAT Number
            </label>
            <input
              type="text"
              id="customerVat"
              name="customerVat"
              value={customerDetails.customerVat}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerVat ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              placeholder={fieldValidation.customerVat ? '' : 'Please fill this required field'}

            />
          </div>
          <div className="mb-4">
            <label htmlFor="customerMap" className="text-sm font-medium text-gray-600 ">
              Google Maps
            </label>
            <input
              type="text"
              id="customerMap"
              name="customerMap"
              value={customerDetails.customerMap}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="customerType" className="text-sm font-medium text-gray-600 ">
              Customer Type
            </label>
            <select
              id="customerType"
              name="customerType"
              value={customerDetails.customerType}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border ${fieldValidation.customerType ? "border-gray-300" : "border-red-800"
                } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
              // placeholder={fieldValidation.customerVat ? '' : 'Please fill this required field'}

            >
              <option value="retail">Retail</option>
              <option value="b2b">B2B</option>
              <option value="whole_sale">Whole Sale</option>
              <option value="estimated_landed">Estimated Landed</option>
              <option value="factory">Factory</option>
            </select>
          </div>
          {/* <button
            type="button"
            // onClick={handleAddCustomer}
            className="w-full px-6 py-3 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Add Contact
          </button> */}

          <div className="mb-4">
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-600">
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={customerDetails.contactName}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"

            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactMobile" className="block text-sm font-medium text-gray-600">
              Contact Mobile Number
            </label>
            <input
              type="tel"
              id="contactMobile"
              name="contactMobile"
              value={customerDetails.contactMobile}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactDesignation" className="block text-sm font-medium text-gray-600">
              Contact Designation
            </label>
            <input
              type="text"
              id="contactDesignation"
              name="contactDesignation"
              value={customerDetails.contactDesignation}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-600">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={customerDetails.contactEmail}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleAddCustomer}
            disabled={!isFormValid()}
            className="w-full px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCustomerPage