import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from './features/toast/ToastContainer';
import { NotFound } from './app/NotFound';

import { NavBar } from './features/nav/NavBar';
import { Classify } from './features/classify/Classify';



import './App.css';

function App() {
  return (
    <>
      <ToastContainer />
      <div className="w-screen h-screen flex flex-col md:flex-row bg-base-100">
        <Routes>
          <Route index element={<Classify />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </>
  );
}

export default App;
