import type { actions, policies } from "../start/bouncer";

declare module "@ioc:Adonis/Addons/Bouncer" {
  type ApplicationActions = ExtractActionsTypes<typeof actions>;
  type ApplicationPolicies = ExtractPoliciesTypes<typeof policies>;

  interface ActionsList extends ApplicationActions {}
  interface PoliciesList extends ApplicationPolicies {}
}
