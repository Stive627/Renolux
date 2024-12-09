import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './soft/ProtectedRoute'
import Renolux from './pages/Renolux'
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute/>}>
        <Route path="/register"/>
        <Route path="/login"/>
      </Route>
      <Route path="/" element={<Renolux/>}/>
      </Routes>
    </Router>
  );
}

export default App;
