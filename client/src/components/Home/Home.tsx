import React, { Fragment, Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopCard from "../../common/components/TopCard";
import { IAccount } from "../../store/models/account.interface";
import {
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";

import { getDashboardList, getDocCategoryList } from "../../services/index";
const Home: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const account: IAccount = useSelector((state: IStateType) => state.account);
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const [dashboardCounter, setDashboardCounter] = useState({
    totalDocuments: 0,
    nApprovedDocuments: 0,
    approvedDocuments: 0,
    boxes: 0,

    docCategories: 0,
    users: 0,
  });

  useEffect(() => {
    //Load Dahsboard contents

    let counter: any = {};
    getDashboardList(account.auth).then((dashboardItems: any) => {
      const { box = {}, documents = {} } = dashboardItems;

      if (box.data.length > 0) {
        counter["boxes"] = box.data.length;
      }
      if (documents.data.length > 0) {
        counter["totalDocuments"] = documents.data.length;
        const nApprovedDocuments = documents.data.filter(
          (pr: any) => pr.document_info.status !== "approved"
        );
        const approvedDocuments = documents.data.filter(
          (pr: any) => pr.document_info.status === "approved"
        );

        counter["nApprovedDocuments"] = nApprovedDocuments.length;
        counter["approvedDocuments"] = approvedDocuments.length;
      }
    });

    //Load Available Doc Categories
    getDocCategoryList(account.auth).then((items: any) => {
      if (items.length > 0) {
        counter["docCategories"] = items.length;
      }
      setDashboardCounter({ ...dashboardCounter, ...counter });
    });
  }, [path.area, dispatch]);

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Dashboard</h1>
      {/* <p className="mb-4 font-14">Dashboard data</p> */}

      <div className="row">
        <TopCard
          title="Total docs archived"
          text={dashboardCounter.totalDocuments.toString() || "0"}
          icon="folder-open"
          class="success"
        />
        <TopCard
          title="No of employees"
          text={dashboardCounter.users?.toString() || "0"}
          icon="users"
          class="success"
        />
        <TopCard
          title="Categories"
          text={dashboardCounter.docCategories.toString() || "0"}
          icon="sitemap"
          class="success"
        />
        <TopCard
          title="Rack system"
          text={dashboardCounter.boxes.toString() || "0"}
          icon="box-open"
          class="success"
        />
        <TopCard
          title="Archival to be done"
          text={dashboardCounter.nApprovedDocuments.toString() || "0"}
          icon="folder-open"
          class="danger"
        />
        <TopCard
          title="Non Pending Documents"
          text={dashboardCounter.approvedDocuments.toString() || "0"}
          icon="folder-open"
          class="success"
        />
      </div>
    </Fragment>
  );
};

export default Home;
