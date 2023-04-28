import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

import { stylifyVite } from '@stylify/unplugin';

const stylifyPlugin = stylifyVite({
    bundles: [{
        outputFile: './src/lib/stylify.css',
        files: ['./src/lib/**/*.{svelte,html}'],
    }],
    // variables
});

export default defineConfig({
    server: {
        host: true,
    },
    plugins: [
        stylifyPlugin,
        sveltekit(),
        Icons({
            compiler: 'svelte',
        }),
    ],
    optimizeDeps: {
        exclude: ["@tanstack/table-core"],
    },
    build: {
        target: 'es2015',
        outDir: 'dist',
        lib: {
            entry: {
                helper: 'src/lib/helper.ts',
            },
            name: "Helper",
            formats: ['es'],
        },
    },
});
