import Logo from "@/assets/logo.png";
import "@/index.css";
import { NavLink, useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full flex p-2 bg-white shadow-sm px-2 sm:px-8 z-50 justify-between">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-10" />
          <h1 className="font-bold text-2xl">
            <span className="text-brandPrimary">Eat</span>
            <span className="text-brandSecondary">Ease</span>
          </h1>
        </NavLink>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className=" px-4 rounded-md sm:p-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/registration")}
            className="bg-brandSecondary text-white px-4 py-2 rounded-md"
          >
            Register Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
