import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { BalanceWidget } from "./BalanceWidget";
import { ChartWidget } from "./ChartWidget";
import { TransactionWidget } from "./TransactionWidget";
import Header from "../components/Header";
import {
  Container,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const WidgetContainer = styled(Paper)(({ theme }) => ({
  border: "1px solid black",
  borderRadius: 8,
  overflow: "hidden",
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 64px)", // Adjust based on Header height (default AppBar height is 64px)
  overflowY: "auto", // Enable vertical scrolling
  paddingTop: theme.spacing(2), // Match Container's py: 2
  paddingBottom: theme.spacing(2),
}));

const Home = () => {
  const navigate = useNavigate();
  const [user, loadingAuth, error] = useAuthState(auth);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creationDate, setCreationDate] = useState("");
  const [daysJoined, setDaysJoined] = useState(0);
  const [userName, setUserName] = useState("");
  const [widgetOri, setWidgetOri] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const currentUid = user.uid;
        setUid(currentUid);
        
        setWidgetOri([
          { id: "widgetOne", content: <BalanceWidget uid={currentUid} /> },
          { id: "widgetTwo", content: <ChartWidget uid={currentUid} /> },
          { id: "widgetThree", content: <TransactionWidget uid={currentUid} /> },
        ]);

        const creationTime = new Date(user.metadata.creationTime);
        setCreationDate(creationTime.toDateString());
        const today = new Date();
        const differenceInDays = Math.floor(
          (today - creationTime) / (1000 * 60 * 60 * 24)
        );
        setDaysJoined(differenceInDays);

        const userRef = doc(db, "users", currentUid);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          setUserName(userData.data().name);
        }
        setLoading(false);
      } else if (!loadingAuth && !user) {
        navigate("/");
      }
    };

    fetchUserData();
  }, [user, loadingAuth, navigate]);

  if (loading || loadingAuth) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        user={user}
        uid={uid}
        navigate={navigate}
        daysJoined={daysJoined}
        userName={userName}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ScrollableContent>
        <Container>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {widgetOri.map((widget) => (
              <WidgetContainer key={widget.id} elevation={0}>
                {widget.content}
              </WidgetContainer>
            ))}
          </Box>
        </Container>
      </ScrollableContent>
    </Box>
  );
};

export default Home;