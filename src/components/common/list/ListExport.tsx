import { LoadingButton } from "@mui/lab";
import { Collapse, Divider, Paper, Stack, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { generateUUIDV4 } from "@/utils/funcs";
import { ICollectionNames } from "@/types/collection-types";
import { collectionServices } from "@/services/root";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { showSnackbar } from "@/helpers/snackbar-helpers";
interface Props {
  collectionName: ICollectionNames;
  fileName: string;
}

const ListExport = ({ collectionName, fileName }: Props) => {
  const [processing, setProcessing] = useState(false);
  const [keysList, setKeysList] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [dataList, setDataList] = useState<any>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [exportAsJSON, setExportAsJSON] = useState(false);
  const [exportAsCSV, setExportAsCSV] = useState(false);

  const reset = () => {
    setExportAsJSON(false);
    setExportAsCSV(false);
    setDataList([]);
    setSelectedKeys([]);
    setKeysList([]);
    setShowOptions(false);
  };

  const downloadFile = ({ data, fileName, fileType }: any) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  return (
    <Stack alignItems="center">
      <LoadingButton
        loading={processing && keysList.length === 0}
        variant="contained"
        sx={{ width: "fit-content" }}
        onClick={async () => {
          if (!showOptions) {
            setProcessing(true);
            const { status, list } = await collectionServices.getAllDocs(
              collectionName,
              1000
            );
            if (status && list) {
              setDataList([...list]);
              let uniqueKeys: string[] = [];

              list.forEach((item) => {
                const itemKeys = Object.keys(item);
                itemKeys.forEach((elem) => {
                  if (uniqueKeys.includes(elem) === false) {
                    uniqueKeys.push(elem);
                  }
                });
              });

              setKeysList(uniqueKeys);
              setShowOptions(true);
            }
            setProcessing(false);
          } else {
            reset();
          }
        }}
        endIcon={showOptions ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      >
        Export All as CSV{" "}
      </LoadingButton>
      <Collapse in={showOptions}>
        <Paper sx={{ width: 300, p: 1, mt: 1 }}>
          <Typography variant="caption" color="textPrimary">
            Select the fields you want to export
          </Typography>
          <FormControl>
            <FormGroup row>
              {keysList.length > 0 &&
                keysList.map((key) => (
                  <FormControlLabel
                    key={generateUUIDV4()}
                    control={
                      <Checkbox
                        checked={selectedKeys.includes(key) === true}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          //  add if not in array
                          if (selectedKeys.includes(key) === false) {
                            const newArray = [...selectedKeys, key];
                            setSelectedKeys(newArray);
                          } else {
                            //remove if already in array
                            const filter = selectedKeys.filter(
                              (iten) => iten !== key
                            );
                            const newArray = [...filter];
                            setSelectedKeys(newArray);
                          }
                        }}
                        name={key}
                      />
                    }
                    label={key}
                  />
                ))}
            </FormGroup>
          </FormControl>
          <Divider flexItem />
          <Stack alignItems="center">
            <Typography variant="caption" color="textPrimary">
              Pick a format
            </Typography>
            <FormControl>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportAsCSV}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setExportAsCSV(!exportAsCSV);
                      }}
                      name={"export-csv"}
                    />
                  }
                  label={"CSV"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportAsJSON}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setExportAsJSON(!exportAsJSON);
                      }}
                      name={"export-json"}
                    />
                  }
                  label={"JSON"}
                />
              </FormGroup>
            </FormControl>
            <LoadingButton
              disabled={selectedKeys.length === 0}
              variant="contained"
              sx={{ width: "fit-content" }}
              onClick={() => {
                if (exportAsCSV === false && exportAsJSON === false) {
                  showSnackbar({
                    status: "warning",
                    openSnackbar: true,
                    msg: "Pick a format to export!",
                  });
                } else {
                  let exportedList: any = [];

                  dataList.forEach((elem: any) => {
                    let exportedElement: any = {};
                    for (const key in elem) {
                      if (Object.prototype.hasOwnProperty.call(elem, key)) {
                        const element = elem[key];
                        if (selectedKeys.includes(key) === true) {
                          exportedElement = {
                            ...exportedElement,
                            [key]: element,
                          };
                        }
                      }
                    }
                    exportedList.push(exportedElement);
                  });

                  setTimeout(() => {
                    if (exportAsCSV) {
                      // Headers for each column
                      let headers = [...selectedKeys];

                      let sortedDataList: any = [];
                      exportedList.forEach((element: any) => {
                        const itemKeys = Object.keys(element);
                        let _data: any = {};
                        itemKeys.sort().forEach((elem) => {
                          headers.sort().forEach((head) => {
                            if (head === elem) {
                              _data = { ..._data, [elem]: element[elem] };
                            }
                          });
                        });

                        sortedDataList.push(_data);
                      });

                      // Convert data to a csv
                      let CsvData = sortedDataList.reduce(
                        (acc: any, data: any) => {
                          acc.push([Object.values(data)].sort().join(","));
                          return acc;
                        },
                        []
                      );

                      downloadFile({
                        data: [headers.join(","), ...CsvData].join("\n"),
                        fileName: `${fileName}.csv`,
                        fileType: "text/csv",
                      });
                      reset();
                    }
                    if (exportAsJSON) {
                      downloadFile({
                        data: JSON.stringify(exportedList),
                        fileName: `${fileName}.json`,
                        fileType: "text/json",
                      });

                      reset();
                    }
                  }, 1000);
                }
              }}
            >
              Export
            </LoadingButton>
          </Stack>
        </Paper>
      </Collapse>
    </Stack>
  );
};

export default ListExport;
