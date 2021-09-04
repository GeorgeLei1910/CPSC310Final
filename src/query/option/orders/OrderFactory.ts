import IOrder from "./IOrder";
import QueryUtil from "../../QueryUtil";
import EmptyOrder from "./EmptyOrder";
import SimpleOrder from "./SimpleOrder";
import ComplexOrder from "./ComplexOrder";

export default class OrderFactory {
    public static getIOrder(query: any, columns: string[]): IOrder {
        if (!(QueryUtil.ORDER in query)) {
            return new EmptyOrder();
        }
        let orderQuery: any = query[QueryUtil.ORDER];
        if (typeof orderQuery === "string") {
            return new SimpleOrder(orderQuery, columns);
        }
        return new ComplexOrder(orderQuery, columns);
    }
}
