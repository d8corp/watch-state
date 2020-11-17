import Watch, { WatchTarget } from '../../classes/Watch';
declare function watch(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<WatchTarget>): TypedPropertyDescriptor<() => Watch>;
export default watch;
export { watch, };
