import { ISessionState } from "@/db/session-slice";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { isUndefined } from "lodash";
import { useEffect, useState } from "react";
import { generateUUIDV4, parseOptionWithMatch } from "@/utils/funcs";
import { useCollection, useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import {
  getAllDocs,
  setPageState,
  setShowLoadMoreBtn,
} from "@/helpers/collection-helpers";

import { MoMoDepositDoc } from "@/types/momo-deposit-types";
import ListAsyncSearchBar from "@/components/common/list/ListAsyncSearchBar";
import { store } from "@/db/store";
import { collectionActions } from "@/db/collection-slice";
import { Replay } from "@mui/icons-material";

const ManageMoMoDepositSearch = () => {
  const [list, setList] = useState<MoMoDepositDoc[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const collectionState = useCollection();
  const profile = useSession() as ISessionState;

  useEffect(() => {
    (async () => {
      setList([]);
      setIsSearching(true);
      if (collectionState.page === "mgt") {
        const {
          status,
          list: _list,
          errorMessage,
        } = await collectionServices.queryAllDocs("MomoDeposits", query);
        if (status === "success") {
          setIsSearching(false);
          const result = _list as MoMoDepositDoc[];
          setList(result);
        }
        if (status === "error") {
          setIsSearching(false);
          showSnackbar({
            status: "error",
            msg: errorMessage,
            openSnackbar: true,
          });
        }
      }
    })();
  }, [query, profile.uid, collectionState]);

  const contains = (doc: MoMoDepositDoc, query: string) => {
    if (!isUndefined(query)) {
      const formattedQuery = query?.toLowerCase();
      const { referenceCode } = doc;

      if (referenceCode?.includes(formattedQuery)) {
        return true;
      }
    }

    return false;
  };

  const renderOption = (
    props: any,
    option: MoMoDepositDoc,
    { inputValue }: { inputValue: string }
  ) => {
    const partsReferenceCode = parseOptionWithMatch(
      `${option.referenceCode}`,
      inputValue
    );

    return (
      <Box
        component="li"
        {...props}
        key={generateUUIDV4()}
        onClick={() => {
          setShowLoadMoreBtn(false);
          store.dispatch(
            collectionActions.setCollection({
              all: {
                count: 1,
                list: [option],
              },
              view: {
                count: 1,
                list: [option],
                title: "",
              },
              lastDoc: {},
            })
          );
        }}
      >
        <Stack>
          <Typography variant="subtitle2">
            {partsReferenceCode?.map((part, index) => (
              <span
                key={index}
                style={{
                  color: part.highlight ? "#1b5e20" : "#81c784",
                }}
              >
                {part.text}
              </span>
            ))}
          </Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />
      </Box>
    );
  };

  const stringify = (option: MoMoDepositDoc) => {
    return `${option.referenceCode?.toLowerCase()}`;
  };

  return (
    <Stack direction="row" alignItems="center">
      <ListAsyncSearchBar
        list={list}
        contains={contains}
        renderOption={renderOption}
        stringify={stringify}
        placeHolderText={"Search for reference code"}
        isSearching={isSearching}
        query={query}
        setQuery={setQuery}
      />
      <IconButton
        onClick={async () => {
          await getAllDocs("MomoDeposits");

          setPageState("mgt");
          setShowLoadMoreBtn(true);
        }}
      >
        <Replay />
      </IconButton>
    </Stack>
  );
};

export default ManageMoMoDepositSearch;
