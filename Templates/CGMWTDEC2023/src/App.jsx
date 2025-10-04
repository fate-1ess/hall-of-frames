import { Routes, Route, useLocation } from "react-router-dom";

import Nav from "./pages/nav/Nav";

import Home from "./pages/home/Home";
import Work from "./pages/work/Work";
import Overview from "./pages/overview/Overview";
import Mustang from "./pages/mustang/Mustang";
import Info from "./pages/info/Info";
import SampleProject from "./pages/sampleProject/SampleProject";

import "./App.css";

function App() {
  const location = useLocation();
  return (
    <>
      <Nav />
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/info" element={<Info />} />
        <Route path="/mustang" element={<Mustang />} />
        <Route path="/sample-project" element={<SampleProject />} />
      </Routes>
    </>
  );
}

export default App;
