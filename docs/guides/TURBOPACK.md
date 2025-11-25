# Turbopack Development

This project supports Turbopack for faster development builds.

## Available Commands

### Standard Development
```bash
npm run dev
```
- Uses your custom server with nodemon
- Logs to `dev.log`
- Slower but works with your custom server setup

### Turbopack Development
```bash
npm run dev:turbopack
```
- Uses Next.js with Turbopack (significantly faster)
- Logs to `dev-turbopack.log`
- 10x faster builds and hot reload
- **Note:** Does not use custom server, uses Next.js default server

### Turbopack with Custom Server (Experimental)
```bash
npm run dev:turbopack:server
```
- Attempts to combine Turbopack with custom server
- Logs to `dev-turbopack-server.log`
- Experimental - may have compatibility issues

## Performance Benefits

Turbopack provides:
- **10x faster** local development
- **53% faster** fast refresh
- **94% faster** initial code loading
- Better memory usage
- Incremental bundling

## When to Use Each

### Use `npm run dev` when:
- You need your custom server setup (Socket.IO, custom routes, etc.)
- You're testing server-specific functionality
- Production environment simulation is needed

### Use `npm run dev:turbopack` when:
- You're doing frontend development only
- You want faster hot reload
- You're working on UI components, pages, or client-side features
- Server functionality is not critical for your current task

## Switching Between Modes

You can safely switch between development modes:
1. Stop the current dev server (Ctrl+C)
2. Run the desired npm script
3. Your changes are preserved
4. Both modes work with the same codebase

## Configuration

Turbopack settings are configured in `next.config.ts`:
- Package import optimizations for icons
- SVG handling rules
- Performance optimizations
- Experimental features enabled

## Logs

- Standard dev logs: `dev.log`
- Turbopack logs: `dev-turbopack.log`
- Turbopack server logs: `dev-turbopack-server.log`

## Troubleshooting

If Turbopack has issues:
1. Try the standard `npm run dev` command
2. Check for any custom server dependencies
3. Some Next.js middleware or server features may not work with Turbopack yet
4. Report any issues to Next.js GitHub repository