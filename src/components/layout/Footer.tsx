import { footerNavItems } from "@/config/navItems";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-900 py-6 md:py-10 md:mt-10">
      <div className="flex flex-col items-center gap-6">
        <nav>
          <ul className="flex items-center justify-center gap-10 text-slate-300 text-sm md:text-base">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-slate-50 duration-150"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-slate-300 text-sm md:text-base">
          <span>
            Copyright © {new Date().getFullYear()} Created By NotionPress
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
