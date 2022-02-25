import * as fs from "fs";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.packages != null && context.workspaces == null) {
        throw new Error("The packages option is defined but no workspaces were found");
    }

    if (!fs.existsSync("npm-shrinkwrap.json")) {
        throw new Error("Could not find npm-shrinkwrap.json in project root");
    }
}
