/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	11:31 PM -- November 23rd, 2019.
 *	Project: @command-socket/server
 */

import * as delicate from "@t99/delicate";
import { CommandSocketServer } from "../../command-socket-server";

const main: () => Promise<void> = async (): Promise<void> => {
	
	const PORT: number = 5437;
	
	console.log("Starting server on port " + PORT + "...\n");
	
	let server: CommandSocketServer = new CommandSocketServer(PORT);
	
	delicate.prompt(() => {
		
		console.log("\nClosing server.");
		server.close();
		
	});
	
};

main();