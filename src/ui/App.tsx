import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter, IonReactHashRouter } from '@ionic/react-router';
import Home from './pages/Home';

import './App.scss';

import { StoreProvider } from './stores';

import Topbar from './components/Topbar';
import Footer from './components/Footer';

const Router = isPlatform('electron') ? IonReactHashRouter : IonReactRouter;

const RouterWrapper = ({ children }: any) => <Router>{children}</Router>;

const App: React.FC = () => (
  <IonApp>
    <StoreProvider>
      {/* Topbar */}
      <Topbar></Topbar>

      <RouterWrapper>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
        </IonRouterOutlet>
      </RouterWrapper>

      {/* Footer */}
      <Footer></Footer>
    </StoreProvider>
  </IonApp>
);

export default App;
