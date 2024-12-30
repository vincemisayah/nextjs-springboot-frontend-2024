'use client'

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import React from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { FcDataConfiguration } from "react-icons/fc";
import { usePathname, useRouter } from "next/navigation";


export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const { push } = useRouter();
    const menuItems = {
        CUSTOMER: {title:"Customer Level",
                   description:"Search the customer and customize the invoice task commission rate for all invoices belonging to that customer.",
                   linkPath:"/commissionConfigs/customerLevel"},
        JOB     : {title:"Job Level",
                   description:"All invoices belonging to a selected job will follow this configuration, overriding the customer level config."},
        INVOICE : {title:"Invoice Level",
                   description:"Set the commission at the invoice-task level.",
                   linkPath:"/commissionConfigs/invoiceLevel"},

    };

    const PopoverMenuItem = ({menuObj}:any) =>{
        return (
            <div>
                <div className={"flex items-center space-x-2"}>
                    <FcDataConfiguration size={23} />
                    <Link href={menuObj.linkPath}
                        size={'sm'}
                        className={"font-semibold hover:cursor-pointer"}>
                        {menuObj.title}
                    </Link>
                </div>
                <div className={"ml-12"}>
                    <p className={'text-[13px] max-w-56'}>
                        {menuObj.description}
                    </p>
                </div>
            </div>

        );
    }

    function getCookieByName(name: string | any[]) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    const logoutUser = () => {
        console.log("logging out . . . ");
        console.log(`${getCookieByName("token")}`);
        // @ts-ignore
        if(getCookieByName("token").length > 0){
            document.cookie = "token=;";
        }
        document.cookie = "token=;";
        push('/login');
    }

    return (
        <>
            {pathname !== '/login'?(
                <NextUINavbar className={'border-b-small border-default-200 dark:border-default-100 dark:bg-[#0c0c0d] dark:bg-opacity-20'}>
                    <NavbarBrand as="li" className="gap-3 max-w-fit">
                        <p className="text-2xl font-extrabold text-inherit text-emerald-600 antialiased">FISHER</p>
                    </NavbarBrand>
                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        <NavbarItem isActive>
                            <Popover radius={'sm'} shadow={'md'} placement={'bottom-start'}>
                                <PopoverTrigger>
                                    <span className={'text-md hover:cursor-pointer'}>Configurations</span>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className={"px-1 py-2"}>
                                        <PopoverMenuItem menuObj={menuItems.CUSTOMER}/>
                                        <PopoverMenuItem menuObj={menuItems.INVOICE}/>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </NavbarItem>
                        <NavbarItem isActive>
                            <Link href="/reports" aria-current="page">
                                Reports
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem className="hidden sm:flex gap-2">
                            <ThemeSwitch />
                        </NavbarItem>
                        <NavbarItem className="hidden lg:flex">
                            {/*<Link href="/login">Logout</Link>*/}
                            <button onClick={logoutUser}>
                                <span>Logout</span>
                            </button>
                        </NavbarItem>
                    </NavbarContent>
                </NextUINavbar>
            ):(
                <NextUINavbar>
                    <NavbarBrand as="li" className={"gap-3 max-w-fit"}>
                        <p className={"text-2xl font-extrabold text-inherit text-emerald-600 antialiased"}>FISHER</p>
                    </NavbarBrand>
                    <NavbarContent justify={"start"}>
                        <NavbarItem className={"hidden sm:flex gap-2"}>
                            <ThemeSwitch />
                        </NavbarItem>
                    </NavbarContent>
                </NextUINavbar>
            )}
        </>
    );
};
