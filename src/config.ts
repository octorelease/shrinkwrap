export const DEFAULT_FILTERS = ["dev", "extraneous"];

export interface IPluginConfig {
    filters?: string[];
    packages?: string[];
}
