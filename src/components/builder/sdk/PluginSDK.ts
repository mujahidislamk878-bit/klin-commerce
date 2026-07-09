export interface KlinPlugin {
  name: string;
  init(sdk: any): void;
}

export const PluginSDK = {
  register(plugin: KlinPlugin, sdkInstance: any) {
    plugin.init(sdkInstance);
  }
};
