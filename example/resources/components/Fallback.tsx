import { hydratable } from "@microeinhundert/radonis";

/*
 * Fallback
 */
interface FallbackProps {
  icon?: IconComponent;
  headline: string;
  text?: string;
}

function Fallback({ icon: Icon, headline, text }: FallbackProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="my-16 space-y-4 text-center text-gray-900">
        {Icon && <Icon className="mx-auto w-60 max-w-full" />}
        <h2 className="text-3xl font-bold">{headline}</h2>
        {text && <p className="max-w-xl text-sm leading-6 text-gray-500">{text}</p>}
      </div>
    </div>
  );
}

export default hydratable("Fallback", Fallback);
