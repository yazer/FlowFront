import toast from "react-hot-toast";

export function returnErrorToast({
  error,
  locale,
}: {
  error: string | any;
  locale: string;
}) {
  toast.error(error?.translations?.[locale] || error);
}
