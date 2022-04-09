import { I18n } from '../internal/I18n';
import { useHydration } from './useHydration';
import { useManifest } from './useManifest';

export const useI18n = () => {
  const { locale, translations } = useManifest();
  const { isChildOfHydrationRoot } = useHydration();

  return new I18n(locale, translations, isChildOfHydrationRoot);
};
