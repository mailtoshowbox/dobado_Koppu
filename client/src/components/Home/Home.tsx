import React, { Fragment, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import TopCard from "../../common/components/TopCard";
 


const Home: React.FC = () => {
  const numberItemsCount: number = 1;
  const dispatch: Dispatch<any> = useDispatch();
  dispatch(updateCurrentPath("home", ""));

  return (
    <Fragment>
      <h1 className="h5 mb-2 font-bold">Dashboard</h1>
      <p className="mb-4 font-14">Dashboard data</p>

     <div className="row">
        <TopCard
          title="Documents COUNT-1"
          text={`${numberItemsCount}`}
          icon="user"
          class="success"
        />
        <TopCard
          title="Documents COUNT-2"
          text={`${numberItemsCount}`}
          icon="box"
          class="primary"
        />
         <TopCard
          title="Documents COUNT-3"
          text={`${numberItemsCount}`}
          icon="user"
          class="danger"
        />
        <TopCard
          title="Documents COUNT-3"
          text={`${numberItemsCount}`}
          icon="box"
          class="success"
        />
      </div>

    </Fragment>
  );
};

export default Home;
