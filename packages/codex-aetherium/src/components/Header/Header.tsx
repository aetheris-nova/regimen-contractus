import {
  BUTTON_HEIGHT,
  DEFAULT_GAP,
  type IBaseComponentProps,
  IconButton,
  Tooltip,
} from '@aetherisnova/ui-components';
import { truncateText } from '@aetherisnova/utils';
import { HStack, Spacer, VStack, Heading, Text, Spinner } from '@chakra-ui/react';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GrPower } from 'react-icons/gr';
import { formatUnits } from 'viem';

// hooks
import useForegroundColor from '@client/hooks/useForegroundColor';

// icons
import CaLogo from '@client/icons/CaLogo';
import EvGas from '@client/icons/EvGas';

// types
import type { IProps } from './types';

// utils
import ellipseText from '@client/utils/ellipseText';

const Header: FC<IProps> = ({ account, colorMode, fetchingWorldConfig, onDisconnectClick, worldConfig }) => {
  const { t } = useTranslation();
  // hooks
  const foregroundColor = useForegroundColor();
  // memos
  const baseProps = useMemo<Partial<IBaseComponentProps>>(() => ({
    colorMode,
  }), [colorMode]);
  const gasBalanceInStandardForm = useMemo(() => {
    if (!account || !worldConfig) {
      return '-';
    }

    return formatUnits(BigInt(account.gasBalanceWei), worldConfig.nativeCurrency.decimals);
  }, [account, worldConfig]);

  return (
    <HStack
      as="header"
      borderColor={foregroundColor}
      borderBottomWidth={1}
      minH={BUTTON_HEIGHT}
      w="full"
    >
      <CaLogo
        size="2xl"
        ml={DEFAULT_GAP / 3}
      />

      <Spacer />

      <HStack gap={DEFAULT_GAP / 3} justify="flex-end" h="full" w="full">
        {fetchingWorldConfig && (
          <Spinner pr={worldConfig ? (DEFAULT_GAP / 3) : 0} size="md" />
        )}

        {account && worldConfig && (
          <HStack>
            {/*details*/}
            <VStack
              align="end"
              gap={0}
              justify="space-evenly"
            >
              {/*name/account*/}
              {account.isSmartCharacter ? (
                <Tooltip content={account.name}>
                  <Heading fontSize="md" fontWeight="bold">
                    {account.name.length > 25 ? truncateText(account.name, {
                      length: 25,
                    }) : account.name}
                  </Heading>
                </Tooltip>
              ) : (
                <Tooltip content={account.address}>
                  <Heading fontSize="md" fontWeight="bold">
                    {ellipseText(account.address, {
                      end: 5,
                      start: 5,
                    })}
                  </Heading>
                </Tooltip>
              )}

              {/*gas balance*/}
              <Tooltip content={`${gasBalanceInStandardForm} ${worldConfig.nativeCurrency.symbol}`}>
                <HStack gap={1} justify="end" w="full">
                  <Text fontSize="sm">
                    {gasBalanceInStandardForm}
                  </Text>

                  <EvGas color={foregroundColor} size="sm" />
                </HStack>
              </Tooltip>
            </VStack>

            {/*actions*/}
            <HStack gap={0}>
              <Tooltip content={t('labels.disconnect')}>
                <IconButton
                  {...baseProps}
                  borderLeftWidth={1}
                  onClick={onDisconnectClick}
                  scheme="secondary"
                  variant="ghost"
                >
                  <GrPower />
                </IconButton>
              </Tooltip>
            </HStack>
          </HStack>
        )}
      </HStack>
    </HStack>
  );
};

export default Header;
