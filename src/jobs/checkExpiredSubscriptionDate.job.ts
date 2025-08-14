import cron from "node-cron";
import { checkAndUpdateExpiredSubscription } from "../dao/patientmanagement";

if (process.env.CRON_ENV === "test") {
    cron.schedule("* * * * *", async () => {
        console.log(
            "running every minute in test env\n<--- job scheduler checking for expired subscription -->"
        );
        await checkAndUpdateExpiredSubscription();
    });
} else {
    /// run at midnight
    cron.schedule("0 0 * * *", async () => {
        console.log("Running subscription expiry check...");
        await checkAndUpdateExpiredSubscription();
    });
}