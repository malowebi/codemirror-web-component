const PROMISE = Symbol('Deferred.PROMISE');
const RESOLVE = Symbol('Deferred.RESOLVE');
const REJECT  = Symbol('Deferred.REJECT');

type OnFulfill<T>   = (val: T) => T | PromiseLike<T>;
type OnReject<T>    = (val: any) => T | PromiseLike<T>;
type ResolveFn<T>   = (val: T) => void;
type RejectFn<T>    = (err: Error) => void;

interface Commands<T> {
  resolve?: ResolveFn<T>;
  reject?:  RejectFn<T>;
};

class Deferred<T> {
  private [PROMISE]:  Promise<T>;
  private [RESOLVE]:  ResolveFn<T>;
  private [REJECT]:   RejectFn<T>;

  constructor() {
    const commands: {
      resolve?: ResolveFn<T>;
      reject?:  RejectFn<T>;
    } = {};

    this[PROMISE] = new Promise((resolve, reject) => {
      commands.resolve = resolve;
      commands.reject  = reject;
    });
    this[RESOLVE] = (commands.resolve as ResolveFn<T>);
    this[REJECT]  = (commands.reject as RejectFn<T>);
  }

  then(fn: OnFulfill<T>): Promise<T> {
    return this[PROMISE].then(fn);
  }

  catch(fn: OnReject<T>): Promise<T> {
    return this[PROMISE].catch(fn);
  }

  resolve(x: T) {
    return this[RESOLVE](x);
  }

  reject(x: T) {
    return this[RESOLVE](x);
  }
};

export { Deferred };
