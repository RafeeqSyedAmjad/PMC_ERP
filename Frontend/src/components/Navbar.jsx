
import { Link,useLocation } from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {isAuthenticatedState} from '../atoms/authState';

import logo from '../assets/logo.png';

export default function Navbar() {
    const isAuthenticated = useRecoilValue(isAuthenticatedState);
    const location = useLocation();

    if(!isAuthenticated || location.pathname === '/login'){
        return null;
    }
    return (
        <nav className="flex items-center justify-between p-4 bg-blue-500">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 mr-4" />
                <Link to="/" className="mr-4 text-white">
                    Home
                </Link>
                <Link to="/customers" className="mr-4 text-white">
                    Customers
                </Link>
                <Link to="/products" className="mr-4 text-white">
                    Products
                </Link>
                <Link to="/services" className="mr-4 text-white">
                    Services
                </Link>
                <Link to="/quotations" className="mr-4 text-white">
                    Quotations
                </Link>
            </div>
            <div>
                <Link to="/logout" className="text-white">
                    Logout
                </Link>
            </div>
        </nav>
    );
}
