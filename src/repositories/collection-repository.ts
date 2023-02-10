import { db } from "@/configs/firebase";
import {
  ICollectionDocumentStatus,
  ICollectionDocUniqueArg,
  ICollectionNames,
} from "@/types/collection-types";
import { stringToArray } from "@/utils/funcs";
import {
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  collection,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  runTransaction,
  getCountFromServer,
  AggregateQuerySnapshot,
  AggregateField,
  OrderByDirection,
} from "firebase/firestore";
import { flatMapDeep, has } from "lodash";

interface ICollectionRepository<T> {
  addDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: T
  ): Promise<void>;
  editDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: T
  ): Promise<void>;
  deleteDoc(collectionName: ICollectionNames, uid: string): Promise<void>;
  getDoc(
    collectionName: ICollectionNames,
    uid: string
  ): Promise<DocumentSnapshot<unknown>>;
  getDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[]
  ): Promise<QuerySnapshot<unknown>>;
  fetchMoreDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    lastDoc: any
  ): Promise<QuerySnapshot<unknown>>;
  getDocCount(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[]
  ): Promise<
    AggregateQuerySnapshot<{
      count: AggregateField<number>;
    }>
  >;
  getAllDocs(collectionName: ICollectionNames): Promise<QuerySnapshot<unknown>>;
  fetchMoreAllDocs(
    collectionName: ICollectionNames,
    lastDoc: any
  ): Promise<QuerySnapshot<unknown>>;
  getAllDocCount(collectionName: ICollectionNames): Promise<
    AggregateQuerySnapshot<{
      count: AggregateField<number>;
    }>
  >;
  queryDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    input: string
  ): Promise<QuerySnapshot<unknown>>;

  queryAllDocs(
    collectionName: ICollectionNames,
    input: string
  ): Promise<QuerySnapshot<unknown>>;
  updateDocStatus(
    collectionName: ICollectionNames,
    uid: string,
    status: ICollectionDocumentStatus
  ): Promise<void>;
}

