import { Navbar } from "@/components/ComponentExport";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LabourRatePage() {
  const [labourRate, setLabourRate] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const Navigate = useNavigate();


  useEffect(() => {
    if (initialLoad) {
      // Fetch labor rate data when the component mounts
      fetchData();
      setInitialLoad(false);
    }
  }, [initialLoad]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/labor-rates/1/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setLabourRate(data.laborRate);
    } catch (error) {
      console.error('Error fetching labor rate:', error);
    }
  };

  const handleInputChange = (e) => {
    setLabourRate(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/labor-rates/1/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ laborRate: labourRate }),
      });

      if (response.ok) {
        console.log('Labor Rate updated successfully!');
        Navigate('/')
        // You can add additional logic or redirect the user after a successful update
      } else {
        console.error('Error updating Labor Rate:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating Labor Rate:', error);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="container max-w-md p-6 mt-8 rounded-md shadow-xl">
        <h1 className="mb-8 text-3xl font-bold text-center">Labour Rates</h1>

        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="labourRate" className="block mb-2 text-sm font-medium text-gray-600">
              Labour Rate:
            </label>
            <input
              type="number"
              id="labourRate"
              name="labourRate"
              value={labourRate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <button
            className="w-full px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default LabourRatePage;
