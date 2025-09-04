import { expect, test } from '@rstest/core';
import { BasicContainer } from '../src';

test('should bind and get a value', () => {
  const container = new BasicContainer();
  container.bindTo('foo', () => 'bar');
  expect(container.get('foo')).toBe('bar');
});

test('should throw an error for unbound identifier', () => {
  const container = new BasicContainer();
  expect(() => container.get('foo')).toThrow(
    'No binding found for identifier: foo',
  );
});

test('should allow chainable binds', () => {
  const container = new BasicContainer();
  container.bindTo('foo', () => 'bar').bindTo('baz', () => 'qux');

  expect(container.get('foo')).toBe('bar');
  expect(container.get('baz')).toBe('qux');
});

test('should resolve dependencies from the container', () => {
  interface IResolutionMap {
    foo: string;
    bar: string;
  }

  const container = new BasicContainer<IResolutionMap>();

  container
    .bindTo('foo', () => 'bar')
    .bindTo('bar', (c) => c.get('foo').toUpperCase());

  expect(container.get('bar')).toBe('BAR');
});
