import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <Header />
        </div>

        <div className="col-12">
          <Outlet />
        </div>

        <div className="col-12">
          <Footer />
        </div>
      </div>
    </>
  );
}
export default Layout;
