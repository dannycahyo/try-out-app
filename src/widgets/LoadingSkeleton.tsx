import { Flex, Skeleton } from "@chakra-ui/react";

export const LoadingSkeleton = () => {
  return (
    <Flex padding="6" boxShadow="lg" bg="gray.300" gap={6}>
      <Skeleton height="200px" width="50%" />
      <Skeleton height="200px" width="50%" />
    </Flex>
  );
};
