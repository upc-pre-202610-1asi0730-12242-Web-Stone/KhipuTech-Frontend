export const notify = {
    success(msg) {
        console.log('✅', msg)
        alert(msg)
    },
    error(msg) {
        console.error('❌', msg)
        alert(msg)
    },
    info(msg) {
        console.info('ℹ️', msg)
        alert(msg)
    },
    warning(msg) {
        console.warn('⚠️', msg)
        alert(msg)
    }
}