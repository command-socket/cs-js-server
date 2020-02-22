"use strict";var __awaiter=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function s(e){try{a(o.next(e))}catch(e){i(e)}}function c(e){try{a(o.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,c)}a((o=o.apply(e,t||[])).next())}))};Object.defineProperty(exports,"__esModule",{value:!0});const ws_1=require("ws"),avents_1=require("avents"),node_client_1=require("@command-socket/node-client");class CommandSocketServer{constructor(e,t){this.connectionMap=new Map,this.internalServer=new ws_1.Server({port:e}),this.events=new CommandSocketServerEvents,this.internalServer.on("connection",e=>__awaiter(this,void 0,void 0,(function*(){let n=yield node_client_1.CommandSocket.create(e,t);this.connectionMap.set(n.getID(),n),this.getEvents().CONNECTION_OPENED.notify(n),n.getEvents().CLOSE.subscribe(e=>{this.connectionMap.delete(e.source.getID())})})))}hasConnectionForID(e){return this.connectionMap.has(e)}getConnectionForID(e){return this.connectionMap.get(e)}getCommandRegistry(){}forEachConnection(e){for(let t of this.connectionMap.values())e(t)}getEvents(){return this.events}close(){this.forEachConnection(e=>e.close()),this.internalServer.close()}}exports.CommandSocketServer=CommandSocketServer;class CommandSocketServerEvents{constructor(){this.CONNECTION_OPENED=new avents_1.AventNotifier,this.CONNECTION_CLOSED=new avents_1.AventNotifier}}exports.CommandSocketServerEvents=CommandSocketServerEvents;
//# sourceMappingURL=command-socket-server.js.map
