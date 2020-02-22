import { AventNotifier } from "avents";
import { CommandRegistry, CommandSetStructure } from "@command-socket/core";
import { CommandSocket } from "@command-socket/node-client";
export declare class CommandSocketServer<LCS extends CommandSetStructure = any, RCS extends CommandSetStructure = any, M extends {} = {}> {
    private connectionMap;
    private internalServer;
    private readonly events;
    constructor(port: number, commandRegistry?: CommandRegistry<LCS>, defaultMetadata?: Partial<M>);
    hasConnectionForID(id: string): boolean;
    getConnectionForID(id: string): CommandSocket<LCS, RCS, M> | undefined;
    getCommandRegistry(): any;
    forEachConnection(callback: (connection: CommandSocket<LCS, RCS, M>) => any): void;
    getEvents(): CommandSocketServerEvents;
    close(): void;
}
export declare class CommandSocketServerEvents {
    readonly CONNECTION_OPENED: AventNotifier<CommandSocket>;
    readonly CONNECTION_CLOSED: AventNotifier<void>;
    constructor();
}
