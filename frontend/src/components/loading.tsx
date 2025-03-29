import { Flex, Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react"; // 从 @emotion/react 导入 keyframes

export default function Loading() {
  // 定义点跳动的动画
  const bounce = keyframes`
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  `;

  return (
    <Flex
      direction="row"
      align="center"
      justify="center"
      height="auto"
      bg="white"
    >
      {/* 三个点 */}
      <Box
        as="span"
        display="inline-block"
        width="12px"
        height="12px"
        bg="cyan.500"
        borderRadius="50%"
        animation={`${bounce} 1.4s infinite ease-in-out`}
        sx={{ animationDelay: "0s" }}
        mx="4px"
      />
      <Box
        as="span"
        display="inline-block"
        width="12px"
        height="12px"
        bg="cyan.500"
        borderRadius="50%"
        animation={`${bounce} 1.4s infinite ease-in-out`}
        sx={{ animationDelay: "0.2s" }}
        mx="4px"
      />
      <Box
        as="span"
        display="inline-block"
        width="12px"
        height="12px"
        bg="cyan.500"
        borderRadius="50%"
        animation={`${bounce} 1.4s infinite ease-in-out`}
        sx={{ animationDelay: "0.4s" }}
        mx="4px"
      />
    </Flex>
  );
}