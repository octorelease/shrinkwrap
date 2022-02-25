/**
 * Copyright 2022 Octorelease Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as path from "path";
import * as exec from "@actions/exec";
import * as glob from "@actions/glob";
import { IContext } from "@octorelease/core";
import { DEFAULT_FILTERS, IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const filters = config.filters || DEFAULT_FILTERS;
    if (config.packages != null) {
        const globber = await glob.create(config.packages.join("\n"));
        for (const packageDir of await globber.glob()) {
            unhoistShrinkwrap(packageDir);
            pruneShrinkwrap(filters, packageDir);
        }
    } else {
        pruneShrinkwrap(filters);
    }
}

async function unhoistShrinkwrap(packageDir: string) {
    const lockfile = JSON.parse(fs.readFileSync("npm-shrinkwrap.json", "utf-8"));
    for (const [k, v] of Object.entries(lockfile.packages) as any) {
        if (v.link) {
            delete lockfile.packages[k];
        }
    }
    fs.writeFileSync(path.join(packageDir, "npm-shrinkwrap.json"), JSON.stringify(lockfile, null, 2) + "\n");
    await exec.exec("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit"], { cwd: packageDir });
    await exec.exec("npm", ["dedupe", "--production"], { cwd: packageDir });
}

function pruneShrinkwrap(filters: string[], packageDir?: string) {
    const shrinkwrapPath = packageDir != null ? path.join(packageDir, "npm-shrinkwrap.json") : "npm-shrinkwrap.json";
    const lockfile = JSON.parse(fs.readFileSync(shrinkwrapPath, "utf-8"));
    const filterPkgs = (obj: Record<string, any>, key: string) => {
        for (const [pkgName, pkgData] of Object.entries(obj[key]) as any) {
            if (filters.some(prop => pkgData[prop])) {
                delete obj[key][pkgName];
            }
        }
    };
    filterPkgs(lockfile, "packages");
    filterPkgs(lockfile, "dependencies");
    fs.writeFileSync(shrinkwrapPath, JSON.stringify(lockfile, null, 2) + "\n");
}
