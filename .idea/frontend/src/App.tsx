import React from "react";
import { Link } from "react-router-dom";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Welcome to Capsula!</h1>
      <p>Your digital time capsule starts here.</p>

      <nav>
        <Link to="/login">Log In</Link> |{" "}
        <Link to="/signup">Create Account</Link>
      </nav>
    </div>
  );
};

export default App;
