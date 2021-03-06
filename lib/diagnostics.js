const sonos = require("sonos");
const ip = require("ip");

module.exports = function diagnostics() {
  console.log("AirSonos Diagnostics");
  console.log("node version\t", process.version);
  console.log("operating sys\t", process.platform, `(${process.arch})`);
  console.log("ip address\t", ip.address());

  console.log("\nSearching for Sonos devices on network...");

  sonos.search((device, model) => {
    let devInfo = "\n";
    devInfo += `Device \t${JSON.stringify(device)} (${model})\n`;
    device.getZoneAttrs((err, attrs) => {
      if (err) devInfo += "`- failed to retrieve zone attributes\n";
      devInfo += `\`- attrs: \t${JSON.stringify(attrs).replace(
        /",/g,
        '",\n\t\t'
      )}\n`;

      device.getZoneInfo((errors, info) => {
        const newInfo = info;
        if (errors) devInfo += "`- failed to retrieve zone information\n";
        delete newInfo.SerialNumber;
        newInfo.MACAddress = info.MACAddress.replace(
          /^([0-9A-F]{2}[:-]){5}/,
          "XX:XX:XX:XX:XX:"
        );
        devInfo += `\`- info: \t${JSON.stringify(newInfo).replace(
          /",/g,
          '",\n\t\t'
        )}\n`;

        device.getTopology(() => {
          devInfo += `\`- topology: \t${JSON.stringify(newInfo.zones).replace(
            /",/g,
            '",\n\t\t'
          )}\n`;
          console.log(devInfo);
        });
      });
    });
  });
};
