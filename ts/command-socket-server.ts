/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	7:55 PM -- September 18th, 2019.
 *	Project: @command-socket/server
 */

import WebSocket, { Server as WebSocketServer } from "ws";
import { AventNotifier } from "avents";
import {
	CommandRegistry,
	CommandSetStructure
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
	RCS extends CommandSetStructure = any,
	M extends {} = {}> {
	
	/**
	 * A mapping from CommandSocket IDs to CommandSockets, including all currently connected clients.
	 */
	private connectionMap: Map<string, CommandSocket<LCS, RCS, M>>;
	
	// DOC-ME [1/13/20 @ 12:14 PM] - Documentation required!
	private internalServer: WebSocketServer;
	
	// DOC-ME [1/13/20 @ 12:14 PM] - Documentation required!
	private readonly events: CommandSocketServerEvents;
	
	/**
	 * Initializes a new CommandSocketServer with a a specified port and, optionally, a CommandRegistry to use for each
	 * spawned serverside CommandSocket.
	 *
	 * @param port The port on which to start the CommandSocketServer.
	 * @param commandRegistry The CommandRegistry to use for each spawned serverside CommandSocket.
	 */
	public constructor(port: number, commandRegistry?: CommandRegistry<LCS>) {
	
		this.connectionMap = new Map<string, CommandSocket<LCS, RCS, M>>();
		
		this.internalServer = new WebSocketServer({ port });
		
		this.events = new CommandSocketServerEvents();
		
		this.internalServer.on("connection", async (websocket: WebSocket): Promise<void> => {
			
			let connection: CommandSocket<LCS, RCS, M> = await CommandSocket.create(websocket, commandRegistry);
			
			this.connectionMap.set(connection.getID(), connection);
			
			// FIX-ME [11/26/19 @ 1:58 AM] - This is not the correct way to fix the below issue...
			this.getEvents().CONNECTION_OPENED.notify(connection as unknown as CommandSocket);
			
			connection.getEvents().CLOSE.subscribe((event: { source: CommandSocket }): void => {
				
				this.connectionMap.delete(event.source.getID());
				
			});
			
		});
	
	}
	
	/**
	 * Returns true if the instance has a connection to a client CommandSocket with the specified ID.
	 *
	 * @param id The ID to check for an associated connected client.
	 * @return true if the instance has a connection to a client CommandSocket with the specified ID.
	 */
	public hasConnectionForID(id: string): boolean {
		
		return this.connectionMap.has(id);
		
	}
	
	// DOC-ME [1/13/20 @ 12:14 PM] - Documentation required!
	public getConnectionForID(id: string): CommandSocket<LCS, RCS, M> | undefined {
		
		return this.connectionMap.get(id);
		
	}
	
	// DOC-ME [1/13/20 @ 12:14 PM] - Documentation required!
	public getCommandRegistry(): any {
	
		// TODO [10/19/19 @ 5:26 PM] - Finish the 'getCommandRegistry' method.
		return undefined;
	
	}
	
	// DOC-ME [1/13/20 @ 12:14 PM] - Documentation required!
	public forEachConnection(callback: (connection: CommandSocket<LCS, RCS, M>) => any): void {
		
		for (let connection of this.connectionMap.values()) callback(connection);
		
	}
	
	/**
	 * Returns a collection of events relevant to this CommandSocketServer instance.
	 *
	 * @return A collection of events relevant to this CommandSocketServer instance.
	 */
	public getEvents(): CommandSocketServerEvents {
		
		return this.events;
		
	}
	
	/**
	 * Properly closes the server, including all of it's associated connections to client CommandSockets.
	 */
	public close(): void {
		
		this.forEachConnection((connection: CommandSocket<LCS, RCS, M>): any => connection.close());
		this.internalServer.close();
		
	}
	
}

/**
 * An enumeration of events relevant to any given CommandSocketServer instance.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 * @see CommandSocketServer#getEvents
 */
export class CommandSocketServerEvents {
	
	// DOC-ME [1/13/20 @ 12:16 PM] - Documentation required!
	public readonly CONNECTION_OPENED: AventNotifier<CommandSocket>;
	
	// DOC-ME [1/13/20 @ 12:16 PM] - Documentation required!
	public readonly CONNECTION_CLOSED: AventNotifier<void>;
	
	// DOC-ME [1/13/20 @ 12:16 PM] - Documentation required!
	public constructor() {
		
		this.CONNECTION_OPENED = new AventNotifier<CommandSocket>();
		this.CONNECTION_CLOSED = new AventNotifier<void>();
		
	}
	
}