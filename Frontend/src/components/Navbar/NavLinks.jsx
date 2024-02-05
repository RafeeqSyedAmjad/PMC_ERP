import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronUp, IoChevronDownSharp } from "react-icons/io5";
import { links } from "./Mylinks";

const NavLinks = () => {
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState(""); // eslint-disable-line no-unused-vars
    const Navigate = useNavigate();

    const handleLinkClick = (link) => {
        // Handle click logic here
        if (link === 'Labour Rate') {
            Navigate('/configuration/labourRates');
        } else {
            // Handle other links
            Navigate(link);
        }
        setHeading("");
        setSubHeading("");
    };

    return (
        <>
            {links.map((link, linkIndex) => (
                <div key={linkIndex}>
                    <div className="px-3 text-left md:cursor-pointer group">
                        <h1
                            className="flex items-center justify-between pr-5 text-lg font-bold text-black py-7 md:pr-0 group"
                            onClick={() => {
                                heading !== link.name ? setHeading(link.name) : setHeading("");
                                setSubHeading("");
                            }}
                        >
                            {link.name}
                            <span className="inline text-lg font-bold md:hidden">
                                {heading === link.name ? <IoChevronUp /> : <IoChevronDownSharp />}
                            </span>
                            <span className="hidden text-lg font-bold md:mt-1 md:ml-2 md:block group-hover:rotate-180 group-hover:-mt-2">
                                <IoChevronDownSharp />
                            </span>
                        </h1>
                        {link.submenu && (
                            <div>
                                <div className={`absolute hidden top-20 group-hover:md:block hover:md:block`}>
                                    <div className="py-3">
                                        <div className="absolute w-4 h-4 mt-1 rotate-45 bg-[#B4D4FF] left-3"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-10 p-5 bg-[#B4D4FF]">
                                        {link.sublinks.map((mysublinks, sublinkIndex) => (
                                            <div key={sublinkIndex}>
                                                <h1
                                                    className="text-lg font-bold text-black hover:text-white"
                                                    onClick={() => handleLinkClick(mysublinks.Head)}
                                                >
                                                    {mysublinks.Head}
                                                </h1>
                                                {mysublinks.sublink && (
                                                    <ul>
                                                        {mysublinks.sublink.map((slink, slinkIndex) => (
                                                            <li key={slinkIndex} className="text-lg font-bold text-black my-2.5">
                                                                <Link to={slink.link} className="hover:text-[#EEF5FF]">
                                                                    {slink.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Mobile menus */}
                    <div
                        className={`
            ${heading === link.name ? "md:hidden" : "hidden"}
          `}
                    >
                        {link.sublinks && (
                            <ul>
                                {link.sublinks.map((slinks, slinkIndex) => (
                                    <li key={slinkIndex} className="py-3 pl-14">
                                        <span onClick={() => handleLinkClick(slinks.Head)}>{slinks.Head}</span>
                                        {slinks.sublink && (
                                            <ul>
                                                {slinks.sublink.map((slink, slinkIndex) => (
                                                    <li key={slinkIndex} className="py-3 pl-14">
                                                        <Link to={slink.link}>{slink.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default NavLinks;
