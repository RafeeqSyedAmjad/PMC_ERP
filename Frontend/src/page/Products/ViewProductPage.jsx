import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../components/ComponentExport";
import { useEffect, useState } from "react";

function ViewProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState({
        // ... (your initial state)
    });
    const [isFullscreen, setIsFullscreen] = useState(false);

    let storedToken = localStorage.getItem('token');


    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const response = await fetch(`https://pmcsaudi-uat.smaftco.com:3083/api/products/${productId}/`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`, // Include Bearer token in headers
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProductDetails(data);
                    console.log(productDetails)
                } else {
                    throw new Error('Failed to fetch product details');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        }

        fetchProductDetails();
    }, [productId, storedToken, productDetails]);

    return (
        <div>
            <Navbar />
            <div className="container p-6 mx-auto mt-8 bg-white rounded-md shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-center text-blue-500">Product Details</h1>
                <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {renderField("Product ID", productDetails.id)}
                    {renderField("Name", productDetails.name)}
                    {renderField("Vendor Name", productDetails.vendor_name)}
                    {renderField("Brand", productDetails.brand)}
                    {renderField("Short Name", productDetails.short_name)}
                    {renderField("Quantity", productDetails.quantity)}
                    {renderField("Category 1", productDetails.category1)}
                    {renderField("Category 2", productDetails.category2)}
                    {renderField("Category 3", productDetails.category3)}
                    {renderField("Part Number", productDetails.part_number)}
                    {renderField("Unit of Measure", productDetails.unit_of_measure)}
                    {/* Prices */}
                    {/* ... Add similar code for prices */}
                    {renderField("Country Of Origin", productDetails.origin)}
                    {renderField("Hazard", productDetails.hazard)}
                    {renderField("Product PDF", productDetails.pdf_file)}
                    {/* Images */}
                    {productDetails.image1 && renderImage("Image 1", productDetails.image1)}
                    {productDetails.image2 && renderImage("Image 2", productDetails.image2)}
                    {productDetails.image3 && renderImage("Image 3", productDetails.image3)}
                    {productDetails.image4 && renderImage("Image 4", productDetails.image4)}
                    {/* Product Parts */}
                    {/* {productDetails.parts.length > 0 && renderField("Product Parts", productDetails.parts)} */}
                    {renderField("Specification", productDetails.specification)}
                    {/* Back button */}
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 md:col-span-2"
                    >
                        Back
                    </button>
                </form>
            </div>
        </div>
    );

    // Helper functions for rendering fields and images
    function renderField(label, value) {
        return value && (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">{label}</label>
                <div className="readonly-field">{value}</div>
            </div>
        );
    }

    function renderImage(label, src) {
        
        return (
            <div className = {`mb-4 relative`}>
        <label className="block text-sm font-medium text-gray-600">{label}</label>
        <img
          src={src}
          alt={`${label} Preview`}
          className={`object-contain w-full h-64 mb-2 rounded-md cursor-pointer`}
          onClick={() => setIsFullscreen(!isFullscreen)}
        />

    {
        isFullscreen && (
            <div
                className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black"
                onClick={() => setIsFullscreen(false)}
            >
                <img
                    src={src}
                    alt={`${label} Fullscreen Preview`}
                    className="object-contain max-w-full max-h-full"
                />
            </div>
        )
    }
      </div >
        );
    }
}

export default ViewProductPage;
