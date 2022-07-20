import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
export function chat_Init(chatService: ChatService) {
  return () => chatService.ngOnInit();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: chat_Init,
      deps: [ChatService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
