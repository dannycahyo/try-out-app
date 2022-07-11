import { Flex, Box, Heading, Spacer, Button } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <Flex py="4" bg="#4E1EF7" px={{ base: "12", md: "24", lg: "36" }}>
      <Box p="2">
        <Heading size="md" color="white">
          Try Out App
        </Heading>
      </Box>
      <Spacer />
      <Button
        rightIcon={<FaGithub />}
        color="black"
        background="white"
        as="a"
        href="https://github.com/dannycahyo/try-out-app"
      >
        Github Repository
      </Button>
    </Flex>
  );
};

export default Navbar;
