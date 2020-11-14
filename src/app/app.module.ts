import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CodeEditorModule ,CodeEditorService} from '@ngstack/code-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CodeEditorModule.forRoot({
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
