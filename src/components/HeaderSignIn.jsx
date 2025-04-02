import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#3b82f6",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
});

const HeaderSignIn = () => {
  return (
    <StyledAppBar>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          MyFinance
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
};

export default HeaderSignIn;