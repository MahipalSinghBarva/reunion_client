import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Register from "./component/Register";
import Login from "./component/Login";
import Navbar from "./component/Navbar";
import Dashboard from "./component/Dashboard";
import TaskList from "./component/TaskList";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/task/list" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
