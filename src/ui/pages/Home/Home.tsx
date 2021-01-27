import { IonContent, IonPage, IonButton, IonIcon, IonList, IonListHeader, IonSearchbar } from '@ionic/react';
import React from 'react';
import { add } from 'ionicons/icons';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonList lines="full" className="client-list">
          <IonListHeader lines="full">
            <IonSearchbar placeholder="Search..." showCancelButton="never"></IonSearchbar>

            <IonButton onClick={() => {}} fill="clear">
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonListHeader>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
