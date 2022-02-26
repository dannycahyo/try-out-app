import {
  ButtonGroup,
  Box,
  IconButton,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    p="4"
    bgGradient="linear(to-l, #7928CA, #FF0080)"
    color="white"
  >
    <Stack spacing={{ base: "4", md: "5" }}>
      <Stack justify="space-between" direction="row" align="center">
        <Heading size="md">Put Your Logo Here</Heading>
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
        &copy; {new Date().getFullYear()} Simple Try Out App, Inc. All rights
        reserved.
      </Text>
    </Stack>
  </Box>
);
