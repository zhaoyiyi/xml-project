import * as Rx from 'rxjs/Rx';


export function xmlObservable(xpath, contextNode) {
  let nodeList = document.evaluate(xpath, contextNode, null, XPathResult.ANY_TYPE, null);
  return Rx.Observable.create( observer => {
    let node = nodeList.iterateNext();
    while (node) {
      observer.next(node);
      node = nodeList.iterateNext();
    }
    observer.complete();
  });
}
