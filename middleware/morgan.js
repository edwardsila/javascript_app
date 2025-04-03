const useragent = require('useragent');
const morgan = require('morgan');
const Log = require('../models/log');
const IP = require('../models/IP');
const fetch = require('node-fetch')


function deviceInfo(userAgent) {
  const agent = useragent.parse(userAgent);

  return {
    device: agent.device.toString(),
    os: agent.os.toString(),
    client: agent.toString(),
  };
}

async function loadInfo(ip) {
  if (["::ffff:127.0.0.1", "127.0.0.1"].includes(ip)) {
    return {
      status: "success",
      message: "",
      continent: "Local",
      continentCode: "LOC",
      country: "Localhost",
      countryCode: "LH",
      region: "Loopback",
      regionName: "Loopback",
      city: "Loopback City",
      zip: "00000",
      lat: "0",
      lon: "0",
      timezone: "UTC",
      offset: 0,
      currency: "None",
      isp: "Localhost ISP",
      org: "Local Organization",
      as: "AS0",
      asname: "Loopback AS",
      mobile: false,
      proxy: false,
      hosting: false,
      query: "127.0.0.1",
      ip,
    };
  }
  try {
    const url = `http://ip-api.com/json/${ip}`;
  
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`${res.status} error failed to collect details for ip : ${ip}`)
    }

    data = await res.json();
    return {...data, ip}
  } catch (error) {
    throw error;
  }
}



const morganMiddleware = morgan(async (tokens, req, res) => {

  try {
    let user = req.session.user ? req.session.user._id : null;
    let sessionId = req.session.id;
    const agent = req.get('User-Agent');

    const { os, device, client } = deviceInfo(agent);

    var ip = await IP.findOne({ ip: req.ip });

    if (!ip) {
      let ipInfo = await loadInfo(req.ip);
      ip = new IP(ipInfo);
      await ip.save();
    }

    const log = new Log({
      ip: ip._id,
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      user,
      sessionId,
      responseTime: tokens["response-time"](req, res),
      os,
      device,
      client
    });

    await log.save();
  } catch (error) {
    console.error(error)
  }
});

module.exports = morganMiddleware;