import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { DNDwidget } from "../function/DNDwidget.js";
import "./Home.css";
import { BalanceWidget } from "./BalanceWidget.js";
import { TransactionWidget } from "./TransactionWidget.js";
import icon from "../img/profile_icon.png";

const Home = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth); 
  const [uid, setUid] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [creationDate, setCreationDate] = useState("");
  const [daysJoined, setDaysJoined] = useState(0);
  const [userName, setUserName] = useState("");
  const [widgetOri, setWidgetOri] = useState([]);

  // for check uid load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUid(currentUser.uid);
        console.log("uid: " + currentUser.uid);

        setWidgetOri([
          { id: "widgetOne", content: <BalanceWidget uid={currentUser.uid} /> },
          { id: "widgetTwo", content: <div>Widget Two Content</div> },
          { id: "widgetThree", content: <TransactionWidget uid={currentUser.uid} /> },
        ]);

        // get the date created acc
        const creationTime = new Date(currentUser.metadata.creationTime);
        setCreationDate(creationTime.toDateString());

        // count join day
        const today = new Date();
        const differenceInTime = today - creationTime;
        const differenceInDays = Math.floor(
          differenceInTime / (1000 * 60 * 60 * 24)
        ); // convert to day
        setDaysJoined(differenceInDays);

        // get user name from firebase
        const userRef = doc(db, "users", currentUser.uid);
        const userData = await getDoc(userRef);

        if (userData.exists()) {
          setUserName(userData.data().name);
        } else {
          console.error("User data not found in database.");
        }

        setLoading(false); 
      } else {
        setUid(null);
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/Home");
    }
  }, [user, navigate]);

  // logout
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

  // profile window
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  console.log("pass uid: " + uid);
  

  if (loading) {
    return <div>Loading...</div>; // loading
  }

  return (
    <>
      <div>
        {/* head */}
        <div className="header">
          <h1 className="header-title">MyFinance</h1>
          <div className="header-links">
            <Link to="/reward" className="reward-link">
              Reward
            </Link>
            <div className="profile-icon" onClick={toggleModal}>
              <img className="proImg" src={icon} />
            </div>
          </div>
        </div>

        {/* profile window */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={toggleModal}>
                &times;
              </button>
              <p>
                <strong>Day Joined:</strong> {daysJoined} Days
              </p>
              <p>
                <strong>Name:</strong> {userName}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
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

        {/* widget */}
        <div className="container">
          <div className="widgets">
            {/* {widgets.map((widget, index) => (
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
            ))} */}
            {widgetOri.map((widget) => (
        <div className="widget" key={widget.id}>{widget.content}</div>
      ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
