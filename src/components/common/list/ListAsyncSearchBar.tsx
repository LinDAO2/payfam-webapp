import styled from "@emotion/styled";
import { ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

const Wrapper = styled(Box)`
  width: 100%;
  // background-color: #eee;
  // padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  font-size: 0.8rem;
  color: #ccc;
  // margin-right: 20px;
`;

interface Props {
  list: any[];
  contains: (list: any, query: string) => boolean;
  renderOption: any;
  stringify: any;
  placeHolderText: string;
  isSearching: boolean;
  query: string;
  setQuery: any;
}

const ListAsyncSearchBar = ({
  contains,
  renderOption,
  stringify,
  placeHolderText,
  isSearching,
  list,
  query,
  setQuery,
}: Props) => {
  return (
    <Wrapper sx={{ bgcolor: "background.paper" }}>
      <Autocomplete
        options={list}
        getOptionLabel={(option) => (option.title ? option.title : "Query")}
        loading={isSearching}
        style={{ width: "100%", borderColor: "background.paper" }}
        renderInput={(params) => (
          <TextField
            {...params}
            // We have to manually set the corresponding fields on the input component
            name="query"
            variant="outlined"
            placeholder={placeHolderText}
            fullWidth
            size="medium"
            value={query}
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value !== "") {
                setQuery(e.target.value);
              }
            }}
            
          />
        )}
        renderOption={renderOption}
        filterOptions={createFilterOptions({
          matchFrom: "any",
          stringify: stringify,
          trim: true,
        })}
        freeSolo={true}
        isOptionEqualToValue={function (option, value) {
          return contains(option, query);
        }}
      />
    </Wrapper>
  );
};

export default ListAsyncSearchBar;
