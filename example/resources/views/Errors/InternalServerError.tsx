import { useI18n } from "@microeinhundert/radonis";
import Fallback from "Components/Fallback";
import ErrorIllustration from "Components/Illustrations/ErrorIllustration";

interface InternalServerErrorProps {
  error: unknown;
}

function InternalServerError({ error }: InternalServerErrorProps) {
  const { formatMessage } = useI18n();

  const messages = {
    headline: formatMessage("errors.internalServerError.headline"),
    text: formatMessage("errors.internalServerError.text", {
      message: error instanceof Error ? error.message : "-",
    }),
  };

  return (
    <div className="h-screen">
      <Fallback {...messages} icon={ErrorIllustration} />
    </div>
  );
}

export { InternalServerError };
