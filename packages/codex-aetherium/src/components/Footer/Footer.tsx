import { HStack, Text } from '@chakra-ui/react';
import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <HStack
      align="center"
      as="footer"
      justify="space-between"
      py={1}
      w="full"
    >
      <Text fontSize="xs">{import.meta.env.VITE_TITLE}</Text>

      {/*version*/}
      <Text fontSize="xs">{`v${__VERSION__}`}</Text>
    </HStack>
  );
};

export default Footer;
