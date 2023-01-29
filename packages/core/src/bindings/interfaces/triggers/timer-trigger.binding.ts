import { BaseFunctionBinding } from '../base-function-binding';

/**
 * TimerTrigger Binding
 *
 * read more: [TimerTrigger Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-javascript#configuration)
 */
export interface TimerTriggerBinding extends BaseFunctionBinding<'timerTrigger'> {
  type: 'timerTrigger';
  /**
   * A [CRON expression](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-javascript#ncrontab-expressions)
   * or a [TimeSpan](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-javascript#timespan) value. A TimeSpan can be used only for a function app
   * that runs on an App Service Plan. You can put the schedule expression in an app setting
   * and set this property to the app setting name wrapped in % signs,
   * as in this example: "%ScheduleAppSetting%".
   */
  schedule: string;
  /**
   * If `true`, the function is invoked when the runtime starts. For example,
   * the runtime starts when the function app wakes up after going idle due
   * to inactivity. when the function app restarts due to function changes,
   * and when the function app scales out. Use with caution. **runOnStartup** should
   * rarely if ever be set to `true`, especially in production.
   */
  runOnStartup?: boolean;
  /**
   * Set to `true` or `false` to indicate whether the schedule should be monitored.
   * Schedule monitoring persists schedule occurrences to aid in ensuring the schedule
   * is maintained correctly even when function app instances restart. If not set
   * explicitly, the default is `true` for schedules that have a recurrence interval greater
   * than or equal to 1 minute. For schedules that trigger more than once per minute,
   * the default is `false`.
   */
  useMonitor?: boolean;
}
