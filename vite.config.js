import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: true  // Open to browser on server start
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first before building
        sourcemap: true    // Add sourcemap for easier debugging
    },
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr'],
    plugins:
    [
        restart({ restart: [ '../static/**', ] }), // Restart server on static file change
        glsl() // Handle shader files
    ]
}
