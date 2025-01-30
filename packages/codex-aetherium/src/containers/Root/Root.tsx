import { DEFAULT_GAP, LoadingModal } from '@aetherisnova/ui-components';
import { Flex, VStack } from '@chakra-ui/react';
import { type FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import type { Address } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';

// components
import Header from '@client/components/Header';
import Footer from '@client/components/Footer';

// constants
import { BODY_BACKGROUND_COLOR } from '@client/constants';

// hooks
import useForegroundColor from '@client/hooks/useForegroundColor';

// selectors
import { useSelectColorMode, useSelectSelectedAccount, useSelectWorldConfig } from '@client/selectors';

// utils
import useStore from '@client/utils/useStore';

const Root: FC = () => {
  const { t } = useTranslation();
  const { addresses } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const {
    fetchingWorldConfig,
    fetchWorldConfigAction,
    loadingModalDetails,
    setAccountsAction,
    startPollingForSmartCharacterAction,
    stopPollingForSmartCharacterAction,
    subtitle,
    title,
  } = useStore();
  // selectors
  const account = useSelectSelectedAccount();
  const colorMode = useSelectColorMode();
  const worldConfig = useSelectWorldConfig();
  // hooks
  const foregroundColor = useForegroundColor();
  // handlers
  const handleOnDisconnectClick = async () => {
    await disconnectAsync();
    await setAccountsAction([]); // remove any stored account data
  };

  useEffect(() => {
    (async () => {
      await fetchWorldConfigAction();

      // start polling for smart character details
      startPollingForSmartCharacterAction();
    })();

    // stop polling if unmounted
    return () => stopPollingForSmartCharacterAction();
  }, []);
  useEffect(() => {
    (async () => addresses && await setAccountsAction(addresses as Address[]))();
  }, [addresses]);

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>
          {title ? `${title}${subtitle ? ` - ${subtitle}`: ''}` : import.meta.env.VITE_TITLE}
        </title>

        <meta
          content={t('captions.description')}
          name="description"
        />
      </Helmet>

      {/*modals*/}
      <LoadingModal
        message={loadingModalDetails?.message || t('captions.pleaseWait')}
        open={!!loadingModalDetails && loadingModalDetails.loading}
        title={loadingModalDetails?.title || t('headings.loading')}
      />

      {/*content*/}
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
            <Header
              account={account}
              colorMode={colorMode}
              fetchingWorldConfig={fetchingWorldConfig}
              onDisconnectClick={handleOnDisconnectClick}
              worldConfig={worldConfig}
            />

            <VStack as="main" flex={1} w="full">
              <Outlet />
            </VStack>
          </VStack>

          <Footer />
        </VStack>
      </Flex>
    </>
  );
};

export default Root;
