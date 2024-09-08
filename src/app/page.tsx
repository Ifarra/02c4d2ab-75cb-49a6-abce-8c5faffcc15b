import TestTable from "@/components/TestTable";

const Home = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-main">
      <div className="mockup-browser bg-base-300 border shadow-lg w-4/5">
        <div className="mockup-browser-toolbar">
          <div className="input">https://ifarra.vercel.app</div>
          <div className="title hidden md:block">
            <a href="https://github.com/Ifarra">
              ifarra | Muhammad Fauzan Arrafi
            </a>
          </div>
        </div>
        <TestTable />
      </div>
    </div>
  );
};

export default Home;
