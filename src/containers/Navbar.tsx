import React from "react";
import {
  Flex,
  Box,
  Heading,
  Spacer,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <Flex py="4" bg="#4E1EF7" px={{ base: "12", md: "24", lg: "36" }}>
      <Box p="2">
        <Heading size="md" color="white">
          Simple Try Out App
        </Heading>
      </Box>
      <Spacer />
      <Box>
        <ButtonGroup pl="2" bg="white" borderRadius="base">
          <Heading size="md" mt="2">
            Github Repository
          </Heading>
          <IconButton
            bg="white"
            as="a"
            href="#"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Box>
    </Flex>
  );
};

export default Navbar;
