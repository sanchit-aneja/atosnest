const { transports, createLogger, format } = require("winston");
require("winston-daily-rotate-file");
const logDir = "logs";

const custFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.splat(),
  format.simple(),
  format.printf((info) => {
    return (
      `[${info.timestamp}]  ` +
      JSON.stringify({
        level: info.level ?? "",
        method: info.method ?? "",
        url: info.url ?? "",
        request: info.request ?? "",
        message: info.message ?? "",
        data: info.data ?? "",
      }) +
      ";"
    );
  })
);

const generateLogger = createLogger({
  format: custFormat,
  level: "debug",
  transports: [
    new transports.Console({
      colorize: process.stdout.isTTY,
      timestamp: true,
      prettyPrint: true,
    }),
  ],
});

const logger = { generateLogger };
export default logger;
