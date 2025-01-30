import { DEFAULT_GAP } from '@aetherisnova/ui-components';
import { Flex, VStack } from '@chakra-ui/react';
import type { FC, PropsWithChildren } from 'react';

// components
// import Footer from '@client/components/Footer';
// import Header from '@client/components/Header';

// constants
import { BODY_BACKGROUND_COLOR } from '@client/constants';

// hooks
import useForegroundColor from '@client/hooks/useForegroundColor';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  // hooks
  const foregroundColor = useForegroundColor();

  return (
    <Flex
      backgroundColor={BODY_BACKGROUND_COLOR}
      justify="center"
      w="full"
    >
      <VStack
        gap={0}
        maxW="1024px"
        minH="100vh"
        pt={DEFAULT_GAP / 2}
        px={DEFAULT_GAP / 2}
        w="full"
      >
        <VStack
          borderColor={foregroundColor}
          borderWidth={1}
          flex={1}
          gap={0}
          w="full"
        >
          {/*<Header />*/}

          <VStack as="main" flex={1} w="full">
            {children}
          </VStack>
        </VStack>

        {/*<Footer />*/}
      </VStack>
    </Flex>
  );
};

export default Layout;
