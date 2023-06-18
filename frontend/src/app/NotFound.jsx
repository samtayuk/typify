import { useNavigate, useLocation  } from "react-router-dom";
import classNames from 'classnames';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <div className="flex items-center justify-center h-full p-3">

      <div className="card w-96 bg-base-300">
        <div className="card-body text-center items-center">
          <ExclamationTriangleIcon className="h-24 w-24 text-primary" />
          <h2 className="card-title mt-0">Not Found!</h2>
          <p>Ooops looks like you took a wrong turn.</p>
          <div className="card-actions justify-end">
            <button onClick={() => navigate("/")} className="btn btn-primary">Home</button>
          </div>
        </div>
      </div>

    </div>
  );
}
