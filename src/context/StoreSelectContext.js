import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import app from "../../getRealmApp";
import { useAuth } from "./AuthContext";
import {  Stores } from '../../schemas';


// Create a new Context object that will be provided to descendants of
// the AuthProvider.
const StoreSelectContext = React.createContext(null);

// The AuthProvider is responsible for user management and provides the
// AuthContext value to its descendants. Components under an AuthProvider can
// use the useAuth() hook to access the auth value.
const StoreSelectProvider = ({ children, projectPartition }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [store, setStores] = useState([]);

    const realmRef = useRef(null);

    useEffect(() => {
   

      const OpenRealmBehaviorConfiguration = {
        type: 'openImmediately',
      };

        const config = {
          schema:[Stores.schema],
          sync: {
            user: user,
            partitionValue: projectPartition,
            newRealmFileBehavior: OpenRealmBehaviorConfiguration,
            existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
          },
        };
      

        Realm.open(config).then((projectPOS) => {
            realmRef.current = projectPOS;
            const syncStore = projectPOS.objects("Stores");
            let sortedStore = syncStore.sorted("name");
            setStores([...sortedStore]);
            sortedStore.addListener(() => {
              
              setStores([...sortedStore]);
              setLoading(false)
            });
          });
      
        
     

 
          if (!user && user === null ) {
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

  const createStore = (newStore, branch ) => {
    const projectPOS = realmRef.current;
    projectPOS.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      projectPOS.create(
        "Stores",
        new Stores({
          name: newStore,
          branch: branch,
          owner: `${user.id}`,
          partition: `project=${user.id}`,
        })
      );
    });
  };

  const onLogOut = async(item, store_info) => {
    const projectPOS = realmRef.current;
    const store = projectPOS.objects("Store");
    const filteredStore = store.filtered("_id == $0", store_info._id);

    let newStoreInfo = {
      _id : store_info._id,
      _partition: store_info._partition,
      branch: store_info.branch,
      name: store_info.name,
      owner: store_info.owner,
      password: store_info.password,
      attendant: "",
      attendant_id: ""
  }

  const storeValue = JSON.stringify(newStoreInfo)
  await AsyncStorage.setItem('@store', storeValue)
 
    projectPOS.write(() => {
      item.outStamp = moment().unix();
      filteredStore[0].attendant = "";
      filteredStore[0].attendant_id = "";
      store_info.attendant_id = "";
      store_info.attendant = ""
      });

  }

  const onLogIn = async(item, store_info) => {
    const projectPOS = realmRef.current;
    const store = projectPOS.objects("Stores");
    const filteredStore = store.filtered("_id == $0", store_info._id);

    let newStoreInfo = {
        _id : store_info._id,
        _partition: store_info._partition,
        branch: store_info.branch,
        name: store_info.name,
        owner: store_info.owner,
        password: store_info.password,
        attendant: item.name,
        attendant_id: item._id
    }

    const storeValue = JSON.stringify(newStoreInfo)
    await AsyncStorage.setItem('@store', storeValue)

    projectPOS.write(() => {
      store_info.attendant_id = item._id;
      store_info.attendant = item.name;
      filteredStore[0].attendant_id = item._id;
      filteredStore[0].attendant = item.name
      });

  }
  const getCustomStore = () => {
    const projectPOS = realmRef.current;
 
    const syncDefaultStores= projectPOS.objects("Stores");
    let sortedDefaultTransactions = syncDefaultStores.sorted("name");
    setStores([...sortedDefaultTransactions]);
     
 
  }

  return (
    <StoreSelectContext.Provider
      value={{// list of projects the user is a memberOf
        store,
        projectPartition,
        loading,
        getCustomStore
      }}
    >
      {children}
    </StoreSelectContext.Provider>
  );
};

// The useAuth hook can be used by components under an AuthProvider to
// access the auth context value.
const useStoreSelect = () => {
  const storeselect = useContext(StoreSelectContext);
  if (storeselect == null) {
    throw new Error("useStoreSelect() called outside of a StoreSelectProvider?");
  }
  return storeselect;
};

export { StoreSelectProvider, useStoreSelect };
