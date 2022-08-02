const appInsights = require("applicationinsights");
appInsights
  .setup(process.env["INSTRUMENT_KEY"])
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(false)
  .start();

export default appInsights;
