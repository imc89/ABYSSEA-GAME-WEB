/* =============================================================================
   ABYSSEA — versions-data.js
   -----------------------------------------------------------------------------
   ES: Gestión centralizada de versiones, tamaños y enlaces de descarga.
   EN: Centralized management of versions, file sizes, and download links.
   ============================================================================= */

/**
 * ES: Objeto global que contiene toda la información de versiones del juego.
 * EN: Global object containing all game version information.
 */
const ABYSSEA_VERSIONS = {
    // ES: Datos específicos para la plataforma Windows
    // EN: Platform-specific data for Windows
    windows: {
        // ES: Versión estable más reciente
        // EN: Most recent stable version
        latest: {
            version: "v1.0.4",
            size: "850 MB",
            date: "15 de Mayo, 2026",
            url: "downloads/Abyssea_Setup_x64.exe"
        },
        // ES: Versión beta actual para pruebas
        // EN: Current beta version for testing
        beta: {
            version: "v1.1.0-beta.2",
            size: "865 MB",
            date: "20 de Mayo, 2026",
            url: "downloads/Abyssea_Setup_Beta.exe"
        },
        // ES: Lista de versiones antiguas (Historial)
        // EN: List of previous versions (History)
        archive: [
            {
                version: "v1.0.3",
                size: "842 MB",
                date: "2 de Mayo, 2026",
                url: "#" // ES: Enlace deshabilitado / EN: Disabled link
            }
        ]
    },
    // ES: Datos específicos para la plataforma MacOSX
    // EN: Platform-specific data for MacOSX
    macos: {
        latest: {
            version: "v1.0.4",
            size: "920 MB",
            date: "15 de Mayo, 2026",
            url: "downloads/Abyssea_macOS.dmg"
        },
        beta: {
            version: "v1.1.0-beta.2",
            size: "935 MB",
            date: "20 de Mayo, 2026",
            url: "downloads/Abyssea_macOS_Beta.dmg"
        },
        archive: [
            {
                version: "v1.0.3",
                size: "912 MB",
                date: "2 de Mayo, 2026",
                url: "#"
            }
        ]
    }
};
