
import { Link, useNavigate, } from 'react-router-dom';
// import {useRecoilValue} from 'recoil';
// import {isAuthenticatedState} from '../../atoms/authState';

import logo from '../../assets/logo.png';
import NavLinks from './NavLinks';
import Button from './Button';
import { CgMenu } from "react-icons/cg";
import { useState } from 'react';
import { MdClose } from "react-icons/md";

export default function Navbar() {
   
    const [open,setOpen] = useState(false)
    // const isAuthenticated = useRecoilValue(isAuthenticatedState);
    // const location = useLocation();

    // if(!isAuthenticated || location.pathname === '/login'){
    //     return null;
    // }

    const Navigate = useNavigate();

    const handleLogout = () => {
        // Perform any logout logic here

        // Redirect to the login page
        Navigate('/login');
    };

    return (
        <nav className='bg-[#B4D4FF]'>

            <div className='flex items-center justify-around font-medium'>
                <div className='z-50 flex justify-between w-full p-5 md:w-auto'>
                    <img src={logo} alt='logo' className='md:cursor-pointer h-9' />
                    <div className='text-3xl md:hidden' onClick={()=>setOpen(!open)}>
                        {open ? <MdClose /> : <CgMenu />}
                    </div>
                </div>
                <ul className='items-center hidden gap-8 md:flex upppercase'>
                    <li>
                        <Link to="/" className="px-3 text-black py-7 hover:text-gray-200">Home</Link>

                    </li>
                    <li>
                        <Link to="/customers" className="px-3 text-black hover:text-gray-200">Customers</Link>

                    </li>
                    <li>
                        <Link to="/products" className="px-3 text-black hover:text-gray-200">Products</Link>

                    </li>
                    <li>
                        <Link to="/services" className="px-3 text-black hover:text-gray-200">Services</Link>

                    </li>
                    <li>
                        <Link to="/quotations" className="px-3 text-black hover:text-gray-200">Quotations</Link>
                    </li>
                    <li>
                        <Link to="/invoicing" className="px-3 text-black hover:text-gray-200">Invocing</Link>
                    </li>
                    <NavLinks />
                </ul>
                <div className='hidden md:block'>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
                
                {/*Mobile Nav*/}
                <ul className= {`
                    md:hidden bg-[#B4D4FF] fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4
                    duration-500  ${open ? "left-0" : "left-[-100%]"}
                `}>
                    <div className='mb-10'>
                        <li>
                            <Link to="/" className="px-3 mb-10 text-black py-7 hover:text-gray-200">Home</Link>

                        </li>
                    </div>
                    
                    <div className='mb-10'>
                        <li>
                            <Link to="/customers" className="px-3 text-black hover:text-gray-200">Customers</Link>

                        </li>
                    </div>

                    <div className='mb-10'>
                        <li>
                            <Link to="/products" className="px-3 text-black hover:text-gray-200">Products</Link>

                        </li>
                    </div>
                    
                    

                    <div className='mb-10'>
                        <li>
                            <Link to="/services" className="px-3 text-black hover:text-gray-200">Services</Link>

                        </li>
                    </div>
                    
                    <div className='mb-10'>
                        <li>
                            <Link to="/quotations" className="px-3 text-black hover:text-gray-200">Quotations</Link>
                        </li>
                    </div>
                    
                    <div className='mb-6'>
                        <li>
                            <Link to="/invoicing" className="px-3 text-black hover:text-gray-200">Invocing</Link>
                        </li>
                    </div>
                    
                    <NavLinks />
                    <div className="py-5">
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                </ul>
            </div>

        </nav>
    );
}
