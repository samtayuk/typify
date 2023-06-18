import { useNavigate, useLocation  } from "react-router-dom";
import classNames from 'classnames';
import { HomeIcon, CalendarIcon, QueueListIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export const Header = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <div className="flex w-full text-lg font-bold justify-center items-center sticky top-0">
      <h1 className="py-5">{title}</h1>
    </div>
  );
}
