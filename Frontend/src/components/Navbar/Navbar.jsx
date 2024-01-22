
import { Link, } from 'react-router-dom';
// import {useRecoilValue} from 'recoil';
// import {isAuthenticatedState} from '../../atoms/authState';

import logo from '../../assets/logo.png';

export default function Navbar() {
    // const isAuthenticated = useRecoilValue(isAuthenticatedState);
    // const location = useLocation();

    // if(!isAuthenticated || location.pathname === '/login'){
    //     return null;
    // }
    return (
        <nav className="bg-[#86A7FC] shadow-lg">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                        <img src={logo} alt="Logo" className="h-8 mr-4" />
                        <Link to="/" className="text-lg font-semibold text-white hover:text-gray-200">
                            Home
                        </Link>
                        <Link to="/customers" className="ml-6 text-white hover:text-gray-200">
                            Customers
                        </Link>
                        <Link to="/products" className="ml-6 text-white hover:text-gray-200">
                            Products
                        </Link>
                        <Link to="/services" className="ml-6 text-white hover:text-gray-200">
                            Services
                        </Link>
                        <Link to="/quotations" className="ml-6 text-white hover:text-gray-200">
                            Quotations
                        </Link>
                    </div>
                    <div>
                        <Link to="/logout" className="font-semibold text-white hover:text-gray-200">
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
