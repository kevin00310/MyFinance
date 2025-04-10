import React from "react";
import { Container, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "../components/Header";

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

const Loading = ({
  user,
  uid,
  navigate,
  daysJoined,
  userName,
  isModalOpen,
  setIsModalOpen,
}) => {
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
            Loading...
          </Box>
        </Container>
      </ScrollableContent>
    </PageWrapper>
  );
};

export default Loading;