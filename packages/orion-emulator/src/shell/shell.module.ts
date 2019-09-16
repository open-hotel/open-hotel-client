import { Module } from "@nestjs/common";
import { ShellProvider } from "./shell.provider";
import { ApiBin } from "./bin/api.bin";
import { ShutdownBin } from "./bin/shutdown.bin";
import { AlertBin } from "../staff/bin/alert.bin";

@Module({
    imports: [],
    providers: [ShellProvider, ApiBin, ShutdownBin, AlertBin],
    exports: [ShellProvider, ApiBin],
})
export class ShellModule {}