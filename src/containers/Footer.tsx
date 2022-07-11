import {
  ButtonGroup,
  IconButton,
  Stack,
  Text,
  Heading,
  Box,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    bg="#4E1EF7"
    color="white"
    py={{ base: "4", md: "8" }}
    px={{ base: "12", md: "24", lg: "36" }}
  >
    <Stack spacing={{ base: "4", md: "5" }}>
      <Stack justify="space-between" direction="row" align="center">
        <Heading size="md">Danny Dwi Cahyono</Heading>
        <ButtonGroup variant="ghost">
          <IconButton
            _hover={{ background: "none" }}
            as="a"
            href="https://www.linkedin.com/in/danny-cahyo/"
            aria-label="LinkedIn"
            icon={<FaLinkedin fontSize="1.25rem" />}
          />
          <IconButton
            _hover={{ background: "none" }}
            as="a"
            href="https://github.com/dannycahyo"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.25rem" />}
          />
          <IconButton
            _hover={{ background: "none" }}
            as="a"
            href="https://www.instagram.com/danny_cahyo/"
            aria-label="Instagram"
            icon={<FaInstagram fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
      <Text fontSize="sm" color="subtle">
        &copy; 2022 Try Out App, Inc. All rights reserved.
      </Text>
    </Stack>
  </Box>
);
