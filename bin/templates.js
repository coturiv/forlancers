// Component.tsx
exports.component = (name) => `import React from 'react';
import './${name}.scss';

type ${name}Props = {
  [key: string]: any;
};

const ${name}: React.FC<${name}Props> = () => {
  return <div>Hello, I am a ${name} component.</div>;
};
export default ${name};
`;

// Page.tsx
exports.page = (name) => `import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './${name}.scss';

type ${name}Props = {
  [key: string]: any;
};

const ${name}: React.FC<${name}Props> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default ${name};
`;

// index.ts
exports.barrel = (name) => `import ${name} from './${name}';

export default ${name};
`;
