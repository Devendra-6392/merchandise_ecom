import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { BoxIconLine, ChevronDownIcon, GridIcon, HorizontaLDots, PaperPlaneIcon, PencilIcon, PieChartIcon, TableIcon, TaskIcon, UserCircleIcon, } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
const navSections = [
    {
        id: "store",
        title: "Store & Operations",
        items: [
            {
                icon: <GridIcon />,
                name: "Dashboard",
                path: "/",
            },
            {
                icon: <BoxIconLine />,
                name: "Merchandise Catalog",
                subItems: [
                    { name: "Products List", path: "/products" },
                    { name: "Add New Product", path: "/products/add" },
                ],
            },
            {
                icon: <TaskIcon />,
                name: "Orders & Approvals",
                subItems: [
                    { name: "All Orders", path: "/basic-tables" },
                    { name: "Artwork Approvals", path: "/blank", new: true },
                ],
            },
            {
                icon: <PencilIcon />,
                name: "Print Studio",
                path: "/blank",
            },
            {
                icon: <PaperPlaneIcon />,
                name: "Shipping & Logistics",
                path: "/calendar",
            },
        ],
    },
    {
        id: "analytics",
        title: "Analytics & Reports",
        items: [
            {
                icon: <PieChartIcon />,
                name: "Sales Analytics",
                subItems: [
                    { name: "Revenue Trends", path: "/line-chart" },
                    { name: "Category Charts", path: "/bar-chart" },
                ],
            },
            {
                icon: <TableIcon />,
                name: "Data Tables",
                path: "/basic-tables",
            },
        ],
    },
    {
        id: "account",
        title: "Account",
        items: [
            {
                icon: <UserCircleIcon />,
                name: "User Profile",
                path: "/profile",
            },
        ],
    },
];
const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});
    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);
    useEffect(() => {
        let submenuMatched = false;
        navSections.forEach((section) => {
            section.items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                sectionId: section.id,
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive]);
    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.sectionId}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);
    const handleSubmenuToggle = (index, sectionId) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (prevOpenSubmenu &&
                prevOpenSubmenu.sectionId === sectionId &&
                prevOpenSubmenu.index === index) {
                return null;
            }
            return { sectionId, index };
        });
    };
    const renderMenuItems = (items, sectionId) => (<ul className="flex flex-col gap-2">
        {items.map((nav, index) => (<li key={nav.name}>
            {nav.subItems ? (<button onClick={() => handleSubmenuToggle(index, sectionId)} className={`menu-item group ${openSubmenu?.sectionId === sectionId && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"}`}>
                <span className={`menu-item-icon-size ${openSubmenu?.sectionId === sectionId && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (<span className="menu-item-text">{nav.name}</span>)}
                {(isExpanded || isHovered || isMobileOpen) && (<ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.sectionId === sectionId &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""}`} />)}
            </button>) : (nav.path && (<Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (<span className="menu-item-text">{nav.name}</span>)}
            </Link>))}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (<div ref={(el) => {
                subMenuRefs.current[`${sectionId}-${index}`] = el;
            }} className="overflow-hidden transition-all duration-300" style={{
                height: openSubmenu?.sectionId === sectionId && openSubmenu?.index === index
                    ? `${subMenuHeight[`${sectionId}-${index}`]}px`
                    : "0px",
            }}>
                <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (<li key={subItem.name}>
                        <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"}`}>
                            {subItem.name}
                            <span className="flex items-center gap-1 ml-auto">
                                {subItem.new && (<span className={`ml-auto ${isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
                                    new
                                </span>)}
                                {subItem.pro && (<span className={`ml-auto ${isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
                                    pro
                                </span>)}
                            </span>
                        </Link>
                    </li>))}
                </ul>
            </div>)}
        </li>))}
    </ul>);
    return (<aside className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
                ? "w-[290px]"
                : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`} onMouseEnter={() => !isExpanded && setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
            <Link to="/" className="flex items-center gap-3">
                {isExpanded || isHovered || isMobileOpen ? (<div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white font-bold text-lg shadow-md shadow-brand-500/20">
                        M
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white leading-tight tracking-wide text-base">
                            Merch<span className="text-brand-500">Studio</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                            E-Commerce Portal
                        </span>
                    </div>
                </div>) : (<div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white font-bold text-lg shadow-md shadow-brand-500/20">
                    M
                </div>)}
            </Link>
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar grow">
            <nav className="mb-6">
                <div className="flex flex-col gap-6">
                    {navSections.map((section) => (<div key={section.id}>
                        <h2 className={`mb-3 text-[11px] font-semibold uppercase tracking-wider flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded && !isHovered
                            ? "lg:justify-center"
                            : "justify-start"}`}>
                            {isExpanded || isHovered || isMobileOpen ? (section.title) : (<HorizontaLDots className="size-5" />)}
                        </h2>
                        {renderMenuItems(section.items, section.id)}
                    </div>))}
                </div>
            </nav>
            {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
        </div>
    </aside>);
};
export default AppSidebar;
