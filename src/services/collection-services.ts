import CollectionRepository from "@/repositories/collection-repository";
import {
  ICollectionDocumentStatus,
  ICollectionDocUniqueArg,
  ICollectionNames,
} from "@/types/collection-types";
import {
  countResponse,
  DocQueryResponse,
  listQueryAsyncResponse,
  mutationResponse,
} from "@/types/promise-types";

interface ICollectionServices<T> {
  addDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: T
  ): Promise<mutationResponse>;
  editDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: T
  ): Promise<mutationResponse>;
  deleteDoc(
    collectionName: ICollectionNames,
    uid: string
  ): Promise<mutationResponse>;
  getDoc(
    collectionName: ICollectionNames,
    uid: string
  ): Promise<DocQueryResponse<any>>;
  getDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    docLimit?: number
  ): Promise<listQueryAsyncResponse<any>>;
  fetchMoreDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    lastDoc: any
  ): Promise<listQueryAsyncResponse<any>>;
  getDocCount(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[]
  ): Promise<countResponse>;
  getAllDocs(
    collectionName: ICollectionNames
  ): Promise<listQueryAsyncResponse<any>>;
  getAllDocCount(collectionName: ICollectionNames): Promise<countResponse>;
  fetchMoreAllDocs(
    collectionName: ICollectionNames,
    lastDoc: any
  ): Promise<listQueryAsyncResponse<any>>;
  queryDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    input: string
  ): Promise<listQueryAsyncResponse<any>>;

  queryAllDocs(
    collectionName: ICollectionNames,
    input: string
  ): Promise<listQueryAsyncResponse<any>>;
  updateDocStatus(
    collectionName: ICollectionNames,
    uid: string,
    status: ICollectionDocumentStatus
  ): Promise<mutationResponse>;
}

