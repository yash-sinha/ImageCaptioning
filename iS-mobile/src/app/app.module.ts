import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CitysavApp } from './app.component';
import { IssuePostPage } from '../pages/post/post';


import { PostDetailPage } from '../pages/postdetail/postdetail';

import { TextToSpeech } from '@ionic-native/text-to-speech'



@NgModule({
  declarations: [
    CitysavApp,
    IssuePostPage,
    PostDetailPage
  ],
  imports: [
    IonicModule.forRoot(CitysavApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CitysavApp,
    IssuePostPage,
    PostDetailPage
  ],
  providers: [ Storage, TextToSpeech]

})
export class AppModule { }