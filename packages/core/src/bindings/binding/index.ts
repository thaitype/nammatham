import { custom } from './custom';
import { httpTrigger } from './http-trigger';
import { http, http_withReturn } from './http';
import { timerTrigger } from './timer-trigger';
import {
  cosmosDBTrigger,
  cosmosDBTrigger_v2,
  cosmosDBTrigger_v4,
  cosmosDB_output,
  cosmosDB_output_v2,
  cosmosDB_output_v4,
} from './cosmos-db-trigger';

export default {
  httpTrigger,
  http,
  http_withReturn,
  timerTrigger,
  custom,
  cosmosDBTrigger,
  cosmosDBTrigger_v2,
  cosmosDBTrigger_v4,
  cosmosDB_output,
  cosmosDB_output_v2,
  cosmosDB_output_v4,
};
