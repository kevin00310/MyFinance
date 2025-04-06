import React, { useEffect, useState } from "react";
import { Container, Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "../components/Header";
import RewardCard from "../components/RewardCard";

// Import images
import ewalletImage from "../img/rewardImg/ewalletImage.png";


// Ensure the entire page background is consistent
const PageWrapper = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#f5f5f5",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
});

// Map reward titles to images
const imageMap = {
  "E-wallet": ewalletImage,
  Shopee: ewalletImage,
  Lazada: ewalletImage,
  TaoBao: ewalletImage,
  Chagee: ewalletImage,
  KFC: ewalletImage,
};

// Reward component using function declaration syntax
export default function Reward() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load rewards from rewardText.txt
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
            imageSrc: imageMap[title.trim()] || "", // Map title to image
          };
        });
        setRewards(parsedRewards);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading rewardText.txt:", error);
        setError("Failed to load rewards. Using default rewards.");
        // Fallback to default rewards if the file can't be loaded
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

  if (loading) {
    return (
      <PageWrapper>
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: 8,
          }}
        >
          Loading...
        </Box>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: 8,
          }}
        >
          {error}
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Use HeaderSignIn and add "Home" and profile icon */}
      <Header />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 8, // Match the header height (64px)
        }}
      >
        <Container sx={{ py: 4 }}>
          <Grid container spacing={3} justifyContent="center">
            {rewards.map((reward, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <RewardCard
                    title={reward.title}
                    description={reward.description}
                    value={reward.value}
                    imageSrc={reward.imageSrc}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </PageWrapper>
  );
}