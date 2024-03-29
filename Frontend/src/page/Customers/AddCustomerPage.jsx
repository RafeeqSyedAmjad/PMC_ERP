import { Navbar } from "@/components/ComponentExport"
import { toastProps } from "@/constants";
import { useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddCustomerPage() {
  const navigate = useNavigate();
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
    contacts:[], // Array to store contact details
  });

  // state to manage visibility of contact details fields
  const [shadowContactFields, setShowContactFields] = useState(false);

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

  let storedToken = localStorage.getItem('token');



  const handleAddCustomer = () => {
    if (isFormValid()) {
      // Prepare data for POST request
      // Validate mobile number format
      const mobileNumberRegex = /^\d{10}$/;
      if (!mobileNumberRegex.test(customerDetails.customerPhone)) {
        toast.error('Please enter a 10-digit mobile number.');
        return;
      }

      // Validate VAT number format
      const vatNumberRegex = /^\d{15}$/;
      if (!vatNumberRegex.test(customerDetails.customerVat)){
        toast.error('Please enter a 15-digit vat number.')
      }
      
      const postData = {
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        customerArea: customerDetails.customerArea,
        customerCity: customerDetails.customerCity,
        customerZip: customerDetails.customerZip,
        customerStreet: customerDetails.customerStreet,
        customerMap: customerDetails.customerMap,
        customerVat: customerDetails.customerVat,
        customerType: customerDetails.customerType,
        contacts: [
          {
            contactName: customerDetails.contactName,
            contactMobile: customerDetails.contactMobile,
            contactDesignation: customerDetails.contactDesignation,
            contactEmail: customerDetails.contactEmail,
          },
        ],
      };

      // Make the API request using fetch
      fetch('https://pmcsaudi-uat.smaftco.com:3083/api/customers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,

          // Add any other headers if needed
        },
        body: JSON.stringify(postData),
      })
        .then(response => response.json())
        .then(data => {
          toast.success('Customer created successfully!');
          console.log('Success:', data);

          // Redirect to customer list page or update state as needed
          navigate(`/customers`);
        })
        .catch((error) => {
          toast.error('Error creating customer. Please try again.');
          console.error('Error:', error);
        });
    } else {
      // Show an indication for required fields that are not filled
      toast.error("You need to fill all the required fields!", toastProps);
    }
  };


  // Function to add contact details
  const addContact = () => {
    setShowContactFields(true); // Show the contact details fields
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      contacts: [...prevDetails.contacts, {}], // Add an empty object for a new contact
    }));
  };

  // Function to handle changes in contact details input fields
  const handleContactInputChange = (e, index) => {
    const { name, value } = e.target;
    console.log(`Updating contact field ${name} with value: ${value}`);
    const updatedContacts = [...customerDetails.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [name]: value };
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      contacts: updatedContacts,
    }));
  };


  return (
    <div>
      <Navbar />
      <div className="container p-6 mx-auto mt-8 bg-white rounded-md shadow-xl max-w-auto">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Add Customer</h1>
        <form>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="mb-4">
              <label htmlFor="customerName" className="text-sm font-medium text-gray-600 ">
                Customer Name
                <span className="text-red-500">*</span>
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
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="customerEmail" className="text-sm font-medium text-gray-600 ">
                Email
                <span className="text-red-500">*</span>
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
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="customerPhone" className="text-sm font-medium text-gray-600 ">
                Mobile Number
                <span className="text-red-500">*</span>
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
                required
              />
              <p className="text-gray-500">Please enter a 10-digit mobile number. </p>

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
                <span className="text-red-500">*</span>
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
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="customerStreet" className="text-sm font-medium text-gray-600 ">
                Street
                <span className="text-red-500">*</span>
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
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="customerCity" className="text-sm font-medium text-gray-600 ">
                City
                <span className="text-red-500">*</span>
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
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="customerZip" className="text-sm font-medium text-gray-600 ">
                Zipcode
                <span className="text-red-500">*</span>
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
                required
              />
            </div>


            <div className="mb-4">
              <label htmlFor="customerVat" className="text-sm font-medium text-gray-600 ">
                VAT Number
                <span className="text-red-500">*</span>
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
                required
              />
              <p className="text-gray-500">Please enter a 15-digit VAT number. </p>
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
                <span className="text-red-500">*</span>
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
            

            {/* Contact details fields */}
            {/* Contact details fields */}
            {shadowContactFields && customerDetails.contacts.map((contact, index) => (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2" key={index}>
                <div className="mb-4">
                  <label htmlFor={`contactName${index}`} className="block text-sm font-medium text-gray-600">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id={`contactName${index}`}
                    name={`contactName${index}`}
                    value={contact.contactName || ""}
                    onChange={(e) => handleContactInputChange(e, index)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor={`contactMobile${index}`} className="block text-sm font-medium text-gray-600">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    id={`contactMobile${index}`}
                    name={`contactMobile${index}`}
                    value={contact.contactMobile || ""}
                    onChange={(e) => handleContactInputChange(e, index)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor={`contactDesignation${index}`} className="block text-sm font-medium text-gray-600">
                    Contact Designation
                  </label>
                  <input
                    type="text"
                    id={`contactDesignation${index}`}
                    name={`contactDesignation${index}`}
                    value={contact.contactDesignation || ""}
                    onChange={(e) => handleContactInputChange(e, index)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor={`contactEmail${index}`} className="block text-sm font-medium text-gray-600">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id={`contactEmail${index}`}
                    name={`contactEmail${index}`}
                    value={contact.contactEmail || ""}
                    onChange={(e) => handleContactInputChange(e, index)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addContact}
              className="w-[48%] px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Add Contact
            </button>

            <button
              type="button"
              onClick={handleAddCustomer}
              // disabled={!isFormValid()}
              className="w-[48%] px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              Submit
            </button>
          </div>
          
        </form> 
      </div>
    </div>
  )
}

export default AddCustomerPage