import { DEFAULT_GAP } from '@aetherisnova/ui-components';
import { Heading, Spacer, Text, VStack } from '@chakra-ui/react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const WelcomePage: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Spacer />

      <VStack p={DEFAULT_GAP} w="full">
        <Heading fontSize="2xl">
          {t('headings.welcome')}
        </Heading>

        <Text fontSize="sm" textAlign="center">
          {t('captions.description')}
        </Text>
      </VStack>

      <Spacer />
    </>
  );
};

export default WelcomePage;
