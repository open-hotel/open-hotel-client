import { Provider } from "injets";
import { Application, ApplicationOptions } from "../../engine/Application";

@Provider()
export class ApplicationProvider {
    app!: Application

    createApp (options: ApplicationOptions) {
        this.app = new Application(options)
    }
}
