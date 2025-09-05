module.exports = {
    server: "./",
    files: ["*.html", "*.css", "*.js"],
    port: 3000,
    ui: {
        port: 3001
    },
    open: true,
    notify: true,
    reloadOnRestart: true,
    ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
    },
    // Custom middleware to handle socket events
    middleware: function (req, res, next) {
        return next();
    },
    // Socket configuration for custom events
    socket: {
        socketIoOptions: {
            log: false
        },
        socketIoClientConfig: {
            reconnectionAttempts: 50
        }
    },
    // Plugin to handle custom checkbox sync events
    plugins: [
        {
            module: "bs-html-injector",
            options: {
                files: "*.html"
            }
        }
    ],
    // Custom script injection for enhanced sync
    snippetOptions: {
        rule: {
            match: /<\/body>/i,
            fn: function (snippet, match) {
                const customScript = `
                <script>
                    (function() {
                        if (typeof window.___browserSync___ !== 'undefined') {
                            const bs = window.___browserSync___;
                            
                            // Enhanced socket handling for checkbox sync
                            bs.socket.on('connection', function() {
                                console.log('BrowserSync socket connected for checkbox sync');
                            });
                            
                            // Relay checkbox updates to all connected browsers
                            if (bs.socket && bs.socket.emit) {
                                window.broadcastCheckboxUpdate = function(data) {
                                    bs.socket.emit('checkbox:broadcast', data);
                                };
                                
                                // Listen for broadcasts from other browsers
                                bs.socket.on('checkbox:broadcast', function(data) {
                                    window.dispatchEvent(new CustomEvent('checkbox:sync', { detail: data }));
                                });
                            }
                        }
                    })();
                </script>
                `;
                return snippet + customScript + match;
            }
        }
    }
};
