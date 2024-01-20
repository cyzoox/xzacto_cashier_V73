import { Item } from "native-base";
import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Categories,
  Customers,
  Expenses,
  Product,
  Staffs,
  List,
  Transactions,
  TR_Details,
  Archive,
  ArchiveInfo,
  AttendanceLogs,
  Credit_Logs,
  Credit_List,
  BO,
  Returned,
  Discount,
  Products,
  Settings,
  Inventory,
  Addon,
  Option,
  Stores,
  DeliveryRequest,
  DeliveryRequestDetails,
  WarehouseProducts,
  DeliveryReport,
  DeliveryReportSummary,
  DeliveryReportWarehouse,
  TransferLogs,
  DeliveryStoreSummary,
} from "../../schemas";
import { useAuth } from "./AuthContext";
import uuid from "react-native-uuid";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from "@react-native-firebase/firestore";
import { useCallback } from "react";
const StoreContext = React.createContext(null);

const StoreProvider = ({ children, projectPartition, store_info }) => {
  console.log("store_info", store_info);
  const date = moment().unix();
  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [trdetails, setTrDetails] = useState([]);
  const [custom_trdetails, setCustomTrDetails] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [archive, setArchive] = useState([]);
  const [archiveInfo, setArchiveInfo] = useState([]);
  const [settings, setSettings] = useState([]);
  const [attendance_logs, setAttendanceLogs] = useState([]);
  const [bos, setBO] = useState([]);
  const [returns, setReturns] = useState([]);
  const realmRef = useRef(null);
  const today = moment().unix();
  const [products_list, setProductss] = useState([]);
  const [cart, setLists] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [option, setOption] = useState([]);
  const [addon, setAddon] = useState([]);
  const [stores, setStores] = useState([]);
  const [delivery_request, setDeliveryRequests] = useState([]);
  const [delivery_req_details, setDeliveryRequestDetails] = useState([]);
  const [fontBodySize, setFontBodySize] = useState(1); // Default font type
  const [fontHeaderSize, setFontHeaderSize] = useState(2);

  useEffect(() => {
    loadPrinterSettings();

    const OpenRealmBehaviorConfiguration = {
      type: "openImmediately",
    };
    const config = {
      schema: [
        Categories.schema,
        Customers.schema,
        Expenses.schema,
        Products.schema,
        Staffs.schema,
        List.schema,
        Transactions.schema,
        TR_Details.schema,
        Archive.schema,
        ArchiveInfo.schema,
        AttendanceLogs.schema,
        Credit_Logs.schema,
        Credit_List.schema,
        BO.schema,
        Returned.schema,
        Discount.schema,
        Settings.schema,
        Inventory.schema,
        Addon.schema,
        Option.schema,
        Stores.schema,
        DeliveryRequest.schema,
        DeliveryRequestDetails.schema,
        WarehouseProducts.schema,
        DeliveryReport.schema,
        DeliveryReportSummary.schema,
        DeliveryStoreSummary.schema,
        DeliveryReportWarehouse.schema,
        TransferLogs.schema,
      ],
      sync: {
        user: user,
        partitionValue: projectPartition,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };

    // TODO: Open the project realm with the given configuration and store
    // it in the realmRef. Once opened, fetch the Task objects in the realm,
    // sorted by name, and attach a listener to the Task collection. When the
    // listener fires, use the setTasks() function to apply the updated Tasks
    // list to the state.

    setLoading(true);

    Realm.open(config).then((projectPOS) => {
      realmRef.current = projectPOS;

      const getCategory = projectPOS.objects("Categories");

      let sortedCategory = getCategory.sorted("name");
      setCategory([...sortedCategory]);
      sortedCategory.addListener(() => {
        setCategory([...sortedCategory]);
      });

      const syncStore = projectPOS.objects("Stores");
      let sortedStore = syncStore.sorted("name");
      setStores([...sortedStore]);
      sortedStore.addListener(() => {
        setStores([...sortedStore]);
        setLoading(false);
      });

      const syncProducts = projectPOS.objects("Products");
      let sortedProducts = syncProducts.sorted("name");
      setProducts([...sortedProducts]);
      sortedProducts.addListener(() => {
        setProducts([...sortedProducts]);
      });

      const syncExpenses = projectPOS.objects("Expenses");
      // const filteredExpenses = syncExpenses.filtered("store_id == $0", store_info._id);
      const filteredExpenses2 = syncExpenses.filtered(
        "date == $0",
        moment.unix(date).format("MMMM DD, YYYY")
      );
      let sortedExpenses = filteredExpenses2.sorted("description");
      setExpenses([...sortedExpenses]);
      sortedExpenses.addListener(() => {
        setExpenses([...sortedExpenses]);
      });

      const syncList = projectPOS.objects("List");
      // const filteredList = syncList.filtered("store_id == $0", store_info._id);
      let sortedList = syncList.sorted("name");
      setList([...sortedList]);
      sortedList.addListener(() => {
        setList([...sortedList]);
      });

      const syncCustomers = projectPOS.objects("Customers");
      // const filteredCustomer = syncCustomers.filtered("store_id == $0", store_info._id);
      let sortedCustomers = syncCustomers.sorted("name");
      setCustomers([...sortedCustomers]);
      sortedCustomers.addListener(() => {
        setCustomers([...sortedCustomers]);
      });

      const syncStaffs = projectPOS.objects("Staffs");
      // const filteredStaff = syncStaffs.filtered("store_id == $0", store_info._id);
      let sortedStaffs = syncStaffs.sorted("name");
      setStaffs([...sortedStaffs]);
      sortedStaffs.addListener(() => {
        setStaffs([...sortedStaffs]);
      });

      const syncArchive = projectPOS.objects("Archive");
      // const filteredArchive = syncArchive.filtered("store_id == $0", store_info._id);
      let sortedArchive = syncArchive.sorted("timeStamp");
      setArchive([...sortedArchive]);
      sortedArchive.addListener(() => {
        setArchive([...sortedArchive]);
      });

      const syncTR_Details = projectPOS.objects("TR_Details");
      // const filteredTR_Details = syncTR_Details.filtered("store_id == $0", store_info._id);
      const filteredTodaysTR_Details = syncTR_Details.filtered(
        "date == $0",
        moment.unix(today).format("MMMM DD, YYYY")
      );
      let sortedTR_Details = filteredTodaysTR_Details.sorted("timeStamp");
      setCustomTrDetails([...sortedTR_Details]);
      sortedTR_Details.addListener(() => {
        setCustomTrDetails([...sortedTR_Details]);
      });

      const syncArchiveInfo = projectPOS.objects("ArchiveInfo");
      // const filteredArchiveInfo = syncArchiveInfo.filtered("store_id == $0", store_info._id);
      let sortedArchiveInfo = syncArchiveInfo.sorted("timeStamp");
      setArchiveInfo([...sortedArchiveInfo]);
      sortedArchiveInfo.addListener(() => {
        setArchiveInfo([...sortedArchiveInfo]);
      });

      const syncSettings = projectPOS.objects("Settings");
      setSettings([...syncSettings]);
      syncSettings.addListener(() => {
        setSettings([...syncSettings]);
      });

      const syncInventory = projectPOS.objects("Inventory");
      setInventory([...syncInventory]);
      syncInventory.addListener(() => {
        setInventory([...syncInventory]);
      });

      const syncAddon = projectPOS.objects("Addon");
      setAddon([...syncAddon]);
      syncAddon.addListener(() => {
        setAddon([...syncAddon]);
      });

      const syncOption = projectPOS.objects("Option");
      setOption([...syncOption]);
      syncOption.addListener(() => {
        setOption([...syncOption]);
      });

      const syncDeliveryRequests = projectPOS.objects("DeliveryRequest");
      let sortDeliveryRequests = syncDeliveryRequests.sorted("timeStamp");
      setDeliveryRequests([...sortDeliveryRequests]);
      sortDeliveryRequests.addListener(() => {
        setDeliveryRequests([...sortDeliveryRequests]);
      });

      const syncDeliveryRequestDetails = projectPOS.objects(
        "DeliveryRequestDetails"
      );
      // const filteredDeliveryRequestDetails = syncDeliveryRequestDetails.filtered("status == $0","Pending");
      let sortDeliveryRequestDetails = syncDeliveryRequestDetails.sorted(
        "pr_name"
      );
      setDeliveryRequestDetails([...sortDeliveryRequestDetails]);
      sortDeliveryRequestDetails.addListener(() => {
        setDeliveryRequestDetails([...sortDeliveryRequestDetails]);
      });

      {
        /*   
         const syncAttendanceLogs = projectPOS.objects("AttendanceLogs");
      const filteredAttendanceLogs = syncAttendanceLogs.filtered("store_id == $0", store_info._id);
      const filteredAttendanceDate = filteredAttendanceLogs.filtered("date == $0", moment.unix(date).format('MMMM DD, YYYY'));
      let sortedAttendanceLogs = filteredAttendanceDate.sorted("timeStamp");
      setAttendanceLogs([...sortedAttendanceLogs]);
      sortedAttendanceLogs.addListener(() => {
        setAttendanceLogs([...sortedAttendanceLogs]);
    
      });

      const syncBO = projectPOS.objects("BO");
      const filteredBO = syncBO.filtered("store_id == $0", store_info._id);
      const filteredBODate = filteredBO.filtered("date == $0", moment.unix(date).format('MMMM DD, YYYY'));
      let sortedBO = filteredBODate.sorted("timeStamp");
      setBO([...sortedBO]);
      sortedBO.addListener(() => {
        setBO([...sortedBO]);
    
      });

      const syncReturns = projectPOS.objects("Returned");
      const filteredReturns= syncReturns.filtered("store_id == $0", store_info._id);
      const filteredReturnsDate = filteredReturns.filtered("date == $0", moment.unix(date).format('MMMM DD, YYYY'));
      let sortedReturns= filteredReturnsDate.sorted("timeStamp");
      setReturns([...sortedReturns]);
      sortedReturns.addListener(() => {
        setReturns([...sortedReturns]);
        
      });*/
      }

      setLoading(false);
    });

    if (!user && user === null) {
      return () => {
        // cleanup function
        const projectPOS = realmRef.current;
        if (projectPOS) {
          projectPOS.close();
          realmRef.current = null;
        }
      };
    }
  }, [user]);

  const loadPrinterSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("printer_settings");
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setFontBodySize(parseInt(parsedSettings.fontBodySize));
        setFontHeaderSize(parseInt(parsedSettings.fontHeaderSize));
      }
    } catch (error) {
      console.error("Error loading printer settings:", error);
    }
  };

  const updateFontSettings = async (newFontBodySize, newFontHeaderSize) => {
    try {
      await AsyncStorage.setItem(
        "printer_settings",
        JSON.stringify({
          fontHeaderSize: newFontHeaderSize,
          fontBodySize: newFontBodySize,
        })
      );
      setFontHeaderSize(newFontHeaderSize);
      setFontBodySize(newFontBodySize);
    } catch (error) {
      console.error("Error updating printer settings:", error);
    }
  };

  const getTRDetails = (tr_id) => {
    const projectPOS = realmRef.current;
    const syncTrDetails = projectPOS.objects("TR_Details");
    const filteredTRDetails = syncTrDetails.filtered("tr_id == $0", tr_id);
    let sortedTrDetails = filteredTRDetails.sorted("name");
    setTrDetails([...sortedTrDetails]);
  };

  // const createStore = (newStore, branch ) => {
  //   const projectPOS = realmRef.current;
  //   projectPOS.write(() => {
  //     // Create a new task in the same partition -- that is, in the same project.
  //     projectPOS.create(
  //       "Store",
  //       new Store({
  //         name: newStore,
  //         branch: branch,
  //         owner: `${user.id}`,
  //         partition: `project=${user.id}`,
  //       })
  //     );
  //   });
  // };

  const createExpenses = (expenses) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("Expenses", new Expenses(expenses));
    });
  };

  const createDiscount = (discount) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("Discount", new Discount(discount));
    });
  };

  const createAttendanceLog = (log) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("AttendanceLogs", new AttendanceLogs(log));
    });
  };

  const createArchive = (archive, list) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("ArchiveInfo", new ArchiveInfo(archive));
    });
    createArchiveList(list, archive.id);
  };

  const createArchiveList = (list, ids) => {
    const projectPOS = realmRef.current;

    // Create a new task in the same partition -- that is, in the same project.
    list.forEach((item) => {
      let lists = {
        name: item.name,
        partition: item._partition,
        brand: item.brand,
        oprice: item.oprice,
        sprice: item.sprice,
        unit: item.unit,
        category: item.category,
        store_id: item.store_id,
        store: item.store,
        quantity: item.quantity,
        id: item._id,
        timeStamp: item.timeStamp,
        archive_id: ids,
        addon: item.addon,
        addon_price: item.addon_price,
        addon_cost: item.addon_cost,
        option: item.option,
      };
      projectPOS.write(() => {
        projectPOS.create("Archive", new Archive(lists));
      });
    });

    ondeleteList();
  };

  const createCustomer = (customer) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("Customers", new Customers(customer));
    });
  };

  const updateCustomer = (customer, new_customer) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      customer.name = new_customer.name;
      customer.address = new_customer.address;
      customer.mobile_no = new_customer.mobile_no;
      customer.credit_balance = new_customer.credit_balance;
    });
  };

  const createProducts = (product) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("Products", new Product(product));
    });
  };

  const createBO = (product) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("BO", new BO(product));
    });
  };

  const createReturn = (product) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("Returned", new Returned(product));
    });
  };

  const createList = (list, item) => {
    const projectPOS = realmRef.current;
    if (item.stock === 0) {
      return;
    }
    projectPOS.write(() => {
      const products = projectPOS.objects("List");
      const filteredProducts = products.filtered("_id == $0", list.id);

      if (filteredProducts.length === 0) {
        item.stock -= list.quantity;
        projectPOS.create("List", new List(list), "modified");
      } else {
        item.stock -= list.quantity;
        filteredProducts[0].quantity += list.quantity;
      }
    });
  };

  const createCreditLogs = (lists, credit_logs) => {
    const projectPOS = realmRef.current;

    projectPOS.write(() => {
      projectPOS.create("Credit_Logs", new Credit_Logs(credit_logs));

      const logs = projectPOS.objects("Customers");
      const filteredLogs = logs.filtered("_id == $0", credit_logs.customer_id);
      filteredLogs[0].credit_balance += credit_logs.total;
    });
    createCreditList(lists, credit_logs.id);
  };

  const createCreditList = (lists, crid) => {
    const projectPOS = realmRef.current;

    lists.forEach((item) => {
      let list = {
        name: item.name,
        partition: item._partition,
        brand: item.brand,
        oprice: item.oprice,
        sprice: item.sprice,
        unit: item.unit,
        category: item.category,
        store_id: item.store_id,
        store: item.store,
        quantity: item.quantity,
        cr_id: crid,
        id: uuid.v4(),
      };
      projectPOS.write(() => {
        projectPOS.create("Credit_List", new Credit_List(list));
      });
    });
  };

  const ReturnSingleItem = (items, reason, qty, req, staff) => {
    const projectPOS = realmRef.current;
    const request = projectPOS.objects("DeliveryRequest");
    const request2 = projectPOS.objects("DeliveryRequestDetails");

    const filteredRequest = request.filtered("_id == $0", req._id);
    const filteredRequest2 = request2.filtered("_id == $0", items._id);

    let req_details = {
      partition: `project=${user.id}`,
      id: uuid.v4(),
      pr_id: items.pr_id,
      request_id: req._id,
      pr_name: items.pr_name,
      pr_category: items.pr_category,
      stock: parseFloat(qty),
      store_id: items.store_id,
      status: "Returned",
      pr_oprice: items.pr_oprice,
      pr_sprice: items.pr_sprice,
      brand: items.brand,
      unit: items.unit,
      store: items.store,
      img: items.img,
      withAddons: false,
      withVariants: false,
      withOptions: false,
      sku: "",
      return_reason: reason,
      processed_by: staff.attendant,
    };
    projectPOS.write(() => {
      filteredRequest[0].total -= items.pr_sprice * parseFloat(qty);
      filteredRequest2[0].stock -= parseFloat(qty);

      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create(
        "DeliveryRequestDetails",
        new DeliveryRequestDetails(req_details)
      );
    });
  };

  const ReturnDelivery = (req, reason, staff) => {
    console.log("staff", staff);
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      const request = projectPOS.objects("DeliveryRequest");
      const filteredRequest = request.filtered("_id == $0", req._id);

      filteredRequest[0].processed_by = staff.attendant;
      filteredRequest[0].return_reason = reason;
      filteredRequest[0].status = "Returned";
    });
  };

  const onSendProducts = (productss, items) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      const products = projectPOS.objects("Products");
      const products2 = projectPOS.objects("WarehouseProducts");
      const request = projectPOS.objects("DeliveryRequest");

      const filteredProducts2 = products.filtered(
        "pr_id == $0",
        productss.pr_id
      );
      const filteredProducts3 = filteredProducts2.filtered(
        "store_id == $0",
        productss.store_id
      );
      const filteredRequest = request.filtered("_id == $0", items.request_id);

      const filteredProducts4 = products2.filtered(
        "_id == $0",
        productss.pr_id
      );

      if (filteredProducts3.length == 0) {
        filteredProducts4[0].stock -= productss.stock;
        filteredRequest[0].status = "Accepted";
        filteredRequest[0].processed_by = "Admin";
        items.status = "Accepted";
        projectPOS.create("Products", new Products(productss));
      } else {
        items.status = "Accepted";
        filteredRequest[0].status = "Accepted";
        filteredRequest[0].processed_by = "Admin";
        filteredProducts4[0].stock -= productss.stock;
        filteredProducts3[0].stock += productss.stock;
      }
    });
  };

  const createTransaction = (lists, transaction) => {
    const projectPOS = realmRef.current;

    projectPOS.write(() => {
      projectPOS.create("Transactions", new Transactions(transaction));
    });
    saveList(
      lists,
      transaction.id,
      transaction.attendant_id,
      transaction.attendant_name
    );
  };

  const reListArchive = (archives, user, store_info) => {
    archives.forEach((item) => {
      let list = {
        name: item.name,
        partition: item._partition,
        brand: item.brand,
        oprice: item.oprice,
        sprice: item.sprice,
        unit: item.unit,
        category: item.category,
        store_id: item.store_id,
        store: item.store,
        quantity: item.quantity,
        _id: item._id,
        timeStamp: item.timeStamp,
        addon_price: item.addon_price,
        addon_cost: item.addon_cost,
        option: item.option,
      };
      setProductss([...products_list, list]);
    });
  };

  const saveList = (lists, trid, name, id) => {
    const projectPOS = realmRef.current;
    const date = moment().unix();
    lists.forEach((item) => {
      let listss = {
        name: item.name,
        partition: item._partition,
        brand: item.brand,
        oprice: item.oprice,
        sprice: item.sprice,
        unit: item.unit,
        category: item.category,
        store_id: item.store_id,
        store: item.store,
        quantity: item.quantity,
        tr_id: trid,
        timeStamp: item.timeStamp,
        id: uuid.v4(),
        product_id: item._id,
        year: moment.unix(date).format("YYYY"),
        year_month: moment.unix(date).format("MMMM-YYYY"),
        year_week: moment.unix(date).format("WW-YYYY"),
        date: moment.unix(date).format("MMMM DD, YYYY"),
        status: "Completed",
        attendant_name: name,
        attendant_id: id,
        addon: "test",
        addon_price: item.addon_price,
        addon_cost: item.addon_cost,
        option: item.option,
        void_reason: "",
      };
      projectPOS.write(() => {
        projectPOS.create("TR_Details", new TR_Details(listss));
      });
    });

    onFinalTransaction(lists);
  };

  const onFinalTransaction = (lists) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      const products = projectPOS.objects("Products");
      const filteredProducts = products.filtered("_id == $0", list._id);

      lists.forEach((list) => {
        const filteredProducts = products.filtered("_id == $0", list._id);
        filteredProducts[0].stock = filteredProducts[0].stock - list.quantity;
      });
    });
    setProductss([]);
  };

  const deleteList = (lists) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      const products = projectPOS.objects("Products");
      const filteredProducts = products.filtered("_id == $0", lists._id);

      const newData = [...projectPOS.objects("List").sorted("name")];
      const prevIndex = list.findIndex((item) => item._id === lists._id);
      newData.splice(prevIndex, 1);

      filteredProducts[0].stock += lists.quantity;
      projectPOS.delete(lists);
      setList([Object.assign({}, newData)]);
    });
  };

  const incrementListQty = (qty, list, type, products) => {
    const projectPOS = realmRef.current;
    const filteredProducts = products.find(
      (product) => product._id === list._id
    );
    projectPOS.write(() => {
      if (type === "increment") {
        filteredProducts.stock = filteredProducts.stock - qty;
        list.quantity = list.quantity + qty;
      } else {
        filteredProducts.stock = filteredProducts.stock + qty;
        list.quantity = list.quantity - qty;
      }
    });
  };

  const editListQty = (items, qty) => {
    setProductss(
      products_list.map((x) => {
        if (x._id === items._id)
          return {
            ...x,
            quantity: qty,
            _id: x._id,
          };
        return x;
      })
    );
  };

  const createCategories = (name, uid) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create(
        "Categories",
        new Categories({
          partition: `project=${user.id}`,
          name: name,
          uid: uid,
        })
      );
    });
  };

  const createStaff = (name, uid, uname, password) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create(
        "Staffs",
        new Staffs({
          partition: `project=${user.id}`,
          login_am: "",
          login_pm: "",
          logout_am: "",
          logout_pm: "",
          name: name,
          store_id: uid,
          store: uname,
          password: password,
        })
      );
    });
  };

  const ondeleteList = () => {
    setProductss([]);
  };

  const updateArchiveOnClear = (store_info) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      const list = projectPOS.objects("Archive");
      const archive = projectPOS.objects("ArchiveInfo");

      const filteredList = list.filtered("store_id == $0", store_info._id);
      const filteredArchive = archive.filtered(
        "store_id == $0",
        store_info._id
      );

      projectPOS.delete(filteredList);
      projectPOS.delete(filteredArchive);
    });
    const newData = [...projectPOS.objects("ArchiveInfo")];
    const newData1 = [...projectPOS.objects("Archive")];
    setArchiveInfo(newData);
    setArchive(newData1);
  };

  const updateProductOnClear = (list) => {
    ondeleteList();
  };

  const onVoidTransaction = async (item, reason) => {
    const projectPOS = realmRef.current;
    const transaction = projectPOS.objects("Transactions");
    const filteredTransaction = transaction.filtered("_id == $0", item._id);
    const tr_details = projectPOS.objects("TR_Details");
    const filteredTrDetails = tr_details.filtered("tr_id == $0", item._id);
    const productss = projectPOS.objects("Products");

    projectPOS.write(() => {
      filteredTransaction[0].status = "Voided";
      filteredTransaction[0].void_reason = reason;

      filteredTrDetails.forEach((items) => {
        const filteredProducts = productss.filtered(
          "store_id == $0",
          items.store_id
        );
        const filteredProducts2 = filteredProducts.filtered(
          "_id == $0",
          items.product_id
        );

        items.status = "Voided";
        items.void_reason = reason;
        filteredProducts2[0].stock += items.quantity;
      });
    });
  };

  const onVoidSingleTransaction = async (item, reason) => {
    const projectPOS = realmRef.current;
    // const transaction = projectPOS.objects("Transactions");
    // const filteredTransaction = transaction.filtered("_id == $0", item._id);
    const tr_details = projectPOS.objects("TR_Details");
    const filteredTrDetails = tr_details.filtered("tr_id == $0", item._id);
    const productss = projectPOS.objects("Products");

    projectPOS.write(() => {
      // filteredTransaction[0].status = "Voided";
      // filteredTransaction[0].void_reason = reason;

      // filteredTrDetails.forEach(items => {

      const filteredProducts = productss.filtered(
        "store_id == $0",
        item.store_id
      );
      const filteredProducts2 = filteredProducts.filtered(
        "_id == $0",
        item.product_id
      );

      item.status = "Voided";
      item.void_reason = reason;
      filteredProducts2[0].stock += item.quantity;
      // });
    });
  };

  const deleteTask = (store) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      projectPOS.delete(store);
    });
  };

  const getCustomExpense = (type, value, personnel) => {
    const projectPOS = realmRef.current;
    switch (type) {
      case "Today":
        const syncTodaysTransactions = projectPOS.objects("Expenses");
        const filteredTodaysAttendanceLogs = syncTodaysTransactions.filtered(
          "date == $0",
          value.date
        );
        const filteredTodaysByPersonnel = filteredTodaysAttendanceLogs.filtered(
          "attendant_id == $0",
          personnel
        );
        let sortedTodaysTransactions = filteredTodaysByPersonnel.sorted(
          "timeStamp"
        );
        setExpenses([...sortedTodaysTransactions]);
        break;
      case "This week":
        const syncThisWeekTransactions = projectPOS.objects("Expenses");
        const filteredThisWeekAttendanceLogs = syncThisWeekTransactions.filtered(
          "year_week == $0",
          value.date
        );
        const filteredThisWeekByPersonnel = filteredThisWeekAttendanceLogs.filtered(
          "attendant_id == $0",
          personnel
        );
        let sortedThisWeekTransactions = filteredThisWeekByPersonnel.sorted(
          "timeStamp"
        );
        setExpenses([...sortedThisWeekTransactions]);
        break;
      default:
        const syncDefaultTransactions = projectPOS.objects("Expenses");
        const filteredDefaultAttendanceLogs = syncDefaultTransactions.filtered(
          "date == $0",
          value.date
        );
        const filteredDefaultByPersonnel = filteredDefaultAttendanceLogs.filtered(
          "attendant_id == $0",
          personnel
        );
        let sortedDefaultTransactions = filteredDefaultByPersonnel.sorted(
          "timeStamp"
        );
        setExpenses([...sortedDefaultTransactions]);
        break;
    }
  };

  const getCustomTransaction = (type, value, personnel) => {
    const projectPOS = realmRef.current;

    switch (type) {
      case "Today":
        const syncTodaysTransactions = projectPOS.objects("Transactions");
        const filteredTodaysAttendanceLogs = syncTodaysTransactions.filtered(
          "date == $0",
          value.date
        );
        const filteredTodaysByPersonnel = filteredTodaysAttendanceLogs.filtered(
          "attendant_id == $0",
          personnel
        );
        let sortedTodaysTransactions = filteredTodaysByPersonnel.sorted(
          "timeStamp"
        );
        setTransactions([...sortedTodaysTransactions]);
        break;
      case "This week":
        const syncThisWeekTransactions = projectPOS.objects("Transactions");
        const filteredThisWeekAttendanceLogs = syncThisWeekTransactions.filtered(
          "year_week == $0",
          value.date
        );
        const filteredThisWeekByPersonnel = filteredThisWeekAttendanceLogs.filtered(
          "attendant_id == $0",
          personnel
        );
        let sortedThisWeekTransactions = filteredThisWeekByPersonnel.sorted(
          "timeStamp"
        );
        setTransactions([...sortedThisWeekTransactions]);
        break;
      default:
        const syncDefaultTransactions = projectPOS.objects("Transactions");
        const filteredDefaultAttendanceLogs = syncDefaultTransactions.filtered(
          "date == $0",
          value.date
        );
        const filteredDefaultByPersonnel = filteredDefaultAttendanceLogs.filtered(
          "attendant_id == $0",
          personnel
        );
        let sortedDefaultTransactions = filteredDefaultByPersonnel.sorted(
          "timeStamp"
        );
        setTransactions([...sortedDefaultTransactions]);
        break;
    }
  };

  const onSaveList = (items, user, store_info) => {
    let list = {
      _partition: `project=${user.id}`,
      _id: items._id,
      name: items.name,
      brand: items.brand,
      oprice: items.oprice,
      sprice: items.sprice,
      unit: items.unit,
      category: items.category,
      store_id: store_info._id,
      store: items.store,
      quantity: items.quantity,
      uid: items._id,
      timeStamp: moment().unix(),
      addon: items.addon,
      addon_price: items.addon_price,
      addon_cost: items.addon_cost,
      option: items.option,
      sku: items.sku,
    };

    let index = products_list.findIndex((x) => x._id === items._id);
    if (index === -1) {
      setProductss([...products_list, list]);
    } else {
      if (items.withAddtional) {
        setProductss(
          products_list.map((x) => {
            if (x._id === items._id)
              return {
                ...x,
                quantity: items.quantity,
                _id: x._id,
                name: items.name,
                addon: items.addon,
                oprice: items.oprice,
                sprice: items.sprice,
                addon_price: items.addon_price,
                addon_cost: items.addon_cost,
                option: items.option,
                sku: items.sku,
              };
            return x;
          })
        );
      } else {
        setProductss(
          products_list.map((x) => {
            if (x._id === items._id)
              return {
                ...x,
                quantity: x.quantity + 1,
                _id: x._id,
              };
            return x;
          })
        );
      }
    }
  };

  const incrementQty = (items) => {
    setProductss(
      products_list.map((x) => {
        if (x._id === items._id)
          return {
            ...x,
            quantity: x.quantity + 1,
            _id: x._id,
          };
        return x;
      })
    );
  };

  const decrementQty = (items) => {
    setProductss(
      products_list.map((x) => {
        if (x._id === items._id)
          return {
            ...x,
            quantity: x.quantity - 1,
            _id: x._id,
          };
        return x;
      })
    );
  };
  const onLogIn = async (item, store_info) => {
    const projectPOS = realmRef.current;
    const store = projectPOS.objects("Stores");
    const filteredStore = store.filtered("_id == $0", store_info._id);

    let newStoreInfo = {
      _id: store_info._id,
      _partition: store_info._partition,
      branch: store_info.branch,
      name: store_info.name,
      owner: store_info.owner,
      password: store_info.password,
      attendant: item.name,
      attendant_id: item._id,
    };

    const storeValue = JSON.stringify(newStoreInfo);
    await AsyncStorage.setItem("@store", storeValue);

    projectPOS.write(() => {
      store_info.attendant_id = item._id;
      store_info.attendant = item.name;
      filteredStore[0].attendant_id = item._id;
      filteredStore[0].attendant = item.name;
    });
  };

  const deleteItem = useCallback((itemToDelete) => {
    setProductss((currentItems) =>
      currentItems.filter((item) => item._id !== itemToDelete._id)
    );
  }, []);

  const getCustomStore = () => {
    const projectPOS = realmRef.current;

    const syncDefaultStores = projectPOS.objects("Stores");
    let sortedDefaultTransactions = syncDefaultStores.sorted("name");
    setStores([...sortedDefaultTransactions]);
  };

  const createWarehouseDeliveryReport = (drw) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create(
        "DeliveryReportWarehouse",
        new DeliveryReportWarehouse(drw)
      );
    });
  };

  const createDeliverySummary = (drs) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create(
        "DeliveryReportSummary",
        new DeliveryReportSummary(drs)
      );
    });
  };

  const createStoreDeliverySummary = (drs) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("DeliveryStoreSummary", new DeliveryStoreSummary(drs));
    });
  };

  const createDeliveryReport = (drs) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("DeliveryReport", new DeliveryReport(drs));
    });
  };

  const createtransferLogs = (logs) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create("TransferLogs", new TransferLogs(logs));
    });
  };

  return (
    <StoreContext.Provider
      value={{
        deleteTask,
        loading,
        createProducts,
        products,
        createCategories,
        category,
        createExpenses,
        expenses,
        createCustomer,
        customers,
        createStaff,
        staffs,
        createList,
        list,
        deleteList,
        editListQty,
        createTransaction,
        transactions,
        custom_trdetails,
        trdetails,
        store_info,
        getTRDetails,
        createArchive,
        archive,
        archiveInfo,
        ondeleteList,
        updateProductOnClear,
        updateArchiveOnClear,
        reListArchive,
        settings,
        createAttendanceLog,
        attendance_logs,
        createCreditLogs,
        createCreditList,
        getCustomTransaction,
        getCustomExpense,
        createBO,
        bos,
        createReturn,
        returns,
        incrementListQty,
        onVoidTransaction,
        createDiscount,
        onSaveList,
        products_list,
        incrementQty,
        decrementQty,
        deleteItem,
        addon,
        option,
        inventory,
        stores,
        getCustomStore,
        onLogIn,
        onVoidSingleTransaction,
        delivery_request,
        delivery_req_details,
        ReturnDelivery,
        ReturnSingleItem,
        onSendProducts,
        createDeliveryReport,
        createStoreDeliverySummary,
        createtransferLogs,
        fontHeaderSize,
        fontBodySize,
        updateFontSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const store = useContext(StoreContext);
  if (store == null) {
    throw new Error("useStore() called outside of a StoreProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return store;
};

export { StoreProvider, useStore };
