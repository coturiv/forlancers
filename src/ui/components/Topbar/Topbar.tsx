import { IonButton, IonButtons, IonHeader, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../stores';
import './Topbar.scss';

import { APP_NAME } from '../../../constants';

type TopbarProps = {
  [key: string]: any;
};

const Topbar: React.FC<TopbarProps> = () => {
  const { winStore } = useStore();

  useEffect(() => {
    // Handle F11 event of window
    window.addEventListener('resize', () => winStore.fullscreen(window.innerHeight === window.screen.height));

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, [winStore]);

  return (
    <Fragment>
      {!winStore.isFullScreen ? (
        <IonHeader className="topbar">
          <IonToolbar color="primary">
            <IonThumbnail slot="start" class="topbar-logo">
              <img src="assets/icons/icon.png" alt=""></img>
            </IonThumbnail>
            <IonTitle>{APP_NAME}</IonTitle>

            <IonButtons slot="end">
              {/* button:Minimize */}
              <IonButton onClick={() => winStore.minimize()}>
                <i className="window-icon window-minimize"></i>
              </IonButton>

              {/* button:Maximize/Restore */}
              <IonButton onClick={() => winStore.maximize()}>
                <i className={`window-icon window-${winStore.isMaximized ? 'unmaximize' : 'maximize'}`}></i>
              </IonButton>

              {/* button:Close */}
              <IonButton onClick={() => winStore.close()}>
                <i className="window-icon window-close"></i>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      ) : null}
    </Fragment>
  );
};
export default observer(Topbar);
