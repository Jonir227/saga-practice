import test from 'tape';

import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { incrementAsync } from './sagas';

test('incrementAsync Saga test', assert => {
  /*
    제너레이터 펑션은 Interator객체를 리턴한다. 
    따라서, 이것의 next()를 실행하면 다음과 같은 형태를 리턴한다.
    { done: boolean, value: any }
    따라서, incrementAsync가 끝날때까지 실행한다면 다음과 같은 결과가 나온다.
    gen.next() // => { done: false, value: <result of calling delay(1000)> }
    gen.next() // => { done: false, value: <result of calling put({type: 'INCREMENT'})> }
    gen.next() // => { done: true, value: undefined }
    따라서 이를 테스트하기 위해서는 반환값을 서로 비교하면 된다.
  */

  const gen = incrementAsync();

  /*
    제너레이터가 리턴하는 것의 value는 사가에 맞추어서 반환이 된다.
    사가가 리턴하는 값의 단위는 Effect이므로, 그에 맞추어서 비교해야함
  */

  assert.deepEqual(
    // 제너레이터의 value
    gen.next().value,
    // saga Effect
    call(delay, 1000),
    'incrementAsync sould return a Promise that will resolve after 1 sec',
  );

  assert.deepEqual(
    gen.next().value,
    put({ type: 'INCREMENT' }),
    'incrementAsync Saga must dispatch an INCREMENT action',
  );

  assert.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    'incrementAsync Saga must be done',
  );

  assert.end();
});
