import { CogIcon, CubeIcon, HomeIcon } from "@heroicons/react/24/outline";

import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { useNavigationBuilder } from "./useNavigationBuilder";

export function useNavigation() {
  const user = useAuthenticatedUser();
  const navigationBuilder = useNavigationBuilder();

  return {
    primary: navigationBuilder.make([
      {
        identifier: "home",
        routeIdentifier: "HomeController.index",
        icon: HomeIcon,
        canAccess: () => !user,
      },
      {
        identifier: "dashboard",
        routeIdentifier: "DashboardController.index",
        icon: HomeIcon,
        canAccess: () => !!user,
      },
      {
        identifier: "gardens",
        routeIdentifier: "GardensController.index",
        icon: CubeIcon,
        canAccess: () => !!user,
      },
    ]),
    secondary: navigationBuilder.make([
      {
        identifier: "settings",
        routeIdentifier: "SettingsController.index",
        icon: CogIcon,
        canAccess: () => !!user,
      },
    ]),
  };
}
