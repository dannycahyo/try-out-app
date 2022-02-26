import React from "react";
import { Flex, Box, Heading, Spacer, Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Flex p="4" bgGradient="linear(to-l, #7928CA, #FF0080)">
      <Box p="2">
        <Heading size="md" color="white">
          Simple Try Out App
        </Heading>
      </Box>
      <Spacer />
      <Box>
        <Button
          colorScheme="teal"
          mr="4"
          bgGradient="linear(to-r, red.500, yellow.500)"
        >
          Sign Up
        </Button>
        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, red.500, yellow.500)"
        >
          Log in
        </Button>
      </Box>
    </Flex>
  );
};

export default Navbar;
