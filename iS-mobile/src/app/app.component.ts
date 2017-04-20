import { Component, ViewChild } from '@angular/core';

import { Events, Nav, Platform } from 'ionic-angular';
import { Splashscreen, NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';


import { IssuePostPage } from '../pages/post/post';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html'
})
export class CitysavApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  constructor(
    public events: Events,
    public platform: Platform,
    public storage: Storage
  ) {



    this.platform.ready().then(() => {
      this.nav.push(IssuePostPage);
      Splashscreen.hide();
      this.nav.setRoot(IssuePostPage);
    });


  }

 
  
}
