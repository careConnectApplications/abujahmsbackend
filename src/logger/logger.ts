import winston from "winston";

const enumerateErrorFormat = winston.format((info: winston.Logform.TransformableInfo) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
    level: (process.env.NODE_ENV as string) === "development" ? "debug" : "info",
    format: winston.format.combine(
        enumerateErrorFormat(),
        (process.env.NODE_ENV as string) === "development"
            ? winston.format.colorize()
            : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(
            (info: winston.Logform.TransformableInfo) => `${info.level}: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ["error"],
        }),
    ],
});

export default logger;