class CollectionRepository implements ICollectionRepository<any> {
  addDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: any
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    return setDoc(
      docRef,
      {
        ...values,
        addedOn: serverTimestamp(),
      },
      { merge: true }
    );
  }
  editDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: any
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    return setDoc(
      docRef,
      {
        ...values,
      },
      { merge: true }
    );
  }
  editDocWithTransaction(
    collectionName: ICollectionNames,
    docId: string,
    values: any
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    return runTransaction(db, async (transaction) => {
      const _doc = await transaction.get(docRef);
      if (!_doc.exists()) {
        return;
      }

      transaction.set(
        docRef,
        {
          ...values,
        },
        { merge: true }
      );
    });
  }
  deleteDoc(collectionName: ICollectionNames, uid: string): Promise<void> {
    const docRef = doc(db, collectionName, uid);
    return deleteDoc(docRef);
  }
  getDoc(
    collectionName: ICollectionNames,
    uid: string
  ): Promise<DocumentSnapshot<any>> {
    const docRef = doc(db, collectionName, uid);
    return getDoc(docRef);
  }
  getDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    docLimit = 20,
    dontUseOrderDefaultField = false
  ): Promise<QuerySnapshot<any>> {
    const whereInputs = flatMapDeep(
      args.map((_item) => {
        if (has(_item, "useCustomOrderField") === false) {
          const operator = _item.operator ? _item.operator : "==";

          return where(_item.uField, operator, _item.uid);
        }
        return [];
      })
    );
    const orderByInputs = args
      .filter(
        (_arg) => _arg.type === "orderby" && has(_arg, "orderByDirection")
      )
      .map((_item) => {
        return orderBy(_item.uField, _item.orderByDirection);
      });

    const customOrderByInputs = args
      .filter(
        (_arg) =>
          _arg?.useCustomOrderField === true && has(_arg, "orderByDirection")
      )
      .map((_item) => {
        return orderBy(_item.uField, _item.orderByDirection);
      });

    const customOrderByInputsCheck =
      customOrderByInputs.length > 0
        ? [customOrderByInputs]
        : dontUseOrderDefaultField
        ? []
        : [orderBy("addedOn", "desc")];

    const orderByInputsAll = flatMapDeep([
      ...orderByInputs,
      ...customOrderByInputsCheck,
    ]);

    const q = query(
      collection(db, collectionName),
      ...whereInputs,
      ...orderByInputsAll,
      limit(docLimit)
    );
    return getDocs(q);
  }
  getDocCount(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[]
  ): Promise<
    AggregateQuerySnapshot<{
      count: AggregateField<number>;
    }>
  > {
    const whereInputs = args.map((_item) => {
      const operator = _item.operator ? _item.operator : "==";

      return where(_item.uField, operator, _item.uid);
    });
    const orderByInputs = args
      .filter(
        (_arg) => _arg.type === "orderby" && has(_arg, "orderByDirection")
      )
      .map((_item) => {
        return orderBy(_item.uField, _item.orderByDirection);
      });

    const orderByInputsAll = [...orderByInputs, orderBy("addedOn", "desc")];

    const q = query(
      collection(db, collectionName),
      ...whereInputs,
      ...orderByInputsAll
    );
    return getCountFromServer(q);
  }
  fetchMoreDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    lastDoc: any,
    dontUseOrderDefaultField = false
  ): Promise<QuerySnapshot<any>> {
    // const whereInputs = args.map((_item) => {
    //   return where(_item.uField, "==", _item.uid);
    // });
    // const q = query(
    //   collection(db, collectionName),
    //   ...whereInputs,
    //   orderBy("addedOn", "desc"),
    //   startAfter(lastDoc),
    //   limit(20)
    // );
    // return getDocs(q);
    const whereInputs = flatMapDeep(
      args.map((_item) => {
        if (has(_item, "useCustomOrderField") === false) {
          const operator = _item.operator ? _item.operator : "==";

          return where(_item.uField, operator, _item.uid);
        }
        return [];
      })
    );
    const orderByInputs = args
      .filter(
        (_arg) => _arg.type === "orderby" && has(_arg, "orderByDirection")
      )
      .map((_item) => {
        return orderBy(_item.uField, _item.orderByDirection);
      });

    const customOrderByInputs = args
      .filter(
        (_arg) =>
          _arg?.useCustomOrderField === true && has(_arg, "orderByDirection")
      )
      .map((_item) => {
        return orderBy(_item.uField, _item.orderByDirection);
      });

    const customOrderByInputsCheck =
      customOrderByInputs.length > 0
        ? [customOrderByInputs]
        : dontUseOrderDefaultField
        ? []
        : [orderBy("addedOn", "desc")];

    const orderByInputsAll = flatMapDeep([
      ...orderByInputs,
      ...customOrderByInputsCheck,
    ]);

    const q = query(
      collection(db, collectionName),
      ...whereInputs,
      ...orderByInputsAll,
      startAfter(lastDoc),
      limit(50)
    );
    return getDocs(q);
  }
  getAllDocs(
    collectionName: ICollectionNames,
    docLimit = 20,
    order = "desc" as OrderByDirection | undefined
  ): Promise<QuerySnapshot<any>> {
    const q = query(
      collection(db, collectionName),
      orderBy("addedOn", order),
      limit(docLimit)
    );

    return getDocs(q);
  }
  getAllDocCount(collectionName: ICollectionNames): Promise<
    AggregateQuerySnapshot<{
      count: AggregateField<number>;
    }>
  > {
    const q = query(collection(db, collectionName), orderBy("addedOn", "desc"));

    return getCountFromServer(q);
  }
  fetchMoreAllDocs(
    collectionName: ICollectionNames,
    lastDoc: any,
    docLimit = 20,
    order = "desc" as OrderByDirection | undefined
  ): Promise<QuerySnapshot<any>> {
    const q = query(
      collection(db, collectionName),
      orderBy("addedOn", order),
      startAfter(lastDoc),
      limit(docLimit)
    );

    return getDocs(q);
  }
  queryDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    input: string
  ): Promise<QuerySnapshot<any>> {
    const whereInputs = args.map((_item) => {
      return where(_item.uField, "==", _item.uid);
    });
    const q = query(
      collection(db, collectionName),
      ...whereInputs,
      where("metadata.query", "array-contains-any", [
        ...stringToArray(input).slice(0, 5),
        input.slice(5),
      ])
    );
    return getDocs(q);
  }
  queryAllDocs(
    collectionName: ICollectionNames,
    input: string
  ): Promise<QuerySnapshot<any>> {
    const q = query(
      collection(db, collectionName),
      where("metadata.query", "array-contains-any", [
        ...stringToArray(input).slice(0, 5),
        input.slice(5),
      ])
    );
    return getDocs(q);
  }
  updateDocStatus(
    collectionName: ICollectionNames,
    uid: string,
    status: ICollectionDocumentStatus
  ): Promise<void> {
    const docRef = doc(db, collectionName, uid);
    return setDoc(
      docRef,
      {
        metadata: {
          status: status,
        },
      },
      {
        merge: true,
      }
    );
  }
}

export default CollectionRepository;
