import { createModule } from "injets";
import { GameModule } from "./game.module";

export const gameRef = createModule(GameModule)