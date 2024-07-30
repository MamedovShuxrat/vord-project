import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import {BuildOptions} from "./types/types";

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
    return {
        static: {
            directory: options.paths.public,
        },
        historyApiFallback: true,
        open: true,
        hot: true,
        port: options.port,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    }
}