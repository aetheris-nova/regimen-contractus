import { createLogger } from '@aetherisnova/utils';
import I18next, { type i18n } from 'i18next';
import { createElement } from 'react';
import { initReactI18next } from 'react-i18next';
import { createRoot } from 'react-dom/client';

// components
import App from '@client/containers/App';

// translations
import { en } from '@client/translations';

export async function onDOMContentLoaded(): Promise<void> {
  const logger = createLogger(import.meta.env.DEV ? 'debug' : 'error');
  const rootElement = document.getElementById('root');
  let _i18n: i18n;

  if (!rootElement) {
    logger.error(`failed to find "root" element to render react app`);

    return;
  }

  _i18n = I18next.use(initReactI18next);

  await _i18n.init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
    },
  });

  createRoot(rootElement).render(
    createElement(App, {
      i18n: _i18n,
    })
  );
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
