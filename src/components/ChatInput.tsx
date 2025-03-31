import { Flex, Textarea, Select, Button } from "@chakra-ui/react";
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
  const [inputHeight, setInputHeight] = useState(60); // 初始高度为 60px
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex
      p={4}
      bg="white"
      border="1px solid #E2E8F0" // 添加边框
      borderRadius="33px" // 设置圆角
      direction="column" // 垂直排列
      align="center"
      gap={4}
      position="fixed" // 固定在视口底部
      bottom={4} // 距离视口底部 4 单位（约 16px）
      left="50%" // 水平居中
      transform="translateX(-50%)" // 水平居中调整
      width="50rem" // 设置固定宽度
      zIndex={10} // 确保在其他内容之上
      boxShadow="md" // 添加阴影效果
      style={{ height: `${Math.min(250, Math.max(110, inputHeight + 110))}px` }} // 动态调整高度
    >
      {/* 第一行：输入框 */}
      <Flex align="center" gap={4}>
        <Textarea
          flex={1}
          placeholder="Start a new chat"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // 阻止默认的换行行为
              handleKeyDown; // 发送消息
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto"; // 重置高度
            target.style.height = `${target.scrollHeight}px`; // 根据内容动态调整高度
            setInputHeight(target.scrollHeight);
          }}
          border="1px solid gray.300"
          outline="none" // 移除默认的选中框
          _focus={{
            boxShadow: "none", // 移除聚焦时的阴影
            borderColor: "gray.300", // 保持边框颜色不变
          }}
          resize="none" // 禁止用户手动调整大小
          textAlign="left" // 文本靠左对齐
          verticalAlign="top" // 文本靠上对齐
          width="48rem" // 占满宽度
          height={"60px"} // 初始高度
          maxHeight="170px"
          minHeight="90px"
        />
      </Flex>

      {/* 第二行：选择框和发送按钮 */}
      <Flex justify="flex-end" align="center" gap={4} width="100%">
        <Select
          placeholder="Phala"
          value={selectedKnowledgeBase}
          onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
          bg="gray.100"
          border="1px solid gray.300"
          _focus={{ borderColor: "cyan.400" }}
          width="200px"
        >
          <option value="knowledge-base-1">Phala</option>
        </Select>
        <Button colorScheme="cyan" onClick={handleSendMessage}>
          Send
        </Button>
      </Flex>
    </Flex>
  );
};