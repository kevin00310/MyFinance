import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Grid, Modal, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/Header";
import Loading from "../pages/Loading";
import RewardCard from "../components/RewardCard";

// Import images
import ewalletImage from "../img/rewardImg/ewalletImage.png";
// import shopeeImage from "../img/rewardImg/shopeeImage.png";
// import lazadaImage from "../img/rewardImg/lazadaImage.png";
// import taobaoImage from "../img/rewardImg/taobaoImage.png";
// import chageeImage from "../img/rewardImg/chageeImage.png";
// import kfcImage from "../img/rewardImg/kfcImage.png";

// Ensure the entire page background is consistent
const PageWrapper = styled(Box)({
  height: "100vh",
  width: "100%",
  backgroundColor: "#f5f5f5",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
});

// Make the content scrollable while keeping the header fixed
const ScrollableContent = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 64px)",
  overflowY: "auto",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

// Style for the popup modal, matching ProfileModal in Header.jsx
const RewardModal = styled(Paper)(({ theme }) => ({
  position: "absolute",
  width: 300,
  padding: theme.spacing(3),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 8,
  textAlign: "center",
}));

// Map reward titles to images
const imageMap = {
  "E-wallet": ewalletImage,
  Shopee: ewalletImage,
  Lazada: ewalletImage,
  TaoBao: ewalletImage,
  Chagee: ewalletImage,
  KFC: ewalletImage,
};

export default function Reward() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const navigate = useNavigate();
  const [user, loadingAuth, authError] = useAuthState(auth);
  const [uid, setUid] = useState(null);
  const [creationDate, setCreationDate] = useState("");
  const [daysJoined, setDaysJoined] = useState(0);
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user data and handle authentication
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const currentUid = user.uid;
        setUid(currentUid);

        const creationTime = new Date(user.metadata.creationTime);
        setCreationDate(creationTime.toDateString());
        const today = new Date();
        const differenceInDays = Math.floor(
          (today - creationTime) / (1000 * 60 * 60 * 24)
        );
        setDaysJoined(differenceInDays);
        console.log("Days Joined:", differenceInDays); // Debug log

        const userRef = doc(db, "users", currentUid);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          setUserName(userData.data().name);
        }
      } else if (!loadingAuth && !user) {
        navigate("/");
      }
    };

    fetchUserData();
  }, [user, loadingAuth, navigate]);

  // Load rewards from RewardDetail.txt
  useEffect(() => {
    fetch("/RewardDetail.txt")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const parsedRewards = lines.map((line) => {
          const [title, description, value] = line.split("|");
          return {
            title: title.trim(),
            description: description.trim(),
            value: value.trim(),
            imageSrc: imageMap[title.trim()] || "",
          };
        });
        setRewards(parsedRewards);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading RewardDetail.txt:", error);
        setError("Failed to load rewards. Using default rewards.");
        const defaultRewards = [
          {
            title: "E-wallet",
            description: "Enjoy RM 15 voucher off",
            value: "RM 15",
            imageSrc: imageMap["E-wallet"],
          },
          {
            title: "Shopee",
            description: "Enjoy 15% voucher off",
            value: "15%",
            imageSrc: imageMap["Shopee"],
          },
          {
            title: "Lazada",
            description: "Enjoy 20% voucher off",
            value: "20%",
            imageSrc: imageMap["Lazada"],
          },
          {
            title: "TaoBao",
            description: "Enjoy RM 30 voucher off",
            value: "RM 30",
            imageSrc: imageMap["TaoBao"],
          },
          {
            title: "Chagee",
            description: "Enjoy 25% voucher off",
            value: "25%",
            imageSrc: imageMap["Chagee"],
          },
          {
            title: "KFC",
            description: "Enjoy RM 40 voucher off",
            value: "RM 40",
            imageSrc: imageMap["KFC"],
          },
        ];
        setRewards(defaultRewards);
        setLoading(false);
      });
  }, []);

  // Handle card click to open the modal
  const handleCardClick = (reward) => {
    setSelectedReward(reward);
    setIsRewardModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsRewardModalOpen(false);
    setSelectedReward(null);
  };

  if (loading || loadingAuth) {
    return (
      <Loading
        user={user}
        uid={uid}
        navigate={navigate}
        daysJoined={daysJoined}
        userName={userName}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    );
  }

  if (error || authError) {
    return (
      <PageWrapper>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {error || authError.message}
            </Box>
          </Container>
        </ScrollableContent>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
          <Grid container spacing={3} justifyContent="center">
            {rewards.map((reward, index) => {
              // Calculate unlock requirements using daysJoined from Header.jsx
              const requiredDays = (index + 1) * 10; // Changed multiplier to 10
              const isClickable = daysJoined >= requiredDays;
              const unlockDays = requiredDays - daysJoined > 0 ? requiredDays - daysJoined : 0;

              // Debug logging to verify values
              console.log(`Card ${index + 1}:`);
              console.log(`  Required Days: ${requiredDays}`);
              console.log(`  Days Joined: ${daysJoined}`);
              console.log(`  Is Clickable: ${isClickable}`);
              console.log(`  Unlock Days Remaining: ${unlockDays}`);

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <RewardCard
                      title={reward.title}
                      description={reward.description}
                      value={reward.value}
                      imageSrc={reward.imageSrc}
                      isClickable={isClickable}
                      unlockDays={unlockDays}
                      onClick={() => handleCardClick(reward)}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </ScrollableContent>

      {/* Popup Modal */}
      <Modal open={isRewardModalOpen} onClose={handleCloseModal}>
        <RewardModal>
          <Typography variant="h6" gutterBottom>
            Reward Unlocked!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Congratulations! You've unlocked the {selectedReward?.title} reward.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {selectedReward?.description}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {selectedReward?.value}
          </Typography>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{ mt: 2, backgroundColor: "#3b82f6", "&:hover": { backgroundColor: "#2563eb" } }}
          >
            Close
          </Button>
        </RewardModal>
      </Modal>
    </PageWrapper>
  );
}