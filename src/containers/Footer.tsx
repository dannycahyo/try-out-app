import {
  ButtonGroup,
  IconButton,
  Stack,
  Text,
  Heading,
  Box,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    p="4"
    bg="#4E1EF7"
    color="white"
    py={{ base: "12", md: "16" }}
    px={{ base: "12", md: "24", lg: "36" }}
  >
    <Stack spacing={{ base: "4", md: "5" }}>
      <Stack justify="space-between" direction="row" align="center">
        <Heading size="md">Danny Dwi Cahyono</Heading>
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            href="#"
            aria-label="LinkedIn"
            icon={<FaLinkedin fontSize="1.25rem" />}
          />
          <IconButton
            as="a"
            href="#"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.25rem" />}
          />
          <IconButton
            as="a"
            href="#"
            aria-label="Twitter"
            icon={<FaTwitter fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
      <Text fontSize="sm" color="subtle">
        &copy; 2022 Simple Try Out App, Inc. All rights reserved.
      </Text>
    </Stack>
  </Box>
);
