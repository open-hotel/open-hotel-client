import { Injectable } from "@nestjs/common";
import { ShellCommand } from "../decorators/ShellBin";
import app from "../../app";
import { ShellProvider } from "../shell.provider";

@Injectable()
export class ShutdownBin {
    
    @ShellCommand('shutdown', {
        usage: 'shutdown',
        description: 'Shutdown Emulator Safety'
    })
    async shutdown (_, sh:ShellProvider) {
        sh.print('Shutdown...')
        const nestApp = await app()
        nestApp.close()
        sh.print('Bye :)')
        process.exit()
    }
}