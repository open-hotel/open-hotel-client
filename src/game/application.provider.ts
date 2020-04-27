import { Application, ApplicationOptions } from "../engine/Application";
import { Provider } from "injets";

@Provider()
export class ApplicationProvider {
    app!: Application

    createApp (options: ApplicationOptions) {
        this.app = new Application(options)
    }
}
