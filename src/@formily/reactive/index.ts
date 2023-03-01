export function observable(value){
return new Proxy(value, baseHandler);
}
const baseHandler={
  get(target, key){

  },
  set(target, key, value){

  }
}
export function autorun(){

}