import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import Doctors from "../pages/Doctors/Doctors";
import Services from "../pages/Services";
import MyAccount from "../Dashboard/user-account/MyAccount";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import Contact from "../pages/Contact";
import Dashboard from "../Dashboard/doctor-account/Dashboard";
import ProjectedRoute from "./ProjectedRoute";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import Appointment from "../pages/Appointment.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/appointment" element={<Appointment />} />

      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/services" element={<Services />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route
        path="/users/profile/me"
        element={
          <ProjectedRoute allowedRoles={["patient"]}>
            <MyAccount />
          </ProjectedRoute>
        }
      />
      <Route
        path="/doctors/profile/me"
        element={
          <ProjectedRoute allowedRoles={["doctor"]}>
            <Dashboard />
          </ProjectedRoute>
        }
      />
    </Routes>
  );
};

export default Routers;
