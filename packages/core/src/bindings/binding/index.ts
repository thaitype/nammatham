import { custom } from './custom';
import { httpTrigger } from './http-trigger';
import { http, httpWithReturn } from './http';
import { timerTrigger } from './timer-trigger';
import {
  cosmosDBTrigger_Input,
  cosmosDBTrigger_Input_v2,
  cosmosDBTrigger_Input_v4,
  cosmosDBTrigger_Output,
  cosmosDBTrigger_Output_v2,
  cosmosDBTrigger_Output_v4,
} from './cosmos-db-trigger';

export default {
  httpTrigger,
  http,
  httpWithReturn,
  timerTrigger,
  custom,
  cosmosDBTrigger_Input,
  cosmosDBTrigger_Input_v2,
  cosmosDBTrigger_Input_v4,
  cosmosDBTrigger_Output,
  cosmosDBTrigger_Output_v2,
  cosmosDBTrigger_Output_v4,
};
