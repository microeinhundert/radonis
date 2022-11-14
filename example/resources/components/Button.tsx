/* eslint-disable jsx-a11y/anchor-has-content */
import type { RouteIdentifier, RouteParams } from "@microeinhundert/radonis";
import { hydratable } from "@microeinhundert/radonis";
import { useUrlBuilder } from "@microeinhundert/radonis";

import { clsx } from "../utils/string";

/*
 * Shared
 */
export enum ButtonColor {
  Emerald = "emerald",
  Red = "red",
  White = "white",
  WhiteDanger = "white-danger",
}

type ButtonTag = "a" | "button";

type ButtonBaseProps<Tag extends ButtonTag> = HTMLProps<Tag> & {
  small?: boolean;
  round?: boolean;
  disabled?: boolean;
  icon?: IconComponent;
  color?: ButtonColor;
};

function getButtonColorClasses(color: ButtonColor) {
  return {
    [ButtonColor.Emerald]: `border-emerald-600 text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500`,
    [ButtonColor.Red]: `border-red-600 text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`,
    [ButtonColor.White]: `border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:ring-emerald-500`,
    [ButtonColor.WhiteDanger]: `border-gray-200 text-gray-700 bg-white hover:bg-red-600 hover:text-white focus:ring-red-500`,
  }[color];
}

function useButtonProps<Tag extends ButtonTag>(props: ButtonBaseProps<Tag>) {
  const {
    children,
    small,
    round,
    disabled,
    icon,
    color = ButtonColor.Emerald,
    className,
    ...propsWeDontControl
  } = props;

  return {
    getProps: (defaults?: HTMLProps<Tag>) => ({
      ...(defaults ?? {}),
      ...propsWeDontControl,
      className: clsx(
        "flex justify-center items-center gap-2",
        "border font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        children ? (small ? "px-3 py-1" : "px-4 py-2") : small ? "px-1 py-1" : "px-2 py-2",
        small ? "text-xs" : "text-sm",
        round ? "rounded-full" : "rounded-lg",
        disabled && "opacity-25 pointer-events-none",
        getButtonColorClasses(color),
        className
      ),
    }),
    ...props,
  };
}

/*
 * Button Content
 */
function ButtonContent<Tag extends ButtonTag>({
  children,
  title,
  small,
  icon: Icon,
}: ButtonBaseProps<Tag>) {
  return (
    <>
      {children ?? (title && <div className="sr-only">{title}</div>)}
      {Icon && <Icon className={clsx(small ? "h-3 w-3" : "h-5 w-5")} />}
    </>
  );
}

/*
 * Anchor Button
 */
interface AnchorButtonProps extends ButtonBaseProps<"a"> {}

function AnchorButton(props: AnchorButtonProps) {
  const { getProps, disabled, children } = useButtonProps<"a">(props);

  return (
    <a {...getProps({ "aria-disabled": disabled ? "true" : undefined })}>
      <ButtonContent<"a"> {...props}>{children}</ButtonContent>
    </a>
  );
}

/*
 * Link Button
 */
interface LinkButtonProps extends ButtonBaseProps<"a"> {
  href?: never;
  to: RouteIdentifier;
  params?: RouteParams;
  queryParams?: RouteParams;
}

function LinkButton({ to, params, queryParams, ...restProps }: LinkButtonProps) {
  const { getProps, disabled, children } = useButtonProps<"a">(restProps);
  const { make } = useUrlBuilder();

  return (
    <a
      {...getProps({
        "aria-disabled": disabled ? "true" : undefined,
        "href": make(to, { params, queryParams }),
      })}
    >
      <ButtonContent<"a"> {...restProps}>{children}</ButtonContent>
    </a>
  );
}

/*
 * Button
 */
interface ButtonProps extends ButtonBaseProps<"button"> {}

function Button(props: ButtonProps) {
  const { getProps, disabled, children } = useButtonProps<"button">(props);

  return (
    <button {...getProps({ type: "button", disabled })}>
      <ButtonContent<"button"> {...props}>{children}</ButtonContent>
    </button>
  );
}

Button.Anchor = AnchorButton;
Button.Link = LinkButton;

export default hydratable("Button", Button);
