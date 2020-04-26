import { Module } from "injets";
import { HumanImager } from "./human/Human.imager";

@Module({
    providers: [
        HumanImager
    ]
})
export class ImagerModule {}