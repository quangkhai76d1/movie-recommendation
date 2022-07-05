import Navbar from "../components/Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="container">{children}</div>
    </div>
  );
};

export default Layout;
