import React from "react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <Navbar />
      <Box bg="#1A365D" h="90vh">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
