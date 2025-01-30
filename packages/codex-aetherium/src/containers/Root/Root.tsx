import { LoadingModal } from '@aetherisnova/ui-components';
import { type FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

// components
import Layout from '@client/components/Layout';

// utils
import useStore from '@client/utils/useStore';

const Root: FC = () => {
  const { t } = useTranslation();
  const {
    fetchWorldConfigAction,
    loadingModalDetails,
    subtitle,
    title,
  } = useStore();

  useEffect(() => {
    (async () => {
      await fetchWorldConfigAction();
    })();
  }, []);

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

      <Layout>
        <Outlet />
      </Layout>
    </>
  );
};

export default Root;