class CollectionServices implements ICollectionServices<any> {
  protected repository: CollectionRepository;
  constructor() {
    this.repository = new CollectionRepository();
  }
  async addDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: any
  ): Promise<mutationResponse> {
    try {
      await this.repository.addDoc(collectionName, docId, values);
      return {
        status: "success",
        errorMessage: "",
        successMessage: "document created successfully!",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
  async editDoc(
    collectionName: ICollectionNames,
    docId: string,
    values: any
  ): Promise<mutationResponse> {
    try {
      await this.repository.editDoc(collectionName, docId, values);
      return {
        status: "success",
        errorMessage: "",
        successMessage: "document edited successfully!",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
  async editDocWithTransaction(
    collectionName: ICollectionNames,
    docId: string,
    values: any
  ): Promise<mutationResponse> {
    try {
      await this.repository.editDocWithTransaction(
        collectionName,
        docId,
        values
      );
      return {
        status: "success",
        errorMessage: "",
        successMessage: "document edited successfully!",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
  async deleteDoc(
    collectionName: ICollectionNames,
    uid: string
  ): Promise<mutationResponse> {
    try {
      await this.repository.deleteDoc(collectionName, uid);
      return {
        status: "success",
        errorMessage: "",
        successMessage: "document deleted successfully!",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
  async getDoc(
    collectionName: ICollectionNames,
    uid: string
  ): Promise<DocQueryResponse<any>> {
    try {
      const doc = await this.repository.getDoc(collectionName, uid);

      if (doc.exists()) {
        const data = doc.data() as any;
        return {
          status: "success",
          errorMessage: "",
          item: { uid: doc.id, ...data },
        };
      }

      return {
        status: "error",
        errorMessage: "no item found!",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
      };
    }
  }
  async getDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    docLimit?: number,
    dontUseOrderDefaultField?: boolean
  ): Promise<listQueryAsyncResponse<any>> {
    try {
      const querySnapshot = await this.repository.getDocs(
        collectionName,
        args,
        docLimit,
        dontUseOrderDefaultField
      );
      const isCollectionEmpty = querySnapshot.size === 0;

      const list: any[] = [];
      if (!isCollectionEmpty) {
        querySnapshot.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() });
        });
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        status: "success",
        errorMessage: "no error",
        list: list,
        lastDoc: lastDoc,
        loading: false,
        isEmpty: isCollectionEmpty,
      };
    } catch (error: any) {
      console.log(error.message);

      return {
        status: "error",
        errorMessage: error.message,
        list: [],
        lastDoc: {},
        loading: false,
        isEmpty: true,
      };
    }
  }
  async getDocCount(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[]
  ): Promise<countResponse> {
    try {
      const querySnapshot = await this.repository.getDocCount(
        collectionName,
        args
      );

      return {
        status: "success",
        errorMessage: "no error",
        count: querySnapshot.data().count,
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        count: 0,
      };
    }
  }
  async fetchMoreDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    lstDoc: any,
    dontUseOrderDefaultField?: boolean
  ): Promise<listQueryAsyncResponse<any>> {
    try {
      const querySnapshot = await this.repository.fetchMoreDocs(
        collectionName,
        args,
        lstDoc,
        dontUseOrderDefaultField
      );
      const isCollectionEmpty = querySnapshot.size === 0;

      const list: any[] = [];
      if (!isCollectionEmpty) {
        querySnapshot.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() });
        });
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        status: "success",
        errorMessage: "no error",
        list: list,
        lastDoc: lastDoc,
        loading: false,
        isEmpty: isCollectionEmpty,
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        list: [],
        lastDoc: {},
        loading: false,
        isEmpty: true,
      };
    }
  }
  async getAllDocs(
    collectionName: ICollectionNames,
    docLimit = 20
  ): Promise<listQueryAsyncResponse<any>> {
    try {
      const querySnapshot = await this.repository.getAllDocs(
        collectionName,
        docLimit
      );
      const isCollectionEmpty = querySnapshot.size === 0;

      const list: any[] = [];
      if (!isCollectionEmpty) {
        querySnapshot.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() });
        });
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        status: "success",
        errorMessage: "no error",
        list: list,
        lastDoc: lastDoc,
        loading: false,
        isEmpty: isCollectionEmpty,
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        list: [],
        lastDoc: {},
        loading: false,
        isEmpty: true,
      };
    }
  }
  async getAllDocCount(
    collectionName: ICollectionNames
  ): Promise<countResponse> {
    try {
      const querySnapshot = await this.repository.getAllDocCount(
        collectionName
      );

      return {
        status: "success",
        errorMessage: "no error",
        count: querySnapshot.data().count,
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        count: 0,
      };
    }
  }
  async fetchMoreAllDocs(
    collectionName: ICollectionNames,
    lstDoc: any,
    docLimit = 20
  ): Promise<listQueryAsyncResponse<any>> {
    try {
      const querySnapshot = await this.repository.fetchMoreAllDocs(
        collectionName,
        lstDoc,
        docLimit
      );
      const isCollectionEmpty = querySnapshot.size === 0;

      const list: any[] = [];
      if (!isCollectionEmpty) {
        querySnapshot.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() });
        });
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        status: "success",
        errorMessage: "no error",
        list: list,
        lastDoc: lastDoc,
        loading: false,
        isEmpty: isCollectionEmpty,
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        list: [],
        lastDoc: {},
        loading: false,
        isEmpty: true,
      };
    }
  }
  async queryDocs(
    collectionName: ICollectionNames,
    args: ICollectionDocUniqueArg[],
    input: string
  ): Promise<listQueryAsyncResponse<any>> {
    try {
      const querySnapshot = await this.repository.queryDocs(
        collectionName,
        args,
        input
      );
      const isCollectionEmpty = querySnapshot.size === 0;

      const list: any[] = [];
      if (!isCollectionEmpty) {
        querySnapshot.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() });
        });
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        status: "success",
        errorMessage: "no error",
        list: list,
        lastDoc: lastDoc,
        loading: false,
        isEmpty: isCollectionEmpty,
      };
    } catch (error: any) {
      console.log(error.message);

      return {
        status: "error",
        errorMessage: error.message,
        list: [],
        lastDoc: {},
        loading: false,
        isEmpty: true,
      };
    }
  }
  async queryAllDocs(
    collectionName: ICollectionNames,
    input: string
  ): Promise<listQueryAsyncResponse<any>> {
    try {
      const querySnapshot = await this.repository.queryAllDocs(
        collectionName,
        input
      );
      const isCollectionEmpty = querySnapshot.size === 0;

      const list: any[] = [];
      if (!isCollectionEmpty) {
        querySnapshot.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() });
        });
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        status: "success",
        errorMessage: "no error",
        list: list,
        lastDoc: lastDoc,
        loading: false,
        isEmpty: isCollectionEmpty,
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        list: [],
        lastDoc: {},
        loading: false,
        isEmpty: true,
      };
    }
  }
  async updateDocStatus(
    collectionName: ICollectionNames,
    uid: string,
    status: ICollectionDocumentStatus
  ): Promise<mutationResponse> {
    try {
      await this.repository.updateDocStatus(collectionName, uid, status);
      return {
        status: "success",
        errorMessage: "",
        successMessage: "document updated successfully!",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
}

export default CollectionServices;
