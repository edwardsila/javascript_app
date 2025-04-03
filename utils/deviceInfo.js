const useragent = require('useragent');
function parseUserAgent(userAgent) {
    const agent = useragent.parse(userAgent);

    return {
        device: agent.device.toString(),
        os: agent.os.toString(),
        client: agent.toString(),
    };
}

module.exports = parseUserAgent;