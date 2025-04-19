import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Converter from "./Converter.jsx";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#3b82f6",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const ConverterButton = styled(Button)({
  marginLeft: 'auto',
});

const HeaderSignIn = () => {
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const toggleConverter = () => setIsConverterOpen(!isConverterOpen);

  const handleConverterClick = () => {
    toggleConverter();
  };

  return (
    <>
      <StyledAppBar>
        <StyledToolbar>
          <Typography 
          variant="h6" 
          fontWeight="bold"
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
          >
            MyFinance
          </Typography>
          <ConverterButton color="inherit" onClick={toggleConverter}>
            Converter
          </ConverterButton>
        </StyledToolbar>
      </StyledAppBar>
      
      <Converter open={isConverterOpen} onClose={toggleConverter} />
    </>
  );
};

export default HeaderSignIn;

