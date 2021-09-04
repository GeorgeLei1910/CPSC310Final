import IOrder from "./IOrder";

export default class EmptyOrder implements IOrder {
    public sort(items: any[]): any[] {
        return items;
    }
}
