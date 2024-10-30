import { headerNavItems } from "@/config/navItems";
import { siteData } from "@/config/site";
import Link from "next/link";

const Header = () => {
  return (
    <header className="max-w-6xl mx-auto w-full py-6 px-4">
      <div className="flex items-center justify-between ">
        <div>
          <Link href="/" className="md:text-3xl text-2xl font-bold">
            {siteData.siteName}
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-8 font-medium">
            {headerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-teal-600 duration-150"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* hamburger menu*/}
    </header>
  );
};

export default Header;
