import React from 'react'
import Home from './Home'
import Form from './Form'
import { NavLink } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div id="app">
      <nav>
      <NavLink to ="/">Home</NavLink>
      <NavLink to = "/order">Order</NavLink>
        {/* NavLinks here */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
      {/* Route and Routes here */}
      {/* <Home />
      <Form /> */}
    </div>
  )
}

export default App
