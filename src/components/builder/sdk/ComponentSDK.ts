export const ComponentSDK = {
  wrapComponent(type: string, renderFn: any) {
    return {
      type,
      render: renderFn
    };
  }
};
