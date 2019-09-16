import * as readline from 'readline';
import * as YargsParser from 'yargs-parser'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';


@Injectable()
export class ShellProvider implements OnApplicationBootstrap {
  public rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `Orion Hotel > `,
    terminal: true,
    removeHistoryDuplicates: true,
  });

  get bin() {
    return Reflect.getMetadata('SHELL_BINS', ShellProvider) || {};
  }

  prompt(prompt?: string): Promise<string> {
    return new Promise(resolve => {
      if (prompt) this.rl.setPrompt(prompt);
      this.rl.prompt();
      this.rl.once('line', input => resolve(input));
    });
  }

  print (data:string|Buffer, newLine = true) {
    this.rl.write(data)
    newLine && this.rl.write('\n')
  }

  error (errorOrString: string | Error) {
    const message = typeof errorOrString === 'string' ? errorOrString : errorOrString.message
    this.print(`Error: ${message}`)
    return 1
  }

  async run (cmd:string): Promise<number> {
    if (!cmd) return 0
    const args = YargsParser(cmd)
    const [binName] = args._

    if (!(binName in this.bin)) return this.error(`Command ${binName} not exists!`)

    const result = await this.bin[binName].main(args, this)
    
    return typeof result === 'number' ? result : 0
  }

  async start() {
    let exit = false;

    while (!exit) {
      const input = await this.prompt();
      const exitCode = await this.run(input)
      exit = exitCode === -1
    }
  }

  async onApplicationBootstrap() {
    setImmediate(() => this.start())
  }
}
