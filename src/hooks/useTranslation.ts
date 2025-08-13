import en from "../locales/en";
import ar from "../locales/ar";
import { useIntl } from "react-intl";

export const translationMessage: any = { en, ar };

function useTranslation(languageProps?: string) {
  const { locale } = useIntl();
  const translate = (text: any) =>
    // @ts-ignore
    translationMessage?.[languageProps || locale]?.[text] || text;
  return { translate };
}

export default useTranslation;
