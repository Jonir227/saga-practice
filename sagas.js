import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';

// 제너레이터 함수
export function* helloSaga() {
  console.log('Hello Sagas!');
}
/*
  Generator Fucntion
  사가는 미들웨어가 해석하는 명령어를 출력하기 위한 방법으로 제너레이터 함수를 이용한다.
  Promise가 미들웨어로 들어오면, 미들웨어는 프로미스가 끝날때까지 Saga를 미룬다.
  이하의 예제에서는 increamentAsync Saga가 delay를 마치고 프로미스가 리턴될때까지 기다린다.
*/

// Worker Saga : 실제로 비동기 동작을 실행하는 사가
export function* incrementAsync() {
  /*
    delay는 1000ms만큼 지연시킨다.
    Generator를 블록시키기 위함 => 비동기 작업으로 만들어주기 위함이다.
    제너레이터 함수를 이용해서 incrementAsync의 실행을 지연시킨다.
    이때, call이 하는 역할은 delay가 단순히 프로미스를 리턴하는게 아니고,
    Saga Instruction을 리턴하게 하기 위함임.
    ex) { CALL: {fn: delay, args: [1000]}}
  */
  yield call(delay, 1000);
  yield put({ type: 'INCREMENT' }); //delay가 끝나면, INCREMENT라는 액션을 디스패치 시킨다.
}

// Watcher Saga : INCREMENT_ASYNC 가 들어왔을때, 새 increamentAsync 태스크를 만드는 사가
function* watchIncrementAsync() {
  /*
    takeEvery
    saga의 헬퍼함수. 액션이 들어오면 그에 맞는 사가를 실행한다.
    이하에서는 INCREMENT_ASYNC라는 액션이 들어오면 붙여진 Saga를 발행힌다.
  */
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

// 만들어진 모든 사가를 한곳에서 실행하고 관리
export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()]);
}
