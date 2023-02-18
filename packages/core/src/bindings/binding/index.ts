import { custom } from './custom';
import { httpTrigger } from './http-trigger';
import { http, httpWithReturn } from './http';
import { timerTrigger } from './timer-trigger';
import { cosmosDBTrigger, cosmosDBTrigger_v2, cosmosDBTrigger_v4 } from './cosmos-db-trigger';

export default {
  httpTrigger,
  http,
  httpWithReturn,
  timerTrigger,
  custom,
  cosmosDBTrigger,
  cosmosDBTrigger_v2,
  cosmosDBTrigger_v4,
};
