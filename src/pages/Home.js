import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth" ;
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { DNDwidget } from "../function/DNDwidget.js";
import "./Home.css";
import { BalanceWidget } from "./BalanceWidget.js";
// import { GraphWidget } from "./GraphWidget.js";
import { TransactionWidget } from "./TransactionWidget.js";
import icon from "../img/profile_icon.png";

const Home = () => {

  const navigate = useNavigate();

  const user = useAuthState(auth);
  const [creationDate, setCreationDate] = useState("");
  const [daysJoined, setDaysJoined] = useState(0);
  const [userName, setUserName] = useState("");
 
  // get joined day, name, email 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const creationTime = new Date(user.metadata.creationTime);
        setCreationDate(creationTime.toDateString());

        // Calculate difference in days
        const today = new Date();
        const differenceInTime = today - creationTime; // Difference in milliseconds
        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Convert to days
        setDaysJoined(differenceInDays);

        // Fetch user name from Firestore
        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (userData.exists()) {
          setUserName(userData.data().name);
        } else {
          console.error("User data not found in database.");
        }
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/Home");
    }
  }, user);

  // logout function
  function logoutFunc() {
    try {
      alert("Logout Successful!");
      navigate("/");
  
      signOut(auth)
        .then(() => {
          console.log("Logout successful!");
        })
        .catch((error) => {
          alert("Error during logout: " + error.message);
        });
    } catch (error) {
      alert("Unexpected error: " + error.message);
    }
  }

  // profile windows
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const initialWidgets = [
    { id: "widgetOne", content: <BalanceWidget uid={user[0]?.uid} /> },
    { id: "widgetTwo", content: <TransactionWidget uid={user[0]?.uid} /> },
    { id: "widgetThree", content: <div>Widget Three Content</div> },
  ];

  const { items: widgets, handleDragStart, handleDragOver, handleDrop } = DNDwidget(initialWidgets);

  return (
    <>
    <div>
      {/* Header */}
      <div className="header">
        <h1 className="header-title">MyFinance</h1>
        <div className="header-links">
          <Link to="/reward" className="reward-link">
            Reward
          </Link>
          <div className="profile-icon" onClick={toggleModal} >
          <img class="proImg" src={icon} />
            {/* <span className="material-icons">
    
            </span> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleModal}>
              &times;
            </button>
            <p><strong>Day Joined:</strong> {daysJoined} Days</p>
            <p><strong>Name:</strong> {userName} </p>
            <p><strong>Email:</strong> {user[0]?.email}</p>
            <div className="modal-buttons">
              <Link to="/reward">
                <button className="modal-button">Reward</button>
              </Link>
              <button className="modal-button" onClick={logoutFunc}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Widgets Section */}
        <div className="widgets">
          {widgets.map((widget, index) => (
            <div
              key={widget.id}
              className="widget"
              id={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {widget.content}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
