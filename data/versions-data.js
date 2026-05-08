/* =============================================================================
   ABYSSEA — versions-data.js
   -----------------------------------------------------------------------------
   ES: Gestión centralizada de versiones. Estructura optimizada para evitar repetición.
   EN: Centralized version management. Optimized structure to avoid repetition.
   ============================================================================= */

const ABYSSEA_VERSIONS = {
    // ES: Versión Beta actual / EN: Current Beta Version
    beta: {
        version: "v1.0.0-beta.1",
        date: "8 de Mayo, 2026",
        // ES: Cambios en esta versión (separados por guiones)
        // EN: Changes in this version (separated by dashes)
        changes: "- Nueva biome: Fumarolas Hidrotermales - Optimización de partículas - Corrección de errores en colisiones",
        windows: {
            size: "465 MB",
            url: "downloads/Abyssea_Setup_Beta.exe"
        },
        macos: {
            size: "435 MB",
            url: "downloads/Abyssea_macOS_Beta.dmg"
        }
    },

    // ES: Versión Estable más reciente / EN: Latest Stable Version
    /*
    latest: {
        version: "v1.0.4",
        date: "15 de Mayo, 2026",
        changes: "- Versión de lanzamiento oficial - Soporte completo para mando",
        windows: {
            size: "850 MB",
            url: "downloads/Abyssea_Setup_x64.exe"
        },
        macos: {
            size: "920 MB",
            url: "downloads/Abyssea_macOS.dmg"
        }
    },
    */

    // ES: Historial de versiones antiguas / EN: History of old versions
    /*
    archive: [
        {
            version: "v1.0.3",
            date: "2 de Mayo, 2026",
            changes: "- Ajustes en la IA de las criaturas - Mejoras en el HUD",
            windows: {
                size: "842 MB",
                url: "#"
            },
            macos: {
                size: "912 MB",
                url: "#"
            }
        }
    ]
    */
};
