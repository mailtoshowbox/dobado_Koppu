import React, { Fragment, Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopCard from "../../common/components/TopCard";
import { IAccount } from "../../store/models/account.interface";
import {
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import {
  getDashboardList,
  getDocCategoryList,
  getDocTypeList,
} from "../../services/index";
const Home: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const account: IAccount = useSelector((state: IStateType) => state.account);
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  const [dashboardCounter, setDashboardCounter] = useState({
    totalDocuments: 0,
    nApprovedDocuments: 0,
    approvedDocuments: 0,
    boxes: 0,
    docTypes: 0,
    docCategories: 0,
    users: 0,
    non_perceptual: 0,
    perceptual: 0,
    docCreater: 0,
    QtyUser: 0,
  });

  useEffect(() => {
    //Load Dahsboard contents

    let counter: any = {};
    let dashboardCounterNew: any = {};
    getDashboardList(account.auth).then((dashboardItems: any) => {
      const { box = {}, documents = {} } = dashboardItems;

      if (box.data.length > 0) {
        counter["boxes"] = box.data.length;
      }
      if (documents.data.length > 0) {
        counter["totalDocuments"] = documents.data.length;
        const nApprovedDocuments = documents.data.filter(
          (pr: any) =>
            pr.document_info && pr.document_info.status !== "approved"
        );
        const approvedDocuments = documents.data.filter(
          (pr: any) =>
            pr.document_info && pr.document_info.status === "approved"
        );

 
       /*  counter['perceptual'] = 0;
        counter['non_perceptual'] = 0;
        documents.data.filter(
          (pr: any) =>{

             if(pr.document_info && pr.type_of_space && pr.type_of_space === "perceptual"){
              counter['perceptual'] = counter['perceptual']++ ;
            }
            if(pr.document_info && pr.type_of_space && pr.type_of_space === "non_perceptual"){
             console.log("DDDDD", pr.name);
             
              counter['non_perceptual'] = counter['non_perceptual']++ ;
            }

          }
           // pr.document_info && pr.document_info.status === "approved"
        ); */ 
 


        
        

        counter["nApprovedDocuments"] = nApprovedDocuments.length;
        counter["approvedDocuments"] = approvedDocuments.length;

        const non_perceptual = documents.data.filter(
          (pr: any) => pr.type_of_space === "non_perceptual"
        );
        const perceptual = documents.data.filter(
          (pr: any) => pr.type_of_space === "perceptual"
        );

        setDashboardCounter({ ...dashboardCounter, ...counter });

        counter["non_perceptual"] = non_perceptual.length;
        counter["perceptual"] = perceptual.length;

        const docCreater = documents.data.filter(
          (pr: any) =>
            pr.document_info &&
            pr.document_info.createdBy &&
            pr.document_info.createdBy.role &&
            pr.document_info.createdBy.role !== "Documentcreater"
        );
        const QtyUser = documents.data.filter(
          (pr: any) =>
            pr.document_info &&
            pr.document_info.createdBy &&
            pr.document_info.createdBy.role &&
            pr.document_info.createdBy.role === "Documentcreater"
        );

        counter["docCreater"] = docCreater.length;
        counter["QtyUser"] = QtyUser.length;
      }
    });

    //Load Available Doc Categories
    getDocTypeList(account.auth).then((items: any) => {
      if (items.length > 0) {
        counter["docTypes"] = items.length;
      }
      // setDashboardCounter({ ...dashboardCounter, ...counter });
    });

    //Load Available Doc Categories
    getDocCategoryList(account.auth).then((items: any) => {
      if (items.length > 0) {
        counter["docCategories"] = items.length;
      }
      setDashboardCounter({ ...dashboardCounter, ...counter });
      dispatch(updateCurrentPath("Home", "Dashboard"));
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
        {allowedUsers.includes(userRole) && (
          <>
            <TopCard
              title="Entitled as Doc.Creater"
              text={dashboardCounter.docCreater?.toString() || "0"}
              icon="users"
              class="success"
            />
            <TopCard
              title="Entitled as Quality User"
              text={dashboardCounter.QtyUser?.toString() || "0"}
              icon="users"
              class="success"
            />
            {/* <TopCard
              title="Categories"
              text={dashboardCounter.docCategories.toString() || "0"}
              icon="sitemap"
              class="success"
            /> */}
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
            <TopCard
              title="Perpetual Documents"
              text={dashboardCounter.perceptual.toString() || "0"}
              icon="folder-open"
              class="success"
            />
            <TopCard
              title="Non Perpetual Documents"
              text={dashboardCounter.non_perceptual.toString() || "0"}
              icon="folder-open"
              class="success"
            />
          </>
        )}
        {!allowedUsers.includes(userRole) && (
          <>
            <TopCard
              title="Document Types"
              text={dashboardCounter.docTypes?.toString() || "0"}
              icon="fas fa-project-diagram"
              class="success"
            />
          </>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
