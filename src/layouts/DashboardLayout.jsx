import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main style={{ padding: "20px", minHeight: "80vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
