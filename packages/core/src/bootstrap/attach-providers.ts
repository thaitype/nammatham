import { Container } from 'inversify';

export function attachProviders(container: Container, providers: NewableFunction[]) {
  for (const provider of providers) {
    container.bind(provider).toSelf();
  }
}
