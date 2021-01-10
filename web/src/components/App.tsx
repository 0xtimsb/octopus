import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  ChakraProvider,
  Box,
  Text,
  theme,
  HStack,
  Center,
  Button,
  Input,
  Flex,
  FormControl,
  VStack,
  Avatar,
} from "@chakra-ui/react";

import { io, Socket } from "socket.io-client";

import { ColorModeSwitcher } from "./ColorModeSwitcher";

interface Message {
  id: string;
  text: string;
  received: boolean;
}

export const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    if (!socket) {
      const socketClient = io("http://localhost:4000");
      setSocket(socketClient);
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: string) => {
        setMessages([
          ...messages,
          { id: uuidv4(), text: message, received: true },
        ]);
      });
    }
  }, [socket, messages]);

  const onSubmit = handleSubmit(({ message }: { message: string }) => {
    setValue("message", "");
    if (socket) {
      socket.emit("message", message);
      setMessages([
        ...messages,
        { id: uuidv4(), text: message, received: false },
      ]);
    }
  });

  return (
    <ChakraProvider theme={theme}>
      <Center textAlign="center" fontSize="xl">
        <Flex direction="column" height="100vh" width="lg" borderWidth={1}>
          <HStack paddingX={4} paddingY={2} borderBottomWidth={1} spacing={3}>
            <Avatar size="xs" />
            <Text flex={1} textAlign="left" fontSize={18} fontWeight="bold">
              someone
            </Text>
            <ColorModeSwitcher />
          </HStack>
          <VStack flex={1} justifyContent="flex-end" padding={2} spacing={2}>
            {messages.map(({ id, text, received }, idx) => (
              <Box
                key={id}
                background={received ? "#e7e7e7" : "#0078FF"}
                paddingY={1}
                paddingX={3}
                borderBottomLeftRadius={21}
                borderBottomRightRadius={21}
                borderTopLeftRadius={21}
                borderTopRightRadius={21}
                alignSelf={received ? "flex-start" : "flex-end"}
              >
                <Text textColor={received ? "black" : "white"} fontSize="lg">
                  {text}
                </Text>
              </Box>
            ))}
          </VStack>
          <FormControl as="form" onSubmit={onSubmit}>
            <HStack spacing={2} padding={2}>
              <Input
                name="message"
                ref={register}
                placeholder="Type something..."
                autoComplete="off"
              />
              <Button type="submit">Send</Button>
            </HStack>
          </FormControl>
        </Flex>
      </Center>
    </ChakraProvider>
  );
};
