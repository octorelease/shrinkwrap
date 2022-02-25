import * as plugin from "../src";

describe("Shrinkwrap plugin", () => {
    it("should export stages", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
