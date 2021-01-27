let IpcChannels: Record<string, any> = {};

enum WindowState {
  Normal = 'window:normal',
  Minimized = 'window:minimized',
  Maximized = 'window:maximized',
  Fullscreen = 'window:fullscreen',
  Closed = 'window:closed',
  Focused = 'window:focused',
  Blurred = 'window:blurred'
}

((IpcChannels) => {
  ((Api) => {
    Api['SelectDir'] = 'app:select-dir';
    Api['SelectFile'] = 'app:select-file';
    Api['GetConfigPath'] = 'app:get-config-path';
    Api['GetAppPath'] = 'api:get-app-path';
    Api['OpenUrl'] = 'api:open-url';
    Api['OpenPath'] = 'api:open-path';
  })(IpcChannels.Api || (IpcChannels.Api = {}));

  ((Window) => {
    Window['ResizeToLogin'] = 'window:resize-to-login';
    Window['ResizeToDefault'] = 'window:resize-to-default';
    Window['Resize'] = 'window:resize';
    Window['IsMaximized'] = 'window:is-maximized';
    Window['Maximize'] = 'window:maximize';
    Window['IsMinimized'] = 'window:is-minimized';
    Window['Minimize'] = 'window:minimize';
    Window['IsFocused'] = 'window:is-focused';
    Window['IsBlurred'] = 'window:is-blurred';
    Window['IsClosed'] = 'window:is-closed';
    Window['Close'] = 'window:close';
    Window['StateChanged'] = 'window:state-changed';
  })(IpcChannels.Window || (IpcChannels.Window = {}));
})((IpcChannels = IpcChannels || {}));

export { IpcChannels, WindowState };
