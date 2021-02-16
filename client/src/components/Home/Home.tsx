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
      <h1 className="h5 mb-4 font-bold">Dashboard</h1>
      {/* <p className="mb-4 font-14">Dashboard data</p> */}

     <div className="row">
        <TopCard
          title="Documents"
          text={`${numberItemsCount}`}
          icon="file-contract"
          class="success"
        />
        <TopCard
          title="Users"
          text={`${numberItemsCount}`}
          icon="users"
          class="success"
        />
         <TopCard
          title="Categories"
          text={`${numberItemsCount}`}
          icon="project-diagram"
          class="success"
        />
        <TopCard
          title="Boxes"
          text={`${numberItemsCount}`}
          icon="box-open"
          class="success"
        />
         <TopCard
          title="Pending Documents"
          text={`${numberItemsCount}`}
          icon="file-contract"
          class="danger"
        />
         <TopCard
          title="Non Pending Documents"
          text={`${numberItemsCount}`}
          icon="file-contract"
          class="success"
        />
      </div>

    </Fragment>
  );
};

export default Home;
