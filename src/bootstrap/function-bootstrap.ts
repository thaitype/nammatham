import { Container } from "inversify";
import { TYPE } from "../contants";
import { attachControllers } from "./attach-controllers";
import { AzureFunction } from "@azure/functions";
type AzureFunctionParams = Parameters<AzureFunction>;

export function funcBootstrap(
  container: Container,
  classTarget: NewableFunction,
  methodName: string,
  azureFunctionParams: AzureFunctionParams
) {
  const azureFunctions = attachControllers(container);
  for (const func of azureFunctions) {
    console.log(
      func.key,
      func.name,
      (func.target as { constructor: NewableFunction }).constructor
    );
  }
  let controllerInstance = container.getNamed(
    TYPE.Controller,
    classTarget.name
  );
  (controllerInstance as any)[methodName](...azureFunctionParams);
  console.log("funcBootstrap");
}
