import { FormattedMessage } from "react-intl";
import useTranslation from "../../hooks/useTranslation";

function TabMenuNew({
  selected,
  tabs,
  handleChange,
}: {
  selected: string;
  tabs?: string[];
  handleChange?: (value: string) => void;
}) {
  const { translate } = useTranslation();
  return (
    <div>
      <div className="inline-flex rounded-lg border border-blue-600 p-1 bg-blue-50">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => handleChange?.(tab)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              selected === tab
                ? "bg-primary text-white shadow-sm"
                : "text-blue-600 hover:bg-blue-100"
            }`}
          >
            <FormattedMessage id={tab}></FormattedMessage>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabMenuNew;
