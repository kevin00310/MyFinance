import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { DNDwidget } from "../function/DNDwidget.js";
import "./Home.css";
import { BalanceWidget } from "./BalanceWidget.js";
import { TransactionWidget } from "./TransactionWidget.js";
import icon from "../img/profile_icon.png";

const Home = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [creationDate, setCreationDate] = useState("");
  const [daysJoined, setDaysJoined] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const creationTime = new Date(user.metadata.creationTime);
        setCreationDate(creationTime.toDateString());

        const today = new Date();
        const differenceInTime = today - creationTime;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
        setDaysJoined(differenceInDays);

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (userData.exists()) {
          setUserName(userData.data().name);
        } else {
          console.error("User data not found in database.");
        }
      };

      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  const logoutFunc = () => {
    signOut(auth)
      .then(() => {
        alert("Logout Successful!");
        navigate("/");
      })
      .catch((error) => {
        alert("Error during logout: " + error.message);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const initialWidgets = [
    { id: "widgetOne", content: <BalanceWidget uid={user?.uid} /> },
    { id: "widgetTwo", content: <TransactionWidget uid={user?.uid} /> },
    { id: "widgetThree", content: <div>Widget Three Content</div> },
  ];

  const {
    items: widgets,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = DNDwidget(initialWidgets);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div>
        <div className="header">
          <h1 className="header-title">MyFinance</h1>
          <div className="header-links">
            <Link to="/reward" className="reward-link">Reward</Link>
            <div className="profile-icon" onClick={toggleModal}>
              <img className="proImg" src={icon} alt="Profile Icon" />
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={toggleModal}>
                &times;
              </button>
              <p><strong>Day Joined:</strong> {daysJoined} Days</p>
              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <div className="modal-buttons">
                <Link to="/reward">
                  <button className="modal-button">Reward</button>
                </Link>
                <button className="modal-button" onClick={logoutFunc}>Logout</button>
              </div>
            </div>
          </div>
        )}

        <div className="container">
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
