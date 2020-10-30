declare function action<T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
declare function action<T>(callback: T): T;
export default action;
export { action };
