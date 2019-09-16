import { Injectable } from "@nestjs/common";
import { Argv } from "yargs";
import { ShellProvider } from "../../shell/shell.provider";
import { ShellCommand } from "../../shell/decorators/ShellBin";

@Injectable()
export class AlertBin {
    @ShellCommand('alert', {
        description: 'Send a message to hotel',
        usage: 'alert <message> [--users] [--room]'
    })
    main (args: Argv, sh: ShellProvider) {
        sh.print('alert')
    }
}