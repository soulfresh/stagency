import { TestGenerator } from './test-generator';

describe('TestGenerator', () => {
  let foo;

  beforeEach(() => {
    foo = {
      generate: { foo: jest.fn(() => 'generate-foo'), bar: jest.fn(() => 'generate-bar') },
      from: { foo: jest.fn(() => 'from-foo') },
    };
  });

  it('should proxy requests to the underlying services.', () => {
    const options = {};
    const gen = new TestGenerator([foo]);
    expect(gen.foo(options)).toEqual('from-foo');

    expect(foo.generate.foo).toHaveBeenCalledTimes(1);
    expect(foo.generate.foo).toHaveBeenCalledWith(options);
    expect(foo.from.foo).toHaveBeenCalledTimes(1);
    expect(foo.from.foo).toHaveBeenCalledWith('generate-foo');
  });

  it('should call the proxy versions of the service first if they exist.', () => {
    class SubGen extends TestGenerator {
      foo(options) { return options; }
    }

    const options = {};
    const gen = new SubGen([foo]);

    expect(gen.foo(options)).toEqual(options);

    expect(foo.generate.foo).not.toHaveBeenCalled();
    expect(foo.from.foo).not.toHaveBeenCalled();
  });

  it('should fail if none of the services contain the expected proxy.', () => {
    const gen = new TestGenerator([foo]);
    expect(() => gen.bar()).toThrow();
  });

  it('should fail if more than one serivce contains the expected proxy.', () => {
    const gen = new TestGenerator([foo, foo]);
    expect(() => gen.foo()).toThrow();
  });

  it('should fail if the factory name does not exist on both the service and fromService.', () => {
    const gen = new TestGenerator([foo]);
    expect(() => gen.bar()).toThrow();
  });
});
