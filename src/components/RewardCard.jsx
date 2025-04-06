import React from "react";
import { Box, Typography, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for the RewardCard
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(2),
  textAlign: "center",
  width: "90vw", // Responsive based on viewport width
  maxWidth: 505, // Maximum width of 505px
  height: "auto", // Height adjusts based on content
  minHeight: 200, // Minimum height of 200px
  display: "flex",
  flexDirection: "row", // Align image & text side by side
  alignItems: "center",
  justifyContent: "space-between",
  // Breakpoint for screens between 900px (md) and 1200px (lg)
  [theme.breakpoints.between("md", "lg")]: {
    width: "85vw", // Slightly smaller width (from 90vw to 85vw)
    maxWidth: "480px", // Slightly smaller maxWidth (from 505px to 480px)
    minHeight: "180px", // Slightly smaller height (from 200px to 180px)
  },
  // breakpoint for screens between 1000px and 1110px
  [theme.breakpoints.between("1000px", "1110px")]: {
    width: "50vw", // Slightly smaller width (from 85vw to 82vw)
    maxWidth: "90px", // Slightly smaller maxWidth (from 480px to 470px)
    minHeight: "175px", // Slightly smaller height (from 180px to 175px)
  },
  // breakpoint for screens between 1100px and 1120px (from previous update)
  [theme.breakpoints.between("1100px", "1120px")]: {
    width: "80vw", // Even smaller width (from 82vw to 80vw)
    maxWidth: "40px", // Even smaller maxWidth (from 470px to 460px)
    minHeight: "170px", // Even smaller height (from 175px to 170px)
  },
  [theme.breakpoints.down("sm")]: {
    width: "80vw", // Smaller width on small screens
    minHeight: 150, // Smaller height on small screens
    flexDirection: "column", // Stack image & text vertically on small screens
  },
  [theme.breakpoints.down("xs")]: {
    width: "100vw", // Even smaller width on extra small screens
    minHeight: 120, // Even smaller height on extra small screens
  },
}));

const ImagePlaceholder = styled("img")(({ theme }) => ({
  width: 150,
  height: 150,
  objectFit: "cover", // Ensure the image scales properly
  borderRadius: 8,
  marginLeft: theme.spacing(2),
  [theme.breakpoints.between("md", "lg")]: {
    width: 140, // Slightly smaller image (from 150px to 140px)
    height: 140, // Slightly smaller image (from 150px to 140px)
  },
  [theme.breakpoints.between(1000, 1120)]: {
    width: 135, // Slightly smaller image (from 140px to 135px)
    height: 135, // Slightly smaller image (from 140px to 135px)
  },
  [theme.breakpoints.down("sm")]: {
    width: 100, // Smaller image on small screens
    height: 100,
    marginLeft: 0,
    marginBottom: theme.spacing(2),
  },
  [theme.breakpoints.down("xs")]: {
    width: 80, // Even smaller image on extra small screens
    height: 80,
  },
}));

const TextContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    alignItems: "center", // Center text on small screens
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
}));

// RewardCard component using function declaration syntax
export default function RewardCard({ title, description, value, imageSrc }) {
  return (
    <StyledCard>
      {/* Image */}
      <ImagePlaceholder src={imageSrc} alt={title} />

      {/* Text Content */}
      <TextContainer>
        {/* Reward Title */}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {/* Reward Description */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>

        {/* Reward Value */}
        <Typography variant="h5" color="primary">
          {value}
        </Typography>
      </TextContainer>
    </StyledCard>
  );
}