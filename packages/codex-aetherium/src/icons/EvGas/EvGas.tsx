import { Icon, IconProps } from '@chakra-ui/react';
import type { FC } from 'react';

const EvGas: FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 17 23">
        <path
          d="M5.084 17.302H.254L8.413.879l8.158 16.423H11.74l-3.33-7.37-3.327 7.37Zm1.031 0h4.596v5.189H6.115v-5.189Z"
          fill="currentColor"
        />
      </svg>
    </Icon>
  );
};

export default EvGas;
