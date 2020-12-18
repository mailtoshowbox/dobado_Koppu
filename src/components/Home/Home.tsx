import React, { Fragment, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import TopCard from "../../common/components/TopCard";
import { IProductState, IStateType } from "../../store/models/root.interface";
import ProductList from "../Products/ProductsList";
import { IOrder } from "../../store/models/order.interface";
import OrderList from "../Orders/OrderList";

const Home: React.FC = () => {
  const products: IProductState = useSelector((state: IStateType) => state.products);
  const numberItemsCount: number = products.products.length;
  const totalPrice: number = products.products.reduce((prev, next) => prev + ((next.price * next.amount) || 0), 0);
  const totalProductAmount: number = products.products.reduce((prev, next) => prev + (next.amount || 0), 0);

  const orders: IOrder[] = useSelector((state: IStateType) => state.orders.orders);
  const totalSales: number = orders.reduce((prev, next) => prev + next.totalPrice, 0);
  const totalOrderAmount: number = orders.reduce((prev, next) => prev + next.amount, 0);

  const dispatch: Dispatch<any> = useDispatch();
  dispatch(updateCurrentPath("home", ""));

  return (
    <Fragment>
     

    </Fragment>
  );
};

export default Home;
