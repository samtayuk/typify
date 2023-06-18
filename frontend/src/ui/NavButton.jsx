import { useNavigate } from "react-router-dom";

export const NavButton = ({ to, children }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(to)} className="btn m-4">
      {children}
    </button>
  );
}