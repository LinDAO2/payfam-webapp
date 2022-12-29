import { collectionActions } from "@/db/collection-slice";
import { store } from "@/db/store";
import { collectionServices } from "@/services/root";
import { IAccountPersona } from "@/types/account";
import {
  ICollectionDocumentStatus,
  ICollectionDocUniqueArg,
  ICollectionNames,
} from "@/types/collection-types";

import { shuffle } from "lodash";
import { showSnackbar } from "./snackbar-helpers";

export function getStatusColor(status: ICollectionDocumentStatus) {
  switch (status) {
    case "active":
      return "#43a047";
    case "inactive":
      return "#ef6c00";
    case "trash":
      return "#ff5722";
    case "blocked":
      return "#ff5722";
    case "draft":
      return "#3e2723";
    case "issues":
      return "#e64a19";
    case "underReview":
      return "#e65100";
    case "cancelled":
      return "#bf360c";
    case "complete":
      return "#1b5e20";

    default:
      return "#ddd";
  }
}

export const getDocs = async (
  collection: ICollectionNames,
  args: ICollectionDocUniqueArg[],
  docLimit?: number
) => {
  store.dispatch(collectionActions.setCollectionStateIsLoading(true));

  const { status, list, lastDoc, errorMessage, isEmpty } =
    await collectionServices.getDocs(collection, args, docLimit);

  store.dispatch(collectionActions.setCollectionStateIsLoading(false));

  if (status === "success") {
    store.dispatch(
      collectionActions.setCollection({
        all: {
          count: list.length,
          list: shuffle(list),
        },
        view: {
          count: list.length,
          list: shuffle(list),
          title: "",
        },
        lastDoc: lastDoc,
      })
    );

    store.dispatch(collectionActions.setCollectionStateSuccessStatus());
  }
  if (isEmpty !== undefined) {
    store.dispatch(collectionActions.setCollectionStateIsEmpty(isEmpty));
  }

  if (status === "error") {
    store.dispatch(collectionActions.setCollectionStateErrorStatus());
    showSnackbar({ status, msg: errorMessage, openSnackbar: true });
  }
};
export const fetchMoreDocs = async (
  collection: ICollectionNames,
  args: ICollectionDocUniqueArg[]
) => {
  const { status, list, lastDoc, errorMessage, isEmpty } =
    await collectionServices.fetchMoreDocs(
      collection,
      args,
      store.getState().collection.lastDoc
    );

  if (status === "success") {
    const currentList = store.getState().collection;

    store.dispatch(
      collectionActions.setCollection({
        view: {
          list: [...currentList.all.list, ...shuffle(list)],
          count: currentList.all.count + list.length,
          title: "Results",
        },
        all: {
          list: [...currentList.all.list, ...shuffle(list)],
          count: currentList.all.count + list.length,
        },

        lastDoc: lastDoc,
      })
    );

    store.dispatch(collectionActions.setCollectionStateSuccessStatus());
  }
  if (isEmpty !== undefined) {
    store.dispatch(collectionActions.setCollectionStateIsEmpty(isEmpty));
  }

  if (status === "error") {
    store.dispatch(collectionActions.setCollectionStateErrorStatus());
    showSnackbar({ status, msg: errorMessage, openSnackbar: true });
  }
};

export const getAllDocs = async (collection: ICollectionNames) => {
  store.dispatch(collectionActions.setCollectionStateIsLoading(true));
  const { status, list, lastDoc, errorMessage, isEmpty } =
    await collectionServices.getAllDocs(collection);
  store.dispatch(collectionActions.setCollectionStateIsLoading(false));
  if (status === "success") {
    store.dispatch(
      collectionActions.setCollection({
        all: {
          count: list.length,
          list,
        },
        view: {
          count: list.length,
          list,
          title: "",
        },
        lastDoc: lastDoc,
      })
    );

    store.dispatch(collectionActions.setCollectionStateSuccessStatus());
  }
  if (isEmpty !== undefined) {
    store.dispatch(collectionActions.setCollectionStateIsEmpty(isEmpty));
  }

  if (status === "error") {
    store.dispatch(collectionActions.setCollectionStateErrorStatus());
    showSnackbar({ status, msg: errorMessage, openSnackbar: true });
  }
};
export const fetchMoreAllDocs = async (collection: ICollectionNames) => {
  const { status, list, lastDoc, errorMessage, isEmpty } =
    await collectionServices.fetchMoreAllDocs(
      collection,

      store.getState().collection.lastDoc
    );

  if (status === "success") {
    const currentList = store.getState().collection;

    store.dispatch(
      collectionActions.setCollection({
        view: {
          list: [...currentList.all.list, ...list],
          count: currentList.all.count + list.length,
          title: "Results",
        },
        all: {
          list: [...currentList.all.list, ...list],
          count: currentList.all.count + list.length,
        },

        lastDoc: lastDoc,
      })
    );

    store.dispatch(collectionActions.setCollectionStateSuccessStatus());
  }
  if (isEmpty !== undefined) {
    store.dispatch(collectionActions.setCollectionStateIsEmpty(isEmpty));
  }
  if (status === "error") {
    store.dispatch(collectionActions.setCollectionStateErrorStatus());
    showSnackbar({ status, msg: errorMessage, openSnackbar: true });
  }
};

export const setPageState = (page: IAccountPersona) => {
  store.dispatch(collectionActions.setCollectionStatePage(page));
};

export const updateViewList = (option: any) => {
  store.dispatch(
    collectionActions.setViewList({
      view: {
        count: 1,
        list: [{ ...option }],
        title: "Search result",
      },
    })
  );
};
export const setViewList = (view: any) => {
  store.dispatch(
    collectionActions.setViewList({
      view,
    })
  );
};
export const setShowLoadMoreBtn = (state: boolean) => {
  store.dispatch(collectionActions.setCollectionStateShowLoadMoreBtn(state));
};
export const setFindElemInViewAndUpdate = (document: any) => {
  const currentList = store.getState().collection;
  const list = [...currentList.all.list];
  const index = list.findIndex((item) => item.uid === document.uid);
  list[index] = document;

  store.dispatch(
    collectionActions.setCollectionFindElemInViewAndUpdate({
      all: {
        count: list.length,
        list,
      },
      view: {
        count: list.length,
        list,
        title: "",
      },
    })
  );
};
export const setDuplicateUpdate = (document: any) => {
  const currentList = store.getState().collection;
  const list = [document, ...currentList.all.list];

  store.dispatch(
    collectionActions.setCollectionDuplicateUpdate({
      all: {
        count: list.length,
        list,
      },
      view: {
        count: list.length,
        list,
        title: "",
      },
    })
  );
};
export const setDeleteUpdate = (uid: string) => {
  const currentList = store.getState().collection;
  const list = [...currentList.all.list.filter((item) => item.uid !== uid)];

  store.dispatch(
    collectionActions.setCollectionDeleteUpdate({
      all: {
        count: list.length,
        list,
      },
      view: {
        count: list.length,
        list,
        title: "",
      },
    })
  );
};
