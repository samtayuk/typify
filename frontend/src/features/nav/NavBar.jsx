import { useNavigate, useLocation  } from "react-router-dom";
import classNames from 'classnames';
import { HomeIcon, CalendarIcon, QueueListIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const nav = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Plan", href: "/mealplan", icon: CalendarDaysIcon },
    { name: "Meals", href: "/meals", icon: CalendarIcon },
    { name: "Shopping", href: "/shoppinglist", icon: QueueListIcon }
  ]

  return (
    <div className="flex justify-around p-2 bg-neutral-100 order-last shadow-md rounded-t-2xl sticky bottom-0 md:rounded-none md:rounded-r-2xl md:order-first md:flex-col md:justify-start md:gap-8 md:pt-20">
      {nav.map((item, idx) => (
        <a key={idx} onClick={() => navigate(item.href)} className={classNames({
          "flex flex-col items-center justify-center rounded-md text-center border-2 border-transparent h-12 w-12 md:h-16 md:w-16 text-slate-400": true,
          "hover:border-white hover:text-white": location.pathname !== item.href,
          "bg-primary !text-white shadow-lg": location.pathname === item.href,
        })}>
          <item.icon className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-thin text-[0.65rem] uppercase hidden md:block">{item.name}</span>
        </a>
      ))}
    </div>
  );
}
