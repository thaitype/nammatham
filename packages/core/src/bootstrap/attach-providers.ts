import { Container } from 'inversify';

export function attachProviders(container: Container, providers: NewableFunction[]) {
  for (const provider of providers) {
    console.log(`Binding provider: `, provider);
    container.bind(provider).toSelf();
  }
}
