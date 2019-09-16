import { ShellCommand } from '../decorators/ShellBin';
import { Injectable, Inject } from '@nestjs/common';
import { Arguments } from 'yargs-parser';
import app from '../../app';
import { ShellProvider } from '../shell.provider';

const Table = require('cli-table3');

@Injectable()
export class ApiBin {
  @ShellCommand('server', {
    usage: 'server [command]',
    description: 'Start API Server',
  })
  async main(args: Arguments, sh: ShellProvider) {
    const [_ = null, cmd = 'help'] = args._;

    if (cmd === 'start') return this.start(sh);
    if (cmd === 'stop') return this.stop(sh);
    if (cmd === 'help') return this.help(sh);
  }

  async start(sh: ShellProvider) {
    sh.print('Starting server...');
    const port = 3000;

    const appInstance = await app();
    return appInstance
      .listen(port)
      .then(() =>
        sh.print(`✅ Server started successfully! Listening on port ${port}.`),
      );
  }

  async stop(sh: ShellProvider) {
    sh.print('Stopping...');
    const appInstance = await app();
    appInstance.close();
  }

  help(sh: ShellProvider) {
    let table = new Table({
      title: 'Help',
      head: ['command', 'usage', 'description'],
    });

    table.push([
      'server',
      'server [command]',
      'managed the embedded http server',
    ]);

    sh.print(table.toString());
    sh.print('Commands: ');

    table = new Table({
      title: 'Help',
      head: ['command', 'usage', 'description'],
    });

    table.push(
      ['start', 'server start', 'Starts HTTP Server'],
      ['stop', 'server stop', 'Stop HTTP Server'],
      ['help', 'server help', 'Show this help.'],
    );

    sh.print(table.toString());
  }
}
