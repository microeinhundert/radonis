import { HydrationRoot } from "@microeinhundert/radonis";

import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { useNavigation } from "../hooks/useNavigation";
import type { NavigationItem } from "../hooks/useNavigationBuilder";
import { clsx } from "../utils/string";
import Logo from "./Logo";
import SidebarUserInfo from "./SidebarUserInfo";

/*
 * Sidebar Navigation Item
 */
interface SidebarNavigationItemProps extends NavigationItem {
  dense?: boolean;
}

function SidebarNavigationItem({
  name,
  href,
  icon: Icon,
  current,
  dense,
}: SidebarNavigationItemProps) {
  return (
    <a
      className={clsx(
        "group flex items-center rounded-md px-2 text-sm font-medium",
        dense ? "py-2" : "py-3",
        current
          ? "bg-gray-100 text-emerald-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      href={href}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={clsx(
            `mr-3 h-6 w-6 flex-shrink-0`,
            current ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-500"
          )}
        />
      )}
      {name}
    </a>
  );
}

/*
 * Sidebar
 */
function Sidebar() {
  const navigation = useNavigation();
  const user = useAuthenticatedUser();

  return (
    <div className="flex h-full flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto py-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <Logo className="h-8 w-auto" />
        </div>
        <nav className="mt-5 flex-1">
          {!!navigation.primary.length && (
            <div className="space-y-1 px-2">
              {navigation.primary.map((item) => (
                <SidebarNavigationItem key={item.href} {...item} />
              ))}
            </div>
          )}
          {!!navigation.secondary.length && (
            <>
              <hr className="my-5 border-t border-gray-200" />
              <div className="space-y-1 px-2">
                {navigation.secondary.map((item) => (
                  <SidebarNavigationItem key={item.href} dense={true} {...item} />
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
      <HydrationRoot disabled={!user}>
        <SidebarUserInfo />
      </HydrationRoot>
    </div>
  );
}

export default Sidebar;
