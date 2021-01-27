import { observable, action, computed, makeObservable } from 'mobx';
import { IpcChannels, WindowState } from '../../models/ipc-events';
import { ElectronApi } from '../api';

export default class WinStore {
  @observable
  private windowState: WindowState = WindowState.Normal;

  @observable
  size: [number, number];

  @computed
  get isMinimized() {
    return true;
  }

  @computed
  get isMaximized() {
    return this.windowState === WindowState.Maximized;
  }

  @computed
  get isClosed() {
    return true;
  }

  @computed
  get isFocused() {
    return true;
  }

  @computed
  get isFullScreen() {
    return this.windowState === WindowState.Fullscreen;
  }

  private electronApi: ElectronApi;

  constructor() {
    makeObservable(this);

    this.electronApi = ElectronApi.getInstance();

    this.electronApi.listenIpc(IpcChannels.Window.StateChanged, (_, state: WindowState) => this.setState(state));

    // Handle F11 event of window
    window.addEventListener('resize', () => this.fullscreen(window.innerHeight === window.screen.height));
  }

  @action
  setState(state: WindowState) {
    this.windowState = state;
  }

  @action
  resize(size: [number?, number?]) {
    console.log('Resize', size);
  }

  @action
  close() {
    this.electronApi.send(IpcChannels.Window.Close);
    this.windowState = WindowState.Closed;
  }

  @action
  minimize() {
    this.electronApi.send(IpcChannels.Window.Minimize);
    this.windowState = this.windowState !== WindowState.Minimized ? WindowState.Minimized : WindowState.Minimized;
  }

  @action
  maximize() {
    this.electronApi.send(IpcChannels.Window.Maximize);
    this.windowState = this.windowState !== WindowState.Maximized ? WindowState.Maximized : WindowState.Minimized;
  }

  @action
  fullscreen(fullscreen: boolean) {
    if (!this.isFullScreen && !fullscreen) {
      return;
    }

    this.windowState = fullscreen ? WindowState.Fullscreen : WindowState.Normal;
  }
}
