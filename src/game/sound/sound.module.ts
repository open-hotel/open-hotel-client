import { Module } from "injets";
import { SoundManager } from "./sound.manager";

@Module({
  providers: [SoundManager]
})
export class SoundModule {}