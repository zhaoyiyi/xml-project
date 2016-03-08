System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "ts",
  typescriptOptions: {
    "module": "system",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "github:*": "jspm_packages/github/*"
  },

  packages: {
    "src": {
      "main": "boot",
      "defaultExtension": "ts"
    }
  },

  map: {
    "angular2": "node_modules/angular2",
    "rxjs": "node_modules/rxjs",
    "ts": "github:frankwallis/plugin-typescript@3.0.3",
    "typescript": "npm:typescript@1.8.0",
    "github:frankwallis/plugin-typescript@3.0.3": {
      "typescript": "npm:typescript@1.9.0-dev.20160214"
    }
  }
});
