import { useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronUp, IoChevronDownSharp } from "react-icons/io5";
import { links } from "./Mylinks";

const NavLinks = () => {
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState("");

    return (
        <>
            {links.map((link, linkIndex) => (
                <div key={linkIndex}>
                    <div className="px-3 text-left md:cursor-pointer group">
                        <h1
                            className="flex items-center justify-between pr-5 text-black py-7 md:pr-0 group"
                            onClick={() => {
                                heading !== link.name ? setHeading(link.name) : setHeading("");
                                setSubHeading("");
                            }}
                        >
                            {link.name}
                            <span className="inline text-xl md:hidden">
                                {heading === link.name ? <IoChevronUp /> : <IoChevronDownSharp />}
                            </span>
                            <span className="hidden text-xl md:mt-1 md:ml-2 md:block group-hover:rotate-180 group-hover:-mt-2">
                                <IoChevronDownSharp />
                            </span>
                        </h1>
                        {link.submenu && (
                            <div>
                                <div className="absolute hidden top-20 group-hover:md:block hover:md:block">
                                    <div className="py-3">
                                        <div className="absolute w-4 h-4 mt-1 rotate-45 bg-[#B4D4FF] left-3"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-10 p-5 bg-[#B4D4FF]">
                                        {link.sublinks.map((mysublinks, sublinkIndex) => (
                                            <div key={sublinkIndex}>
                                                <h1 className="text-lg font-semibold text-black hover:text-white">
                                                    {mysublinks.Head}
                                                </h1>
                                                {mysublinks.sublink && (
                                                    <ul>
                                                        {mysublinks.sublink.map((slink, slinkIndex) => (
                                                            <li key={slinkIndex} className="text-sm text-black my-2.5">
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
                        {link.sublinks.map((slinks, slinkIndex) => (
                            <div key={slinkIndex}>
                                <div>
                                    <h1
                                        onClick={() =>
                                            subHeading !== slinks.Head
                                                ? setSubHeading(slinks.Head)
                                                : setSubHeading("")
                                        }
                                        className="flex items-center justify-between py-4 pr-5 font-semibold text-black cursor-pointer pl-7 md:pr-0 hover:text-white"
                                    >
                                        {slinks.Head}
                                    </h1>
                                    <div className={`${subHeading === slinks.Head ? "md:hidden" : "hidden"}`}>
                                        {slinks.sublink && (
                                            <ul>
                                                {slinks.sublink.map((slink, slinkIndex) => (
                                                    <li key={slinkIndex} className="py-3 pl-14">
                                                        <Link to={slink.link}>{slink.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

export default NavLinks;
