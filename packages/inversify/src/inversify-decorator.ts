/**
 * Re-export inversify decorator into Pascal Case
 */

export {
  injectable as Injectable,
  inject as Inject,
  multiInject as MultiInject,
  named as Named,
  optional as Optional,
  tagged as Tagged,
  targetName as TargetName,
  unmanaged as Unmanaged,
} from 'inversify';
