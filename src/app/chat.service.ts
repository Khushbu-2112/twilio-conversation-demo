import { Injectable, OnInit } from '@angular/core';
import { Client, Conversation, Message } from "@twilio/conversations";

export enum chatChannelType {
  ResidentToResident,
  ResidentToProvider,
  ResidentToAdmin,
  ResidentToFlamingoAdmin,
  ProviderToBuildingAdmin,
}

@Injectable({
    providedIn: 'root'
})
export class ChatService implements OnInit{

  chatClient:Client;
  currentTime;

  constructor(
    ) {
  }

  // twilio functions
    getChannnel(sid: string): Promise<Conversation> {
      return this.chatClient.getConversationBySid(sid);
    }

    getChannelChat(channel,index) {
      let size = 30;
      return channel.getMessages(size,index);
    }

    createPrivateChannel(friendlyName: string) {
      return this.chatClient.createConversation({friendlyName});
    }

    async getLastMessage(channel: Conversation,no) {
      let response = await channel.getMessages(1,no);
      return response.items.length > 0 ? response.items[0].body : '';
    }

    async getUnconsumedMessage(channel: Conversation) {
      let response = await channel.getUnreadMessagesCount();
      if(response == null){
        let lastMsg = await channel.getMessages(1);
        response = lastMsg && lastMsg.items.length > 0 ? lastMsg.items[0].index + 1 : 0;
       }
      return response;
    }


  ngOnInit(){
    this.currentTime = new Date();
    console.log('in service');
    this.getGeneratedToken();
  }

  getGeneratedToken(){
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJpc3MiOiJTSzFkNmI3MTM0MTEwNjdhNjYwNTc2MjRhYWNhNDVjZGY2IiwiZXhwIjoxNjU4Mjk3MTcwLCJqdGkiOiJTSzFkNmI3MTM0MTEwNjdhNjYwNTc2MjRhYWNhNDVjZGY2LTE2NTgyOTM1NzAiLCJzdWIiOiJBQzEyNTQ5NDRjMDJjYjI1YmJmNGQ4ZDNlNGIzOWY5ZjA4IiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiNWVkNzc0YTA1ZmEwNzU0ZGEyNjRjM2RiIiwiY2hhdCI6eyJzZXJ2aWNlX3NpZCI6IklTYjZmM2YwZGVjZjMwNGY0ZTlkNzlmMjkxY2MxMTYyOWUifX19.9RMou9ec7RUbCYv_Le_l4q2dBY89LIfbAgxS633sRX8";
    this.connect(token);
  }

  connect(token){
    this.chatClient = new Client(token);
    this.listenToEvents();
  }

  listenToEvents(){
    this.chatClient.on('stateChanged', (state) => {
      if (state === 'initialized') {
        console.log('in initialized');
      }
    });

    this.chatClient.on('conversationAdded', (conv:Conversation) =>{
      if(conv.dateCreated > this.currentTime){
        console.log('new chat created');
      }
    });

    this.chatClient.on('messageAdded', (msg:Message) =>{
      console.log('message added');
    });

    this.chatClient.on('connectionError', (err) =>{
      console.log('Connection not made, please refresh the page.');
    });
  }

}
