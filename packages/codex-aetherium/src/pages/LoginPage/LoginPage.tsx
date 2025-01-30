import { Button, DEFAULT_GAP, WalletSelectModal } from '@aetherisnova/ui-components';
import { Heading, Spacer, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const LoginPage: FC = () => {
  const { t } = useTranslation();
  const { onClose: onWalletSelectDialogClose, onOpen: onWalletSelectDialogOpen, open: walletSelectDialogOpen } = useDisclosure();
  // handlers
  const handleOnConnectClick = () => onWalletSelectDialogOpen();

  return (
    <>
      <WalletSelectModal onClose={onWalletSelectDialogClose} open={walletSelectDialogOpen} />

      <Spacer />

      <VStack gap={DEFAULT_GAP / 2} maxW="768px" p={DEFAULT_GAP}>
        <Heading fontSize="2xl">
          {t('headings.welcome')}
        </Heading>

        <Text fontSize="sm" textAlign="center">
          {t('captions.description')}
        </Text>
      </VStack>

      <VStack gap={DEFAULT_GAP / 2} maxW="768px" p={DEFAULT_GAP}>
        <Text fontSize="sm" textAlign="center">
          {t('captions.login')}
        </Text>

        <Button onClick={handleOnConnectClick} maxW="350px" w="full">
          {t('labels.connect')}
        </Button>
      </VStack>

      <Spacer />
    </>
  );
};

export default LoginPage;
