"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const navItems = [
    {
      name: "Home",
      link: "#hero",
    },
    {
      name: "About Us",
      link: "#about",
    },
    {
      name: "Services",
      link: "#services",
    },
    {
      name: "Projects",
      link: "/projects",
      isExternal: true,
    },
    {
      name: "Our Team",
      link: "#team",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If on homepage, scroll to top
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // If not on homepage, let default behavior navigate to "/"
  };

  // Smooth scroll function
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    // Check if it's an external link (starts with /)
    if (link.startsWith("/")) {
      // Let the default behavior handle it (navigation to new page)
      return;
    }

    // If not on homepage, navigate to homepage with hash
    if (!isHomePage) {
      window.location.href = `/${link}`;
      return;
    }

    e.preventDefault();
    const targetId = link.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo onClick={handleLogoClick} />
          <NavItems
            items={navItems}
            onItemClick={(e, link) => handleNavClick(e, link)}
          />
          <div className="flex items-center gap-4">
            <NavbarButton
              onClick={(e) => handleNavClick(e, "#contact")}
              variant="secondary"
            >
              Say Hi!
            </NavbarButton>
            <NavbarButton
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/brief";
              }}
              variant="primary"
            >
              Start Project
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo onClick={handleLogoClick} />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                variant="secondary"
                onClick={(e) => {
                  handleNavClick(e, "#contact");
                }}
              >
                Say Hi!
              </NavbarButton>
              <NavbarButton
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/brief";
                  setIsMobileMenuOpen(false);
                }}
              >
                Start Project
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
