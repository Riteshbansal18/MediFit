import logo from "../../assets/images/logo1.jpeg";
import { useContext, useEffect, useRef } from "react";
import { BiMenu } from "react-icons/bi";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/services", display: "Services" },
  { path: "/doctors", display: "Find a Doctor" },
  // Removed React route for contact and replaced with external link below
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  useEffect(() => {
    console.log("Header: User updated to:", user);
  }, [user]);

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <img src={logo} alt="logo" className="h-16 w-auto object-contain" />

          <nav
            ref={menuRef}
            onClick={() => menuRef.current.classList.toggle("show__menu")}
          >
            <ul className="menu flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive ? "text-green-600 font-bold" : "text-gray-700"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}

              {/* Contact opens the Express EJS page in a new tab */}
              <li>
                <a
                  href="http://localhost:5000/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-green-600"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={role === "doctor" ? "/doctors/profile/me" : "/users/profile/me"}
                >
                  <h3 className="text-white font-bold">{user?.name}</h3>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-green-500 text-white px-6 py-2 rounded">
                  Log In
                </button>
              </Link>
            )}

            <BiMenu
              className="w-6 h-6 cursor-pointer md:hidden"
              onClick={() => menuRef.current.classList.toggle("show__menu")}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
