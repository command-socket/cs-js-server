/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	7:55 PM -- September 18th, 2019.
 *	Project: @command-socket/server
 */

import WebSocket, { Server as WebSocketServer } from "ws";
import { AventNotifier } from "avents";
import {
	CommandRegistry,
	CommandSetStructure,
	FullCommandSet
} from "@command-socket/core";
import { CommandSocket } from "@command-socket/node-client";

/**
 * A server that is responsible for maintaining many concurrent connections to various clients.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
export class CommandSocketServer<
	LCS extends CommandSetStructure = any,
	RCS extends CommandSetStructure = any> {
	
	private connectionMap: Map<string, CommandSocket<LCS, RCS>>;
	
	private internalServer: WebSocketServer;
	
	private readonly events: CommandSocketServerEvents;
	
	public constructor(port: number, commandRegistry?: CommandRegistry<FullCommandSet<LCS>>) {
	
		this.connectionMap = new Map<string, CommandSocket<LCS, RCS>>();
		
		this.internalServer = new WebSocketServer({ port });
		
		this.events = new CommandSocketServerEvents();
		
		this.internalServer.on("connection", (websocket: WebSocket): void => {
			
			let connection: CommandSocket<LCS, RCS> = new CommandSocket(websocket, commandRegistry);
			
			this.connectionMap.set(connection.getID(), connection);
			
			// FIX-ME [11/26/19 @ 1:58 AM] - This is not the correct way to fix the below issue...
			this.getEvents().CONNECTION_OPENED.notify(connection as unknown as CommandSocket);
			
			connection.getEvents().CLOSE.subscribe((event: { source: CommandSocket<LCS, RCS> }) => {
				
				this.connectionMap.delete(event.source.getID());
				
			});
			
		});
	
	}
	
	public hasConnectionForID(id: string): boolean {
		
		return this.connectionMap.has(id);
		
	}
	
	public getConnectionForID(id: string): CommandSocket<LCS, RCS> | undefined {
		
		return this.connectionMap.get(id);
		
	}
	
	public getCommandRegistry(): any {
	
		// TODO [10/19/19 @ 5:26 PM] - Finish the 'getCommandRegistry' method.
		return undefined;
	
	}
	
	public forEachConnection(callback: (connection: CommandSocket<LCS, RCS>) => any): void {
		
		for (let connection of this.connectionMap.values()) callback(connection);
		
	}
	
	public getEvents(): CommandSocketServerEvents {
		
		return this.events;
		
	}
	
	public close(): void {
		
		this.forEachConnection((connection: CommandSocket<LCS, RCS>) => connection.close());
		this.internalServer.close();
		
	}
	
}

/**
 *
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
export class CommandSocketServerEvents {
	
	public readonly CONNECTION_OPENED: AventNotifier<CommandSocket>;
	
	public readonly CONNECTION_CLOSED: AventNotifier<void>;
	
	public constructor() {
		
		this.CONNECTION_OPENED = new AventNotifier<CommandSocket>();
		this.CONNECTION_CLOSED = new AventNotifier<void>();
		
	}
	
}