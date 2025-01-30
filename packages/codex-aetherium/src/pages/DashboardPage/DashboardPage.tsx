import { DEFAULT_GAP } from '@aetherisnova/ui-components';
import { Heading, Spacer, VStack } from '@chakra-ui/react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Spacer />

      <VStack p={DEFAULT_GAP} w="full">
        <Heading fontSize="2xl">
          {`Dashboard`}
        </Heading>
      </VStack>

      <Spacer />
    </>
  );
};

export default DashboardPage;
