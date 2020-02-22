/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	11:31 PM -- November 23rd, 2019.
 *	Project: @command-socket/server
 */

import { CommandRegistry, CommandSetStructure } from "@command-socket/core";
import * as delicate from "@t99/delicate";
import { CommandSocketServer } from "../../command-socket-server";

const main: () => Promise<void> = async (): Promise<void> => {
	
	const PORT: number = 5437;
	
	console.log("Starting server on port " + PORT + "...\n");
	
	interface LocalCommandSet extends CommandSetStructure {
		
		sum: {
			
			name: "sum",
			parameter: number[],
			return: number
			
		};
		
	}
	
	let myCommandRegistry: CommandRegistry<LocalCommandSet> = new CommandRegistry<LocalCommandSet>();
	
	myCommandRegistry.addCommand("sum", async (params: number[]): Promise<number> => {
		
		let result: number = 0;
		
		for (let value of params) result += value;
		
		return result;
		
	});
	
	let server: CommandSocketServer<LocalCommandSet> = new CommandSocketServer(PORT, myCommandRegistry);
	
	console.log("Server running...");
	
	delicate.prompt((): void => {
		
		console.log("\nClosing server.");
		server.close();
		
	});
	
};

main();