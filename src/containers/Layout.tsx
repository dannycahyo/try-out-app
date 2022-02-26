import React from "react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { Box, Text } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <Navbar />
      <Text
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        fontSize="4xl"
        fontWeight="extrabold"
        textAlign="center"
        mt="4"
      >
        Let's Get Started
      </Text>
      {children}
      <Footer />
    </Box>
  );
};

export default Layout;
