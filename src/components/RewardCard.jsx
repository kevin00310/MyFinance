import React from "react";
import { Box, Typography, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for the RewardCard
const StyledCard = styled(Card)(({ theme, isClickable }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(2),
  textAlign: "center",
  width: "90vw",
  maxWidth: 505,
  height: "auto",
  minHeight: 200,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  cursor: isClickable ? "pointer" : "not-allowed",
  opacity: isClickable ? 1 : 0.6,
  pointerEvents: isClickable ? "auto" : "none",
  [theme.breakpoints.between("md", "lg")]: {
    width: "85vw",
    maxWidth: "350px",
    minHeight: "140px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "80vw",
    minHeight: "80px",
    flexDirection: "column",
  },
  [theme.breakpoints.down("xs")]: {
    width: "100vw",
    minHeight: 120,
  },
}));

const ImagePlaceholder = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  objectFit: "cover",
  borderRadius: 8,
  marginLeft: theme.spacing(2),
  [theme.breakpoints.between("md", "lg")]: {
    width: 120,
    height: 120,
  },
  [theme.breakpoints.down("sm")]: {
    width: 90,
    height: 90,
    marginLeft: 0,
    marginBottom: theme.spacing(2),
  },
  [theme.breakpoints.down("xs")]: {
    width: 80,
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
    alignItems: "center",
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  padding: theme.spacing(2),
}));

export default function RewardCard({
  title,
  description,
  value,
  imageSrc,
  isClickable,
  unlockDays,
  onClick,
}) {
  return (
    <StyledCard isClickable={isClickable} onClick={isClickable ? onClick : undefined}>
      {/* Image */}
      <ImagePlaceholder src={imageSrc} alt={title} />

      {/* Text Content */}
      <TextContainer>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="h5" color="primary">
          {value}
        </Typography>
      </TextContainer>

      {/* Overlay for unclickable cards, showing remaining days to unlock */}
      {!isClickable && (
        <Overlay>
          Unlock in {unlockDays} day{unlockDays !== 1 ? "s" : ""}
        </Overlay>
      )}
    </StyledCard>
  );
}