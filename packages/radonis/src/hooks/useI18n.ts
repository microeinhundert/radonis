import { useManifest } from '../internal/hooks/useManifest';
import { I18n } from '../internal/I18n';
import { useHydration } from './useHydration';

export const useI18n = () => {
  const { locale, translations } = useManifest();
  const { isInsideHydrationRoot } = useHydration();

  return new I18n(locale, translations, isInsideHydrationRoot);
};
