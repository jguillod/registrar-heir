module.exports = class RegistryError extends Error {
    constructor(message, ...args) {
        super(`[registrar] ${message}`, ...args);
        this.name = 'RegistryError';
    }
};
