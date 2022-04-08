import { useManifest } from '../internal/hooks/useManifest';
import { I18n } from '../internal/I18n';

export const useI18n = () => {
  const { locale, translations } = useManifest();

  return new I18n(locale, translations);
};
