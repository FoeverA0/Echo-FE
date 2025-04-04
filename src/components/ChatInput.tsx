import { Flex, Textarea, Select, Button, Box, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  selectedKnowledgeBase: string;
  setSelectedKnowledgeBase: (value: string) => void;
  handleSendMessage: () => void;
}

export const ChatInput = ({
  input,
  setInput,
  selectedKnowledgeBase,
  setSelectedKnowledgeBase,
  handleSendMessage,
}: ChatInputProps) => {
  const [baseHeight] = useState(60); // 基准高度
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 自动高度调整逻辑
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 170)}px`;
    setInput(e.target.value);
  };

  return (
    <Box width="full" maxWidth="container.lg" mx="auto">
      <Flex
        p={4}
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        direction="column"
        gap={4}
        boxShadow="md"
      >
        {/* 输入区域 */}
        <Textarea
          placeholder="Start a new chat"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          border="1px solid"
          borderColor="gray.300"
          _focus={{
            borderColor: "blue.300",
            boxShadow: "none"
          }}
          resize="none"
          minHeight={`${baseHeight}px`}
          maxHeight="170px"
          overflowY="auto"
          transition="height 0.2s ease"
          fontSize="md"
          lineHeight="tall"
        />

        {/* 操作栏 */}
        <Flex justify="space-between" align="center">
          <Select
            placeholder="Smart Search"
            value={selectedKnowledgeBase}
            onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
            width="220px"
            size="md"
            focusBorderColor="blue.300"
            borderColor="gray.300"
          >
            <option value="phala">Phala Network</option>
            <option value="blockchain-general">Blockchain General</option>
          </Select>

          <Button
            colorScheme="blue"
            bgGradient="linear(to-r, blue.600, purple.600)"
            size="md"
            px={8}
            onClick={() => {
              handleSendMessage();
              setInput("");
            }}
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s"
          >
            Search
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};