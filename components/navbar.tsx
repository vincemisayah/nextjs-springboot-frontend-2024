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
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import React from "react";
import { ChevronDown, Eye } from "@nextui-org/shared-icons";
import { FcDataConfiguration } from "react-icons/fc";
import { ThemeSwitch } from "@/components/theme-switch";


export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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


  return (
      <NextUINavbar>
          <NavbarBrand as="li" className="gap-3 max-w-fit">
              {/*<NextLink className="flex justify-start items-center gap-1" href="/home">*/}
                  <p className="text-2xl font-extrabold text-inherit text-emerald-600 antialiased">FISHER</p>
              {/*</NextLink>*/}
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
              <Dropdown>
                  <NavbarItem>
                      <DropdownTrigger>
                          <Button
                              disableRipple
                              className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                              radius="sm"
                              variant="light"
                          >
                              Configurations
                          </Button>
                      </DropdownTrigger>
                  </NavbarItem>
                  <DropdownMenu
                      className="w-[340px]"
                      itemClasses={{
                          base: "gap-4",
                      }}
                  >
                      <DropdownItem
                          href={menuItems.CUSTOMER.linkPath}
                          startContent={<FcDataConfiguration size={23}/>}
                          description={menuItems.CUSTOMER.description}>
                          <span className={'menu-title font-bold text-cyan-500'}>
                              {menuItems.CUSTOMER.title}</span>
                      </DropdownItem>
                      <DropdownItem
                          startContent={<FcDataConfiguration size={23} />}
                          description={menuItems.JOB.description}>
                           <span className={"font-bold text-cyan-500"}>
                                {menuItems.JOB.title}</span>
                      </DropdownItem>
                      <DropdownItem
                          href={menuItems.INVOICE.linkPath}
                          startContent={<FcDataConfiguration size={23} />}
                          description={menuItems.INVOICE.description}>
                          <span className={"font-bold text-cyan-500"}>
                            {menuItems.INVOICE.title}</span>
                      </DropdownItem>
                  </DropdownMenu>
              </Dropdown>
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
                  <Link href="#">Login</Link>
              </NavbarItem>
              <NavbarItem>
                  <Button as={Link} color="primary" href="#" variant="flat">
                      Sign Up
                  </Button>
              </NavbarItem>
          </NavbarContent>
      </NextUINavbar>











    // <NextUINavbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
    //     <NavbarContent className="basis-1/5 sm:basis-full">
    //         <NavbarBrand as="li" className="gap-3 max-w-fit">
    //             <NextLink className="flex justify-start items-center gap-1" href="/home">
    //                 <p className="text-2xl font-extrabold text-inherit text-emerald-600 antialiased">FISHER</p>
    //             </NextLink>
    //         </NavbarBrand>
    //         {/*<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />*/}
    //
    //         <ul className="hidden lg:flex gap-4 justify-start ml-2">
    //             {/*<NavbarItem >*/}
    //             {/*    <NextLink color="foreground" href={"/configurations"} aria-label={isMenuOpen ? "Close menu" : "Open menu"}*/}
    //             {/*              className={clsx(linkStyles({ color: "foreground" }), "data-[active=true]:text-primary data-[active=true]:font-medium",)}>*/}
    //             {/*        Configurations*/}
    //             {/*    </NextLink>*/}
    //             {/*</NavbarItem>*/}
    //             <NavbarItem >
    //                 <NextLink color="foreground" href={"/reports"}
    //                           className={clsx(linkStyles({ color: "foreground" }), "data-[active=true]:text-primary data-[active=true]:font-medium",)}>
    //                     Reports
    //                 </NextLink>
    //             </NavbarItem>
    //         </ul>
    //
    //         {/*<ul className="hidden lg:flex gap-4 justify-start ml-2">*/}
    //         {/*    {siteConfig.navItems.map((item) => (*/}
    //         {/*        <NavbarItem key={item.href}>*/}
    //         {/*            <NextLink*/}
    //         {/*                className={clsx(*/}
    //         {/*                    linkStyles({ color: "foreground" }),*/}
    //         {/*                    "data-[active=true]:text-primary data-[active=true]:font-medium",*/}
    //         {/*                )}*/}
    //         {/*                color="foreground"*/}
    //         {/*                href={item.href}*/}
    //         {/*            >*/}
    //         {/*                {item.label}*/}
    //         {/*            </NextLink>*/}
    //         {/*        </NavbarItem>*/}
    //         {/*    ))}*/}
    //         {/*</ul>*/}
    //     </NavbarContent>
    //
    //     <NavbarContent
    //         className="hidden sm:flex basis-1/5 sm:basis-full"
    //         justify="end">
    //         <NavbarItem className="hidden sm:flex gap-2">
    //
    //             <ThemeSwitch />
    //         </NavbarItem>
    //
    //
    //     </NavbarContent>
    //
    //     <NavbarMenu>
    //         {menuItems.map((item, index) => (
    //             <NavbarMenuItem key={`${item}-${index}`}>
    //                 <Link
    //                     className="w-full"
    //                     color={
    //                         index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
    //                     }
    //                     href="#"
    //                     size="lg"
    //                 >
    //                     {item}
    //                 </Link>
    //             </NavbarMenuItem>
    //         ))}
    //     </NavbarMenu>
    //
    // </NextUINavbar>

);
};
